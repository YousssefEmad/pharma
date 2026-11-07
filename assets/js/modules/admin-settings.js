(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'settings',
    title: t('settings'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('settings') }]
  });
  if (!ctx) return;
  
  ctx.body.innerHTML = '<div class="pl-card mb-3"><div class="pl-card-body"><div class="fw-bold">'+escapeHtml(t('appName'))+'</div><div class="small text-muted">'+escapeHtml(t('version'))+': '+PharmaConfig.version+' · '+escapeHtml(t('buildPrototype'))+'</div></div></div>'+
    '<div class="pl-card border-danger"><div class="pl-card-header"><h3 class="pl-card-title text-danger">'+escapeHtml(t('dangerZone'))+'</h3></div><div class="pl-card-body"><button class="btn btn-outline-danger" id="reset">'+escapeHtml(t('resetDemo'))+'</button></div></div>';
  document.getElementById('reset').onclick=async function(){ if(await UI.confirm({title:t('resetDemo'),text:t('resetDemoConfirm'),icon:'warning'})){ const s=Auth.getSession(); StorageService.resetDemoData(); if(s) StorageService.setSession(s); UI.toast(t('resetDemoSuccess')); } };

})();
