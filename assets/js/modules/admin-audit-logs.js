(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'auditLogs',
    title: t('auditLogs'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('auditLogs') }]
  });
  if (!ctx) return;
  
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('auditTime'))+'</th><th>'+escapeHtml(t('auditUser'))+'</th><th>'+escapeHtml(t('auditAction'))+'</th><th>'+escapeHtml(t('details'))+'</th></tr></thead><tbody>'+
    DataAPI.data().auditLogs.map(function(a){ const u=DataAPI.findUser(a.userId); return '<tr><td>'+Formatters.datetime(a.at)+'</td><td>'+escapeHtml(u?(StorageService.getLang()==='ar'?u.nameAr:u.nameEn):a.userId)+'</td><td>'+escapeHtml(a.action)+'</td><td>'+escapeHtml(a.detail||a.target||'')+'</td></tr>'; }).join('')+
    '</tbody></table></div></div>';

})();
