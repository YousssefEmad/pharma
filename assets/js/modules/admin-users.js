(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'users',
    title: t('users'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('users') }]
  });
  if (!ctx) return;
  
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('name'))+'</th><th>'+escapeHtml(t('email'))+'</th><th>'+escapeHtml(t('role'))+'</th><th>'+escapeHtml(t('organization'))+'</th><th>'+escapeHtml(t('status'))+'</th></tr></thead><tbody>'+
    DataAPI.data().users.map(function(u){ return '<tr><td>'+escapeHtml(StorageService.getLang()==='ar'?u.nameAr:u.nameEn)+'</td><td>'+escapeHtml(u.email)+'</td><td>'+escapeHtml(t('role_'+u.role))+'</td><td>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(u.orgId)))+'</td><td>'+Formatters.statusBadge(u.active?'active':'inactive')+'</td></tr>'; }).join('')+
    '</tbody></table></div></div>';

})();
