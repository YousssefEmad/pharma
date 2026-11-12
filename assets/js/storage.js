/**
 * PHARMA LINK — LocalStorage Persistence Layer
 */
window.StorageService = (function () {
  const KEYS = PharmaConfig.storageKeys;

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Storage get failed', key, e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set failed', key, e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  function getData() {
    return get(KEYS.data, null);
  }

  function setData(data) {
    return set(KEYS.data, data);
  }

  function updateData(mutator) {
    const data = getData();
    if (!data) return null;
    const next = mutator(data) || data;
    next.meta = next.meta || {};
    next.meta.updatedAt = new Date().toISOString();
    setData(next);
    return next;
  }

  function getSession() {
    return get(KEYS.session, null);
  }

  function setSession(session) {
    return set(KEYS.session, session);
  }

  function clearSession() {
    remove(KEYS.session);
  }

  function getLang() {
    return localStorage.getItem(KEYS.lang) || PharmaConfig.defaultLang;
  }

  function setLang(lang) {
    localStorage.setItem(KEYS.lang, lang);
  }

  function isInitialized() {
    return localStorage.getItem(KEYS.initialized) === '1' && !!getData();
  }

  function markInitialized() {
    localStorage.setItem(KEYS.initialized, '1');
  }

  function migrateShortageCycle(data) {
    if (!data) return data;
    data.reservations = data.reservations || [];
    data.counters = data.counters || {};
    data.counters.reservation = data.counters.reservation || data.reservations.length || 0;
    (data.shortages || []).forEach(function (s) {
      if (s.coveredQty == null) s.coveredQty = 0;
      if (!s.status) s.status = s.coveredQty >= s.requestedQty ? 'closed' : s.coveredQty > 0 ? 'partially_covered' : 'open';
      if (!s.linkedReservationIds) s.linkedReservationIds = [];
    });
    // Seed branch inventory if missing (so peer stock demos work on old LocalStorage)
    const hasBranch = (data.inventory || []).some(function (i) { return i.warehouseId === 'WH-B01-B'; });
    if (!hasBranch && DemoData && DemoData.generate) {
      const fresh = DemoData.generate();
      (fresh.inventory || []).filter(function (i) { return i.warehouseId === 'WH-B01-B'; }).forEach(function (row) {
        data.inventory.push(row);
      });
      if (!data.reservations.length && fresh.reservations) {
        data.reservations = fresh.reservations.slice();
      }
      const shIds = {};
      (data.shortages || []).forEach(function (s) { shIds[s.id] = true; });
      (fresh.shortages || []).forEach(function (s) {
        if (!shIds[s.id] && s.warehouseId === 'WH-B01-B') data.shortages.push(s);
      });
    }
    data.meta = data.meta || {};
    data.meta.version = '1.1.0';
    data.meta.feature = 'shortage_cycle';
    data.meta.updatedAt = new Date().toISOString();
    return data;
  }

  function ensureInitialized() {
    if (!isInitialized()) {
      const seed = DemoData.generate();
      setData(seed);
      markInitialized();
      return seed;
    }
    let data = getData();
    if (!data.meta || data.meta.version !== '1.1.0') {
      data = migrateShortageCycle(data);
      setData(data);
    }
    return data;
  }

  function resetDemoData() {
    const seed = DemoData.generate();
    setData(seed);
    markInitialized();
    return seed;
  }

  function getSidebarCollapsed() {
    return localStorage.getItem(KEYS.sidebarCollapsed) === '1';
  }

  function setSidebarCollapsed(v) {
    localStorage.setItem(KEYS.sidebarCollapsed, v ? '1' : '0');
  }

  return {
    get,
    set,
    remove,
    getData,
    setData,
    updateData,
    getSession,
    setSession,
    clearSession,
    getLang,
    setLang,
    isInitialized,
    markInitialized,
    ensureInitialized,
    resetDemoData,
    getSidebarCollapsed,
    setSidebarCollapsed
  };
})();
