(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'settings',
    title: t('settings'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('settings') }]
  });
  if (!ctx) return;
  
  ctx.body.innerHTML = '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('orgProfile')) + '</h3></div><div class="pl-card-body"><div class="fw-bold">' + escapeHtml(Auth.orgName(ctx.session)) + '</div><div class="text-muted small">' + escapeHtml(Auth.displayName(ctx.session)) + ' · ' + escapeHtml(t('role_'+ctx.session.role)) + '</div></div></div>' +
    '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('languageSettings')) + '</h3></div><div class="pl-card-body"><button class="btn btn-pl-outline" id="lang">' + escapeHtml(t('changeLanguage')) + ' (AR/EN)</button></div></div>' +
    '<div class="pl-card border-danger"><div class="pl-card-header"><h3 class="pl-card-title text-danger">' + escapeHtml(t('dangerZone')) + '</h3></div><div class="pl-card-body"><p class="small text-muted">' + escapeHtml(t('resetDemoConfirm')) + '</p><button class="btn btn-outline-danger" id="reset">' + escapeHtml(t('resetDataBtn')) + '</button></div></div>';
  document.getElementById('lang').onclick=function(){ setLang(StorageService.getLang()==='ar'?'en':'ar'); location.reload(); };
  document.getElementById('reset').onclick=async function(){ if(await UI.confirm({title:t('resetDemo'),text:t('resetDemoConfirm'),icon:'warning'})){ const s=Auth.getSession(); StorageService.resetDemoData(); StorageService.setSession(s); UI.toast(t('resetDemoSuccess')); location.reload(); } };

})();
