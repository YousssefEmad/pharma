/**
 * PHARMA LINK — Shared UI helpers (toasts, dialogs, empty states)
 */
window.UI = (function () {
  function toast(message, icon) {
    if (window.Swal) {
      Swal.mixin({
        toast: true,
        position: StorageService.getLang() === 'ar' ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 2800,
        timerProgressBar: true
      }).fire({ icon: icon || 'success', title: message });
    } else {
      alert(message);
    }
  }

  function confirm(opts) {
    const o = opts || {};
    if (!window.Swal) return Promise.resolve(window.confirm(o.text || t('confirmAction')));
    return Swal.fire({
      title: o.title || t('confirmAction'),
      text: o.text || '',
      icon: o.icon || 'question',
      showCancelButton: true,
      confirmButtonText: o.confirmText || t('yesProceed'),
      cancelButtonText: o.cancelText || t('cancel'),
      confirmButtonColor: '#1e4e8c',
      cancelButtonColor: '#94a3b8',
      reverseButtons: StorageService.getLang() === 'ar'
    }).then(function (res) { return !!res.isConfirmed; });
  }

  function alert(opts) {
    const o = opts || {};
    if (!window.Swal) { window.alert(o.text || o.title); return Promise.resolve(); }
    return Swal.fire({
      title: o.title || '',
      text: o.text || '',
      icon: o.icon || 'info',
      confirmButtonText: t('ok'),
      confirmButtonColor: '#1e4e8c'
    });
  }

  function emptyState(container, title, desc) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;
    el.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'pl-empty';
    wrap.innerHTML = '<i class="bi bi-inbox"></i>';
    const h = document.createElement('h4');
    h.textContent = title || t('emptyTitle');
    const p = document.createElement('p');
    p.textContent = desc || t('emptyDesc');
    wrap.appendChild(h);
    wrap.appendChild(p);
    el.appendChild(wrap);
  }

  function setLoading(container, on) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;
    if (on) {
      el.innerHTML = '<div class="pl-loading"><div class="spinner-border spinner-border-sm text-secondary"></div><span>' + escapeHtml(t('loading')) + '</span></div>';
    }
  }

  function applyI18n(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('data-i18n-placeholder')) el.placeholder = val;
        else el.value = val;
      } else {
        el.textContent = val;
      }
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
  }

  function productLabel(p) {
    if (!p) return '—';
    return StorageService.getLang() === 'ar' ? p.nameAr : (p.nameEn || p.nameAr);
  }

  function orgLabel(o) {
    if (!o) return '—';
    return StorageService.getLang() === 'ar' ? o.nameAr : (o.nameEn || o.nameAr);
  }

  function initials(name) {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/);
    return ((parts[0] && parts[0][0]) || '') + ((parts[1] && parts[1][0]) || '');
  }

  function qs(name) {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  function setQs(params) {
    const u = new URL(window.location.href);
    Object.keys(params).forEach(function (k) {
      if (params[k] === null || params[k] === undefined || params[k] === '') u.searchParams.delete(k);
      else u.searchParams.set(k, params[k]);
    });
    history.replaceState(null, '', u.toString());
  }

  function debounce(fn, ms) {
    let tmr;
    return function () {
      const args = arguments;
      const ctx = this;
      clearTimeout(tmr);
      tmr = setTimeout(function () { fn.apply(ctx, args); }, ms || 250);
    };
  }

  return { toast, confirm, alert, emptyState, setLoading, applyI18n, productLabel, orgLabel, initials, qs, setQs, debounce };
})();
