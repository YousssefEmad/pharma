/**
 * PHARMA LINK — Procurement, Offers, POs, Notifications
 */
window.ProcurementService = (function () {
  function requests(filters) {
    const f = filters || {};
    const session = Auth.getSession();
    let rows = DataAPI.data().requests.slice();
    if (f.buyerOrgId) rows = rows.filter(function (r) { return r.buyerOrgId === f.buyerOrgId; });
    else if (session && session.orgType === 'buyer') rows = rows.filter(function (r) { return r.buyerOrgId === session.orgId; });
    if (f.status) rows = rows.filter(function (r) { return r.status === f.status; });
    if (f.supplierOrgId) {
      rows = rows.filter(function (r) {
        return (r.invitedSuppliers || []).indexOf(f.supplierOrgId) !== -1 && r.status !== 'draft';
      });
    }
    return rows.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function getRequest(id) {
    return DataAPI.data().requests.find(function (r) { return r.id === id; });
  }

  function saveRequest(payload) {
    let id = payload.id;
    DataAPI.save(function (d) {
      if (!id) {
        d.counters.request = (d.counters.request || 0) + 1;
        id = 'PR-' + new Date().getFullYear() + '-' + String(d.counters.request).padStart(3, '0');
        payload.id = id;
        payload.number = id;
        payload.createdAt = new Date().toISOString();
        payload.status = payload.status || 'draft';
        d.requests.unshift(payload);
      } else {
        const idx = d.requests.findIndex(function (r) { return r.id === id; });
        if (idx >= 0) d.requests[idx] = Object.assign({}, d.requests[idx], payload);
      }
      return d;
    });
    return getRequest(id);
  }

  function publishRequest(id) {
    DataAPI.save(function (d) {
      const r = d.requests.find(function (x) { return x.id === id; });
      if (r) {
        r.status = 'pending_offers';
        r.publishedAt = new Date().toISOString();
        if (!r.deadline) {
          const dl = new Date();
          dl.setDate(dl.getDate() + 1);
          dl.setHours(9, 0, 0, 0);
          r.deadline = dl.toISOString();
        }
        // notify suppliers
        (r.invitedSuppliers || []).forEach(function (sid) {
          const users = d.users.filter(function (u) { return u.orgId === sid; });
          users.forEach(function (u) {
            d.counters.notification = (d.counters.notification || 0) + 1;
            d.notifications.unshift({
              id: 'NTF-' + String(d.counters.notification).padStart(3, '0'),
              userId: u.id,
              type: 'new_request',
              titleAr: 'طلب شراء جديد ' + r.number,
              titleEn: 'New request ' + r.number,
              bodyAr: 'طلب شراء متاح لتقديم عرض',
              bodyEn: 'A purchase request is available for offers',
              read: false,
              createdAt: new Date().toISOString(),
              link: '/supplier/request-details.html?id=' + r.id
            });
          });
        });
      }
      return d;
    });
    return getRequest(id);
  }

  function offersForRequest(requestId) {
    return DataAPI.data().offers.filter(function (o) { return o.requestId === requestId; });
  }

  function offersForSupplier(supplierOrgId) {
    return DataAPI.data().offers.filter(function (o) { return o.supplierOrgId === supplierOrgId; })
      .sort(function (a, b) { return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0); });
  }

  function getOffer(id) {
    return DataAPI.data().offers.find(function (o) { return o.id === id; });
  }

  function isWindowOpen(request) {
    if (!request || !request.deadline) return true;
    return new Date(request.deadline) > new Date();
  }

  function saveOffer(payload) {
    let id = payload.id;
    // Enrich net prices
    (payload.items || []).forEach(function (it) {
      const price = Number(it.unitPrice) || 0;
      const disc = Number(it.discountPct) || 0;
      it.netUnitPrice = Math.round(price * (1 - disc / 100) * 100) / 100;
      it.discountAmount = Math.round((price - it.netUnitPrice) * 100) / 100;
    });
    DataAPI.save(function (d) {
      if (!id) {
        d.counters.offer = (d.counters.offer || 0) + 1;
        id = 'OFF-' + String(d.counters.offer).padStart(3, '0');
        payload.id = id;
        d.offers.unshift(payload);
      } else {
        const idx = d.offers.findIndex(function (o) { return o.id === id; });
        if (idx >= 0) d.offers[idx] = Object.assign({}, d.offers[idx], payload);
      }
      return d;
    });
    return getOffer(id);
  }

  function submitOffer(id) {
    const offer = getOffer(id);
    const request = getRequest(offer.requestId);
    if (!isWindowOpen(request)) {
      throw new Error('cannotAcceptOffers');
    }
    DataAPI.save(function (d) {
      const o = d.offers.find(function (x) { return x.id === id; });
      if (o) {
        o.status = 'submitted';
        o.submittedAt = new Date().toISOString();
        const req = d.requests.find(function (r) { return r.id === o.requestId; });
        const buyerUsers = d.users.filter(function (u) { return u.orgId === (req && req.buyerOrgId); });
        buyerUsers.forEach(function (u) {
          d.counters.notification = (d.counters.notification || 0) + 1;
          d.notifications.unshift({
            id: 'NTF-' + String(d.counters.notification).padStart(3, '0'),
            userId: u.id,
            type: 'offer_submitted',
            titleAr: 'عرض جديد على ' + (req && req.number),
            titleEn: 'New offer on ' + (req && req.number),
            bodyAr: 'تم تقديم عرض من مورد',
            bodyEn: 'A supplier submitted an offer',
            read: false,
            createdAt: new Date().toISOString(),
            link: '/buyer/request-details.html?id=' + o.requestId
          });
        });
      }
      return d;
    });
    return getOffer(id);
  }

  function purchaseOrders(filters) {
    const f = filters || {};
    const session = Auth.getSession();
    let rows = DataAPI.data().purchaseOrders.slice();
    if (f.buyerOrgId) rows = rows.filter(function (p) { return p.buyerOrgId === f.buyerOrgId; });
    if (f.supplierOrgId) rows = rows.filter(function (p) { return p.supplierOrgId === f.supplierOrgId; });
    if (!f.buyerOrgId && !f.supplierOrgId && session) {
      if (session.orgType === 'buyer') rows = rows.filter(function (p) { return p.buyerOrgId === session.orgId; });
      if (session.orgType === 'supplier') rows = rows.filter(function (p) { return p.supplierOrgId === session.orgId; });
    }
    if (f.status) rows = rows.filter(function (p) { return p.status === f.status; });
    return rows.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function getPO(id) {
    return DataAPI.data().purchaseOrders.find(function (p) { return p.id === id; });
  }

  /**
   * Generate one PO per supplier from approved allocation lines.
   * Prevents duplicates for same request+supplier if already generated.
   */
  function generatePOsFromAllocation(allocation) {
    const request = getRequest(allocation.requestId);
    const bySupplier = {};
    (allocation.lines || []).forEach(function (l) {
      if (!l.qty) return;
      bySupplier[l.supplierOrgId] = bySupplier[l.supplierOrgId] || [];
      bySupplier[l.supplierOrgId].push(l);
    });
    const created = [];
    const skipped = [];
    DataAPI.save(function (d) {
      Object.keys(bySupplier).forEach(function (sid) {
        const exists = d.purchaseOrders.find(function (p) {
          return p.requestId === allocation.requestId && p.supplierOrgId === sid && p.status !== 'cancelled';
        });
        if (exists) {
          skipped.push(exists.id);
          return;
        }
        d.counters.po = (d.counters.po || 0) + 1;
        const number = 'PO-' + new Date().getFullYear() + '-' + String(d.counters.po).padStart(3, '0');
        const items = bySupplier[sid].map(function (l) {
          return {
            productId: l.productId,
            qty: l.qty,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct || 0,
            netUnitPrice: l.netUnitPrice,
            lineTotal: l.lineCost,
            receivedQty: 0
          };
        });
        const grandTotal = items.reduce(function (s, i) { return s + i.lineTotal; }, 0);
        const exp = new Date();
        exp.setDate(exp.getDate() + 5);
        const po = {
          id: number,
          number: number,
          requestId: allocation.requestId,
          buyerOrgId: request.buyerOrgId,
          supplierOrgId: sid,
          warehouseId: request.warehouseId,
          status: 'pending_confirmation',
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
          expectedDelivery: exp.toISOString().slice(0, 10),
          items: items,
          grandTotal: Math.round(grandTotal * 100) / 100,
          notes: ''
        };
        d.purchaseOrders.unshift(po);
        created.push(po);

        // notify supplier
        d.users.filter(function (u) { return u.orgId === sid; }).forEach(function (u) {
          d.counters.notification = (d.counters.notification || 0) + 1;
          d.notifications.unshift({
            id: 'NTF-' + String(d.counters.notification).padStart(3, '0'),
            userId: u.id,
            type: 'po_pending',
            titleAr: 'أمر شراء جديد ' + number,
            titleEn: 'New PO ' + number,
            bodyAr: 'بانتظار تأكيد المورد',
            bodyEn: 'Awaiting supplier confirmation',
            read: false,
            createdAt: new Date().toISOString(),
            link: '/supplier/purchase-orders.html?id=' + number
          });
        });
      });

      const alc = d.allocations.find(function (a) { return a.id === allocation.id || a.requestId === allocation.requestId; });
      if (alc) alc.status = 'approved';
      const req = d.requests.find(function (r) { return r.id === allocation.requestId; });
      if (req) req.status = 'pending_confirmation';
      return d;
    });
    return { created: created, skipped: skipped };
  }

  function updatePOStatus(id, status, extra) {
    DataAPI.save(function (d) {
      const po = d.purchaseOrders.find(function (p) { return p.id === id; });
      if (!po) return d;
      po.status = status;
      Object.assign(po, extra || {});
      if (status === 'confirmed') po.confirmedAt = new Date().toISOString();
      if (status === 'delivered') po.deliveredAt = new Date().toISOString();
      return d;
    });
    return getPO(id);
  }

  function receivePO(poId, receipts) {
    // receipts: [{ productId, receivedQty, damagedQty, missingQty, batchNo, expiryDate, notes }]
    const po = getPO(poId);
    if (!po) return null;
    DataAPI.save(function (d) {
      const order = d.purchaseOrders.find(function (p) { return p.id === poId; });
      let allDone = true;
      (receipts || []).forEach(function (rec) {
        const line = order.items.find(function (i) { return i.productId === rec.productId; });
        if (!line) return;
        const qty = Number(rec.receivedQty) || 0;
        line.receivedQty = (line.receivedQty || 0) + qty;
        if (line.receivedQty < line.qty) allDone = false;
        if (qty > 0) {
          // update inventory inline
          let row = d.inventory.find(function (i) { return i.warehouseId === order.warehouseId && i.productId === rec.productId; });
          if (!row) {
            row = {
              id: 'INV-' + String(d.inventory.length + 1).padStart(3, '0'),
              warehouseId: order.warehouseId, productId: rec.productId,
              onHand: 0, reserved: 0, minStock: 10, reorderLevel: 20,
              avgDailyUsage: 1, leadTimeDays: 5, safetyStock: 5, location: 'RCV'
            };
            d.inventory.push(row);
          }
          row.onHand = (row.onHand || 0) + qty;
          row.lastPurchaseDate = new Date().toISOString().slice(0, 10);
          d.counters.movement = (d.counters.movement || 0) + 1;
          d.movements.unshift({
            id: 'MOV-' + String(d.counters.movement).padStart(3, '0'),
            warehouseId: order.warehouseId,
            productId: rec.productId,
            type: 'purchase_receipt',
            qty: qty,
            ref: order.number,
            date: new Date().toISOString(),
            notes: rec.notes || ''
          });
          if (rec.batchNo) {
            d.batches.push({
              id: 'BAT-' + String(d.batches.length + 1).padStart(3, '0'),
              productId: rec.productId,
              warehouseId: order.warehouseId,
              batchNo: rec.batchNo,
              qty: qty,
              expiryDate: rec.expiryDate,
              receivedAt: new Date().toISOString().slice(0, 10)
            });
          }
        }
      });
      order.items.forEach(function (i) {
        if ((i.receivedQty || 0) < i.qty) allDone = false;
      });
      order.status = allDone ? 'delivered' : 'partially_delivered';
      if (allDone) order.deliveredAt = new Date().toISOString();
      return d;
    });
    return getPO(poId);
  }

  return {
    requests, getRequest, saveRequest, publishRequest,
    offersForRequest, offersForSupplier, getOffer, saveOffer, submitOffer, isWindowOpen,
    purchaseOrders, getPO, generatePOsFromAllocation, updatePOStatus, receivePO
  };
})();

window.NotificationService = (function () {
  function list(userId) {
    const uid = userId || (Auth.getSession() || {}).userId;
    return DataAPI.data().notifications
      .filter(function (n) { return n.userId === uid; })
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function unreadCount(userId) {
    return list(userId).filter(function (n) { return !n.read; }).length;
  }

  function markRead(id) {
    DataAPI.save(function (d) {
      const n = d.notifications.find(function (x) { return x.id === id; });
      if (n) n.read = true;
      return d;
    });
  }

  function markAllRead(userId) {
    const uid = userId || (Auth.getSession() || {}).userId;
    DataAPI.save(function (d) {
      d.notifications.forEach(function (n) {
        if (n.userId === uid) n.read = true;
      });
      return d;
    });
  }

  return { list, unreadCount, markRead, markAllRead };
})();

window.ShortageService = (function () {
  function enrich(s) {
    const covered = Number(s.coveredQty) || 0;
    const requested = Number(s.requestedQty) || 0;
    const remaining = Math.max(0, requested - covered);
    const status = s.status || (covered >= requested && requested > 0 ? 'closed' : covered > 0 ? 'partially_covered' : 'open');
    return Object.assign({}, s, {
      coveredQty: covered,
      remainingQty: remaining,
      status: status,
      product: DataAPI.findProduct(s.productId),
      warehouse: DataAPI.data().warehouses.find(function (w) { return w.id === s.warehouseId; })
    });
  }

  function list(warehouseId) {
    const wid = warehouseId || Auth.getSession().warehouseId;
    return DataAPI.data().shortages
      .filter(function (s) { return s.warehouseId === wid; })
      .map(enrich);
  }

  function listOrg(orgId) {
    const wids = DataAPI.data().warehouses
      .filter(function (w) { return w.orgId === orgId; })
      .map(function (w) { return w.id; });
    return DataAPI.data().shortages
      .filter(function (s) { return wids.indexOf(s.warehouseId) !== -1; })
      .map(enrich)
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function coverageFor(shortage) {
    const session = Auth.getSession();
    const orgId = session.orgId;
    const peers = InventoryService.peerAvailability(orgId, shortage.productId, shortage.warehouseId);
    return {
      remaining: Math.max(0, (Number(shortage.requestedQty) || 0) - (Number(shortage.coveredQty) || 0)),
      peers: peers
    };
  }

  function addMany(items) {
    const session = Auth.getSession();
    DataAPI.save(function (d) {
      (items || []).forEach(function (it) {
        d.counters.shortage = (d.counters.shortage || 0) + 1;
        d.shortages.push({
          id: 'SH-' + String(d.counters.shortage).padStart(3, '0'),
          warehouseId: it.warehouseId || session.warehouseId,
          productId: it.productId,
          requestedQty: Number(it.requestedQty) || 0,
          coveredQty: 0,
          status: 'open',
          source: it.source || 'manual',
          urgency: it.urgency || 'medium',
          notes: it.notes || '',
          linkedReservationIds: [],
          linkedRequestId: null,
          createdAt: new Date().toISOString()
        });
      });
      return d;
    });
  }

  function update(id, patch) {
    DataAPI.save(function (d) {
      const s = d.shortages.find(function (x) { return x.id === id; });
      if (s) Object.assign(s, patch);
      return d;
    });
  }

  function remove(id) {
    DataAPI.save(function (d) {
      d.shortages = d.shortages.filter(function (s) { return s.id !== id; });
      return d;
    });
  }

  function mergeDuplicates() {
    DataAPI.save(function (d) {
      const session = Auth.getSession();
      const map = {};
      d.shortages.forEach(function (s) {
        if (s.warehouseId !== session.warehouseId) return;
        if (s.status === 'closed') return;
        if (map[s.productId]) {
          map[s.productId].requestedQty += Number(s.requestedQty) || 0;
          map[s.productId].coveredQty = (Number(map[s.productId].coveredQty) || 0) + (Number(s.coveredQty) || 0);
        } else {
          map[s.productId] = Object.assign({}, s);
        }
      });
      const others = d.shortages.filter(function (s) {
        return s.warehouseId !== session.warehouseId || s.status === 'closed';
      });
      d.shortages = others.concat(Object.keys(map).map(function (k) { return map[k]; }));
      return d;
    });
  }

  function convertToRequest(selectedIds, invitedSuppliers, residualOnly) {
    const session = Auth.getSession();
    const shortages = list().filter(function (s) {
      if (selectedIds && selectedIds.indexOf(s.id) === -1) return false;
      if (s.status === 'closed') return false;
      return true;
    });
    const items = shortages.map(function (s) {
      const qty = residualOnly ? s.remainingQty : s.requestedQty;
      return { productId: s.productId, qty: qty, notes: s.notes || '', shortageId: s.id };
    }).filter(function (it) { return it.qty > 0; });
    if (!items.length) return null;
    const payload = {
      buyerOrgId: session.orgId,
      warehouseId: session.warehouseId,
      status: 'draft',
      notes: residualOnly ? 'متبقي بعد تغطية بين المخازن' : '',
      invitedSuppliers: invitedSuppliers || [],
      items: items
    };
    const req = ProcurementService.saveRequest(payload);
    DataAPI.save(function (d) {
      items.forEach(function (it) {
        const sh = d.shortages.find(function (s) { return s.id === it.shortageId; });
        if (sh) {
          sh.linkedRequestId = req.id;
          if (!residualOnly) sh.status = 'converted';
          else if (sh.status === 'open') sh.status = 'partially_covered';
        }
      });
      return d;
    });
    return req;
  }

  function networkBoard(orgId) {
    const rows = listOrg(orgId).filter(function (s) { return s.status !== 'closed'; });
    return rows.map(function (s) {
      const cov = coverageFor(s);
      return Object.assign({}, s, {
        peerStock: cov.peers,
        peerAvailableTotal: cov.peers.reduce(function (n, p) { return n + p.available; }, 0),
        remaining: cov.remaining
      });
    });
  }

  return {
    list: list,
    listOrg: listOrg,
    coverageFor: coverageFor,
    addMany: addMany,
    update: update,
    remove: remove,
    mergeDuplicates: mergeDuplicates,
    convertToRequest: convertToRequest,
    networkBoard: networkBoard,
    enrich: enrich
  };
})();
