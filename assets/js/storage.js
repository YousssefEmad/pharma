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

  function ensureInitialized() {
    if (!isInitialized()) {
      const seed = DemoData.generate();
      setData(seed);
      markInitialized();
      return seed;
    }
    return getData();
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
