/**
 * PHARMA LINK — App bootstrap helpers
 */
window.PharmaApp = (function () {
  function basePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (/\/(buyer|supplier|admin)\//.test(path)) return '..';
    return '.';
  }

  function initAuthPage() {
    StorageService.ensureInitialized();
    const lang = StorageService.getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    UI.applyI18n(document);
    // lang toggle
    document.querySelectorAll('[data-toggle-lang]').forEach(function (btn) {
      const nextLabel = lang === 'ar' ? 'EN' : 'عربي';
      btn.classList.add('pl-lang-btn');
      btn.innerHTML = '<i class="bi bi-translate" aria-hidden="true"></i><span class="pl-lang-code">' + nextLabel + '</span>';
      btn.setAttribute('aria-label', t('changeLanguage') || 'Language');
      btn.title = t('changeLanguage') || 'Language';
      btn.addEventListener('click', function () {
        setLang(StorageService.getLang() === 'ar' ? 'en' : 'ar');
        window.location.reload();
      });
    });
  }

  function requireGuest() {
    const session = Auth.getSession();
    if (session) {
      window.location.href = basePath() === '.'
        ? PermissionService.dashboardPath(session.role).replace(/^\//, '')
        : '..' + PermissionService.dashboardPath(session.role);
    }
  }

  function btn(label, classes, attrs) {
    return '<button type="button" class="btn ' + (classes || 'btn-pl-primary') + '" ' + (attrs || '') + '>' + escapeHtml(label) + '</button>';
  }

  function statCard(icon, color, label, value, foot) {
    return '<div class="pl-stat"><div class="pl-stat-icon ' + color + '"><i class="bi ' + icon + '"></i></div>' +
      '<div class="pl-stat-label">' + escapeHtml(label) + '</div>' +
      '<div class="pl-stat-value">' + value + '</div>' +
      (foot ? '<div class="pl-stat-foot">' + escapeHtml(foot) + '</div>' : '') + '</div>';
  }

  function actionLink(href, label, classes) {
    return '<a class="btn ' + (classes || 'btn-pl-outline btn-sm') + '" href="' + href + '">' + escapeHtml(label) + '</a>';
  }

  return { basePath, initAuthPage, requireGuest, btn, statCard, actionLink };
})();
