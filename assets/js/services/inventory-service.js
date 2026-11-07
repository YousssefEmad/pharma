/**
 * PHARMA LINK — Inventory Service
 */
window.InventoryService = (function () {
  function list(warehouseId, filters) {
    const f = filters || {};
    let rows = DataAPI.inventoryFor(warehouseId || Auth.getSession().warehouseId);
    rows = rows.map(function (r) {
      const p = DataAPI.findProduct(r.productId);
      return Object.assign({}, r, {
        product: p,
        available: DataAPI.availableQty(r),
        reorderPoint: DataAPI.reorderPoint(r),
        urgency: DataAPI.urgencyFor(r),
        suggestedQty: DataAPI.suggestedPurchaseQty(r)
      });
    });
    if (f.q) {
      const q = String(f.q).toLowerCase();
      rows = rows.filter(function (r) {
        const p = r.product || {};
        return [p.nameAr, p.nameEn, p.code, p.barcode].join(' ').toLowerCase().indexOf(q) !== -1;
      });
    }
    if (f.lowStock) rows = rows.filter(function (r) { return r.available <= (r.minStock || 0); });
    if (f.outOfStock) rows = rows.filter(function (r) { return r.available <= 0; });
    if (f.belowReorder) rows = rows.filter(function (r) { return r.available <= r.reorderPoint; });
    if (f.category) rows = rows.filter(function (r) { return r.product && r.product.category === f.category; });
    return rows;
  }

  function inventoryValue(warehouseId) {
    return list(warehouseId).reduce(function (sum, r) {
      const price = (r.product && r.product.purchasePrice) || 0;
      return sum + price * (r.onHand || 0);
    }, 0);
  }

  function adjust(warehouseId, productId, newQty, reason, notes) {
    let movement = null;
    DataAPI.save(function (d) {
      let row = d.inventory.find(function (i) { return i.warehouseId === warehouseId && i.productId === productId; });
      if (!row) {
        row = {
          id: 'INV-' + String((d.counters.inventory = (d.counters.inventory || d.inventory.length) + 1)).padStart(3, '0'),
          warehouseId: warehouseId,
          productId: productId,
          onHand: 0, reserved: 0, minStock: 10, reorderLevel: 20,
          avgDailyUsage: 1, leadTimeDays: 5, safetyStock: 5, location: '—'
        };
        d.inventory.push(row);
      }
      const diff = Number(newQty) - Number(row.onHand);
      row.onHand = Number(newQty);
      row.updatedAt = new Date().toISOString();
      d.counters.movement = (d.counters.movement || 0) + 1;
      movement = {
        id: 'MOV-' + String(d.counters.movement).padStart(3, '0'),
        warehouseId: warehouseId,
        productId: productId,
        type: 'adjustment',
        qty: diff,
        ref: reason || 'ADJ',
        date: new Date().toISOString(),
        notes: notes || ''
      };
      d.movements.unshift(movement);
      return d;
    });
    return movement;
  }

  function receive(warehouseId, productId, qty, batchNo, expiryDate, ref, notes) {
    DataAPI.save(function (d) {
      let row = d.inventory.find(function (i) { return i.warehouseId === warehouseId && i.productId === productId; });
      if (!row) {
        row = {
          id: 'INV-' + String(d.inventory.length + 1).padStart(3, '0'),
          warehouseId: warehouseId, productId: productId,
          onHand: 0, reserved: 0, minStock: 10, reorderLevel: 20,
          avgDailyUsage: 1, leadTimeDays: 5, safetyStock: 5, location: 'NEW'
        };
        d.inventory.push(row);
      }
      row.onHand = (row.onHand || 0) + Number(qty);
      row.lastPurchaseDate = new Date().toISOString().slice(0, 10);
      row.updatedAt = new Date().toISOString();
      d.counters.movement = (d.counters.movement || 0) + 1;
      d.movements.unshift({
        id: 'MOV-' + String(d.counters.movement).padStart(3, '0'),
        warehouseId: warehouseId, productId: productId,
        type: 'purchase_receipt', qty: Number(qty), ref: ref || '', date: new Date().toISOString(), notes: notes || ''
      });
      if (batchNo) {
        d.batches.push({
          id: 'BAT-' + String(d.batches.length + 1).padStart(3, '0'),
          productId: productId, warehouseId: warehouseId,
          batchNo: batchNo, qty: Number(qty),
          expiryDate: expiryDate, receivedAt: new Date().toISOString().slice(0, 10)
        });
      }
      return d;
    });
  }

  function movements(warehouseId, filters) {
    const f = filters || {};
    let rows = DataAPI.data().movements.filter(function (m) { return !warehouseId || m.warehouseId === warehouseId; });
    if (f.type) rows = rows.filter(function (m) { return m.type === f.type; });
    if (f.productId) rows = rows.filter(function (m) { return m.productId === f.productId; });
    if (f.q) {
      const q = String(f.q).toLowerCase();
      rows = rows.filter(function (m) {
        const p = DataAPI.findProduct(m.productId) || {};
        return [p.nameAr, p.nameEn, m.ref, m.notes].join(' ').toLowerCase().indexOf(q) !== -1;
      });
    }
    return rows.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
  }

  function expirationBuckets(warehouseId) {
    const today = new Date();
    const batches = DataAPI.data().batches.filter(function (b) { return b.warehouseId === warehouseId && b.qty > 0; });
    const buckets = { expired: [], d30: [], d60: [], d90: [], ok: [] };
    batches.forEach(function (b) {
      const exp = new Date(b.expiryDate);
      const days = Math.ceil((exp - today) / 86400000);
      const enriched = Object.assign({}, b, { daysLeft: days, product: DataAPI.findProduct(b.productId) });
      if (days < 0) buckets.expired.push(enriched);
      else if (days <= 30) buckets.d30.push(enriched);
      else if (days <= 60) buckets.d60.push(enriched);
      else if (days <= 90) buckets.d90.push(enriched);
      else buckets.ok.push(enriched);
    });
    return buckets;
  }

  function detectShortages(warehouseId) {
    return list(warehouseId, { belowReorder: true }).map(function (r) {
      return {
        productId: r.productId,
        product: r.product,
        onHand: r.onHand,
        reserved: r.reserved,
        available: r.available,
        reorderPoint: r.reorderPoint,
        avgDailyUsage: r.avgDailyUsage,
        suggestedQty: r.suggestedQty || Math.max(r.reorderLevel || 20, 10),
        urgency: r.urgency,
        lastPurchaseDate: r.lastPurchaseDate,
        leadTimeDays: r.leadTimeDays,
        safetyStock: r.safetyStock
      };
    });
  }

  return { list, inventoryValue, adjust, receive, movements, expirationBuckets, detectShortages };
})();
