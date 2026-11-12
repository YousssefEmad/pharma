/**
 * PharmaLink — Inter-warehouse shortage reservations & transfers
 * Cycle: shortage → peer request → reserve → ship → receive → close
 */
window.TransferService = (function () {
  function list(orgId) {
    const warehouses = DataAPI.data().warehouses.filter(function (w) { return w.orgId === orgId; });
    const ids = warehouses.map(function (w) { return w.id; });
    return (DataAPI.data().transfers || []).filter(function (tr) {
      return ids.indexOf(tr.fromWarehouseId) !== -1 || ids.indexOf(tr.toWarehouseId) !== -1;
    }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function ensureInventoryRow(d, warehouseId, productId) {
    let row = d.inventory.find(function (i) { return i.warehouseId === warehouseId && i.productId === productId; });
    if (!row) {
      d.counters.inventory = (d.counters.inventory || d.inventory.length) + 1;
      row = {
        id: 'INV-' + String(d.counters.inventory).padStart(3, '0'),
        warehouseId: warehouseId,
        productId: productId,
        onHand: 0,
        reserved: 0,
        minStock: 10,
        reorderLevel: 20,
        avgDailyUsage: 1,
        leadTimeDays: 5,
        safetyStock: 5,
        location: '—',
        updatedAt: new Date().toISOString()
      };
      d.inventory.push(row);
    }
    return row;
  }

  function create(payload) {
    let created = null;
    DataAPI.save(function (d) {
      d.counters.transfer = (d.counters.transfer || 0) + 1;
      created = {
        id: 'TR-' + String(d.counters.transfer).padStart(3, '0'),
        fromWarehouseId: payload.fromWarehouseId,
        toWarehouseId: payload.toWarehouseId,
        status: payload.status || 'pending',
        reservationId: payload.reservationId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: (payload.items || []).map(function (it) {
          return { productId: it.productId, qty: Number(it.qty) || 0 };
        }),
        notes: payload.notes || ''
      };
      d.transfers.unshift(created);
      return d;
    });
    return created;
  }

  function ship(transferId) {
    DataAPI.save(function (d) {
      const tr = d.transfers.find(function (x) { return x.id === transferId; });
      if (!tr || (tr.status !== 'pending' && tr.status !== 'reserved')) return d;
      (tr.items || []).forEach(function (it) {
        const src = ensureInventoryRow(d, tr.fromWarehouseId, it.productId);
        const qty = Number(it.qty) || 0;
        if ((src.reserved || 0) >= qty) src.reserved -= qty;
        else src.reserved = 0;
        src.onHand = Math.max(0, (src.onHand || 0) - qty);
        src.updatedAt = new Date().toISOString();
        d.counters.movement = (d.counters.movement || 0) + 1;
        d.movements.unshift({
          id: 'MOV-' + String(d.counters.movement).padStart(3, '0'),
          warehouseId: tr.fromWarehouseId,
          productId: it.productId,
          type: 'transfer_out',
          qty: -qty,
          ref: tr.id,
          date: new Date().toISOString(),
          notes: 'شحن تحويل إلى ' + tr.toWarehouseId
        });
      });
      tr.status = 'in_transit';
      tr.shippedAt = new Date().toISOString();
      tr.updatedAt = tr.shippedAt;
      return d;
    });
  }

  function receive(transferId) {
    DataAPI.save(function (d) {
      const tr = d.transfers.find(function (x) { return x.id === transferId; });
      if (!tr || (tr.status !== 'in_transit' && tr.status !== 'pending')) return d;
      // If still pending (demo shortcut), deduct source first
      if (tr.status === 'pending') {
        (tr.items || []).forEach(function (it) {
          const src = ensureInventoryRow(d, tr.fromWarehouseId, it.productId);
          const qty = Number(it.qty) || 0;
          if ((src.reserved || 0) >= qty) src.reserved -= qty;
          src.onHand = Math.max(0, (src.onHand || 0) - qty);
          src.updatedAt = new Date().toISOString();
        });
      }
      (tr.items || []).forEach(function (it) {
        const dst = ensureInventoryRow(d, tr.toWarehouseId, it.productId);
        const qty = Number(it.qty) || 0;
        dst.onHand = (dst.onHand || 0) + qty;
        dst.updatedAt = new Date().toISOString();
        d.counters.movement = (d.counters.movement || 0) + 1;
        d.movements.unshift({
          id: 'MOV-' + String(d.counters.movement).padStart(3, '0'),
          warehouseId: tr.toWarehouseId,
          productId: it.productId,
          type: 'transfer_in',
          qty: qty,
          ref: tr.id,
          date: new Date().toISOString(),
          notes: 'استلام تحويل من ' + tr.fromWarehouseId
        });
      });
      tr.status = 'completed';
      tr.receivedAt = new Date().toISOString();
      tr.updatedAt = tr.receivedAt;

      if (tr.reservationId) {
        const res = (d.reservations || []).find(function (r) { return r.id === tr.reservationId; });
        if (res) {
          res.status = 'received';
          res.updatedAt = tr.receivedAt;
          if (res.shortageId) {
            const sh = d.shortages.find(function (s) { return s.id === res.shortageId; });
            if (sh && (sh.linkedReservationIds || []).indexOf(res.id) === -1) {
              sh.coveredQty = (Number(sh.coveredQty) || 0) + Number(res.qty);
              sh.linkedReservationIds = sh.linkedReservationIds || [];
              sh.linkedReservationIds.push(res.id);
              if (sh.coveredQty >= sh.requestedQty) sh.status = 'closed';
              else if (sh.coveredQty > 0) sh.status = 'partially_covered';
            }
          }
        }
      }
      return d;
    });
  }

  function cancel(transferId) {
    DataAPI.save(function (d) {
      const tr = d.transfers.find(function (x) { return x.id === transferId; });
      if (!tr || tr.status === 'completed' || tr.status === 'cancelled') return d;
      if (tr.status === 'reserved' || tr.status === 'pending') {
        (tr.items || []).forEach(function (it) {
          const src = ensureInventoryRow(d, tr.fromWarehouseId, it.productId);
          const qty = Number(it.qty) || 0;
          src.reserved = Math.max(0, (src.reserved || 0) - qty);
          src.updatedAt = new Date().toISOString();
        });
      }
      tr.status = 'cancelled';
      tr.updatedAt = new Date().toISOString();
      return d;
    });
  }

  return { list: list, create: create, ship: ship, receive: receive, cancel: cancel, ensureInventoryRow: ensureInventoryRow };
})();

window.ReservationService = (function () {
  function list(orgId) {
    return (DataAPI.data().reservations || [])
      .filter(function (r) { return !orgId || r.orgId === orgId; })
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function listForWarehouse(warehouseId) {
    return (DataAPI.data().reservations || []).filter(function (r) {
      return r.fromWarehouseId === warehouseId || r.toWarehouseId === warehouseId;
    });
  }

  function requestFromPeer(opts) {
    const session = Auth.getSession();
    let created = null;
    DataAPI.save(function (d) {
      d.reservations = d.reservations || [];
      d.counters.reservation = (d.counters.reservation || 0) + 1;
      created = {
        id: 'RSV-' + String(d.counters.reservation).padStart(3, '0'),
        orgId: session.orgId,
        productId: opts.productId,
        qty: Number(opts.qty) || 0,
        fromWarehouseId: opts.fromWarehouseId,
        toWarehouseId: opts.toWarehouseId || session.warehouseId,
        shortageId: opts.shortageId || null,
        status: 'requested',
        createdBy: session.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: opts.notes || ''
      };
      d.reservations.unshift(created);
      d.notifications = d.notifications || [];
      d.counters.notification = (d.counters.notification || 0) + 1;
      d.notifications.unshift({
        id: 'NTF-' + String(d.counters.notification).padStart(3, '0'),
        userId: session.userId,
        type: 'reservation',
        titleAr: 'طلب حجز بين المخازن',
        titleEn: 'Inter-warehouse reservation requested',
        bodyAr: 'تم طلب ' + created.qty + ' من مخزن آخر لتغطية نقص',
        bodyEn: 'Requested ' + created.qty + ' from peer warehouse',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/buyer/stock-transfers.html?tab=reservations'
      });
      return d;
    });
    return created;
  }

  function accept(reservationId) {
    DataAPI.save(function (d) {
      const res = (d.reservations || []).find(function (r) { return r.id === reservationId; });
      if (!res || res.status !== 'requested') return d;
      const src = TransferService.ensureInventoryRow(d, res.fromWarehouseId, res.productId);
      const avail = Math.max(0, (src.onHand || 0) - (src.reserved || 0));
      if (avail < res.qty) {
        res.status = 'rejected';
        res.notes = (res.notes || '') + ' | insufficient stock';
        res.updatedAt = new Date().toISOString();
        return d;
      }
      src.reserved = (src.reserved || 0) + res.qty;
      src.updatedAt = new Date().toISOString();
      res.status = 'reserved';
      res.updatedAt = new Date().toISOString();

      d.counters.transfer = (d.counters.transfer || 0) + 1;
      const tr = {
        id: 'TR-' + String(d.counters.transfer).padStart(3, '0'),
        fromWarehouseId: res.fromWarehouseId,
        toWarehouseId: res.toWarehouseId,
        status: 'reserved',
        reservationId: res.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: [{ productId: res.productId, qty: res.qty }],
        notes: 'من حجز ' + res.id
      };
      d.transfers.unshift(tr);
      res.transferId = tr.id;
      return d;
    });
  }

  function reject(reservationId, reason) {
    DataAPI.save(function (d) {
      const res = (d.reservations || []).find(function (r) { return r.id === reservationId; });
      if (!res || res.status !== 'requested') return d;
      res.status = 'rejected';
      res.notes = reason || res.notes || '';
      res.updatedAt = new Date().toISOString();
      return d;
    });
  }

  function ship(reservationId) {
    const res = (DataAPI.data().reservations || []).find(function (r) { return r.id === reservationId; });
    if (!res || !res.transferId) return;
    TransferService.ship(res.transferId);
    DataAPI.save(function (d) {
      const r = (d.reservations || []).find(function (x) { return x.id === reservationId; });
      if (r) {
        r.status = 'shipped';
        r.updatedAt = new Date().toISOString();
      }
      return d;
    });
  }

  function complete(reservationId) {
    const res = (DataAPI.data().reservations || []).find(function (r) { return r.id === reservationId; });
    if (!res || !res.transferId) return;
    TransferService.receive(res.transferId);
  }

  return {
    list: list,
    listForWarehouse: listForWarehouse,
    requestFromPeer: requestFromPeer,
    accept: accept,
    reject: reject,
    ship: ship,
    complete: complete
  };
})();
