/**
 * PHARMA LINK — Number, Currency, Date Formatters
 */
window.Formatters = (function () {
  function lang() {
    return StorageService.getLang();
  }

  function locale() {
    return lang() === 'ar' ? 'ar-EG' : 'en-EG';
  }

  function currency(amount, opts) {
    const n = Number(amount) || 0;
    const formatted = new Intl.NumberFormat(locale(), {
      minimumFractionDigits: opts && opts.decimals !== undefined ? opts.decimals : 2,
      maximumFractionDigits: opts && opts.decimals !== undefined ? opts.decimals : 2
    }).format(n);
    const suffix = t('egp');
    return lang() === 'ar' ? formatted + ' ' + suffix : suffix + ' ' + formatted;
  }

  function number(n, decimals) {
    const v = Number(n) || 0;
    return new Intl.NumberFormat(locale(), {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals !== undefined ? decimals : 0
    }).format(v);
  }

  function percent(n, decimals) {
    return number(n, decimals !== undefined ? decimals : 1) + '%';
  }

  function date(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    return new Intl.DateTimeFormat(locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  }

  function datetime(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    return new Intl.DateTimeFormat(locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  function relative(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return lang() === 'ar' ? 'الآن' : 'Just now';
    if (mins < 60) return mins + ' ' + (lang() === 'ar' ? 'د' : 'm');
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + ' ' + (lang() === 'ar' ? 'س' : 'h');
    const days = Math.floor(hours / 24);
    return days + ' ' + t('days');
  }

  function statusBadge(status) {
    const map = {
      draft: 'badge-draft',
      published: 'badge-info',
      open: 'badge-info',
      closed: 'badge-muted',
      pending_offers: 'badge-warning',
      comparing: 'badge-info',
      allocated: 'badge-teal',
      approved: 'badge-success',
      rejected: 'badge-danger',
      pending_confirmation: 'badge-warning',
      confirmed: 'badge-success',
      partially_confirmed: 'badge-warning',
      partially_delivered: 'badge-warning',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
      submitted: 'badge-info',
      expired: 'badge-danger',
      near_expiry: 'badge-warning',
      ok: 'badge-success',
      active: 'badge-success',
      inactive: 'badge-muted',
      pending: 'badge-warning',
      verified: 'badge-success',
      unverified: 'badge-warning',
      suspended: 'badge-danger',
      pending_verification: 'badge-warning',
      critical: 'badge-danger',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-muted'
    };
    const cls = map[status] || 'badge-muted';
    const label = t('status_' + status) !== 'status_' + status ? t('status_' + status) : (t(status) !== status ? t(status) : status);
    return '<span class="pl-badge ' + cls + '">' + escapeHtml(label) + '</span>';
  }

  function urgencyBadge(u) {
    const map = { critical: 'badge-danger', high: 'badge-warning', medium: 'badge-info', low: 'badge-muted' };
    return '<span class="pl-badge ' + (map[u] || 'badge-muted') + '">' + escapeHtml(t('urgency_' + u) || u) + '</span>';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function text(el, value) {
    if (el) el.textContent = value == null ? '' : String(value);
  }

  return {
    currency,
    number,
    percent,
    date,
    datetime,
    relative,
    statusBadge,
    urgencyBadge,
    escapeHtml,
    text,
    lang,
    locale
  };
})();

window.escapeHtml = Formatters.escapeHtml;
