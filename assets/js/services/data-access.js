/**
 * PHARMA LINK — Data access helpers
 */
window.DataAPI = (function () {
  function data() {
    return StorageService.ensureInitialized();
  }

  function save(mutator) {
    return StorageService.updateData(mutator);
  }

  function nextId(prefix, counterKey) {
    return save(function (d) {
      d.counters = d.counters || {};
      d.counters[counterKey] = (d.counters[counterKey] || 0) + 1;
      return d;
    }) && (prefix + '-' + String(data().counters[counterKey]).padStart(3, '0'));
  }

  function nextNumber(prefix, counterKey, year) {
    save(function (d) {
      d.counters = d.counters || {};
      d.counters[counterKey] = (d.counters[counterKey] || 0) + 1;
      return d;
    });
    const n = data().counters[counterKey];
    const y = year || new Date().getFullYear();
    return prefix + '-' + y + '-' + String(n).padStart(3, '0');
  }

  function findProduct(id) {
    return data().products.find(function (p) { return p.id === id; });
  }

  function findOrg(id) {
    return data().organizations.find(function (o) { return o.id === id; });
  }

  function findUser(id) {
    return data().users.find(function (u) { return u.id === id; });
  }

  function inventoryFor(warehouseId) {
    return data().inventory.filter(function (i) { return i.warehouseId === warehouseId; });
  }

  function getInventoryRow(warehouseId, productId) {
    return data().inventory.find(function (i) { return i.warehouseId === warehouseId && i.productId === productId; });
  }

  function availableQty(row) {
    if (!row) return 0;
    return Math.max(0, (row.onHand || 0) - (row.reserved || 0));
  }

  function reorderPoint(row) {
    if (!row) return 0;
    return (row.avgDailyUsage || 0) * (row.leadTimeDays || 0) + (row.safetyStock || 0);
  }

  function suggestedPurchaseQty(row) {
    if (!row) return 0;
    const avail = availableQty(row);
    const target = reorderPoint(row) + (row.safetyStock || 0) * 2;
    return Math.max(0, Math.ceil(target - avail));
  }

  function urgencyFor(row) {
    const avail = availableQty(row);
    if (avail <= 0) return 'critical';
    if (avail <= (row.minStock || 0)) return 'high';
    if (avail <= reorderPoint(row)) return 'medium';
    return 'low';
  }

  function langName(entity) {
    if (!entity) return '—';
    return StorageService.getLang() === 'ar' ? (entity.nameAr || entity.nameEn) : (entity.nameEn || entity.nameAr);
  }

  return {
    data, save, nextId, nextNumber, findProduct, findOrg, findUser,
    inventoryFor, getInventoryRow, availableQty, reorderPoint, suggestedPurchaseQty, urgencyFor, langName
  };
})();
