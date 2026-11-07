(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'settings',
    title: t('settings'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('settings') }]
  });
  if (!ctx) return;
  
  ctx.body.innerHTML = '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('orgProfile'))+'</h3></div><div class="pl-card-body"><div class="fw-bold">'+escapeHtml(Auth.orgName(ctx.session))+'</div><div class="text-muted small">'+escapeHtml(ctx.session.email)+'</div></div></div>'+
    '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('languageSettings'))+'</h3></div><div class="pl-card-body"><button class="btn btn-pl-outline" id="lang">'+escapeHtml(t('changeLanguage'))+'</button></div></div>'+
    '<div class="pl-card border-danger"><div class="pl-card-header"><h3 class="pl-card-title text-danger">'+escapeHtml(t('dangerZone'))+'</h3></div><div class="pl-card-body"><button class="btn btn-outline-danger" id="reset">'+escapeHtml(t('resetDemo'))+'</button></div></div>';
  document.getElementById('lang').onclick=function(){ setLang(StorageService.getLang()==='ar'?'en':'ar'); location.reload(); };
  document.getElementById('reset').onclick=async function(){ if(await UI.confirm({title:t('resetDemo'),text:t('resetDemoConfirm'),icon:'warning'})){ StorageService.resetDemoData(); UI.toast(t('resetDemoSuccess')); location.reload(); } };

})();
