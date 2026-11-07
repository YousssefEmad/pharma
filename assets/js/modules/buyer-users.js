(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'users',
    title: t('users'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('users') }]
  });
  if (!ctx) return;
  
  if (!PermissionService.can('edit') && ctx.session.role !== 'buyer_owner') {
    /* still allow view for owner only typically */
  }
  const users = DataAPI.data().users.filter(function(u){ return u.orgId===ctx.session.orgId; });
  const modules = ['dashboard','inventory','products','shortages','procurement','suppliers','offers','purchase_orders','deliveries','sales','finance','reports','settings'];
  const roles = ['buyer_owner','buyer_procurement','warehouse_viewer'];
  ctx.body.innerHTML = '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('users')) + '</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('name')) + '</th><th>' + escapeHtml(t('email')) + '</th><th>' + escapeHtml(t('role')) + '</th><th>' + escapeHtml(t('status')) + '</th></tr></thead><tbody>' +
    users.map(function(u){ return '<tr><td>' + escapeHtml(StorageService.getLang()==='ar'?u.nameAr:u.nameEn) + '</td><td>' + escapeHtml(u.email) + '</td><td>' + escapeHtml(t('role_'+u.role)) + '</td><td>' + Formatters.statusBadge(u.active?'active':'inactive') + '</td></tr>'; }).join('') +
    '</tbody></table></div></div>' +
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('permissionsMatrix')) + '</h3><span class="pl-badge badge-demo">' + escapeHtml(t('simulated')) + '</span></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table pl-perm-matrix"><thead><tr><th>' + escapeHtml(t('module')) + '</th>' + roles.map(function(r){ return '<th>' + escapeHtml(t('role_'+r)) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    modules.map(function(m){ return '<tr><td>' + escapeHtml(m) + '</td>' + roles.map(function(r){ const on = !(r==='warehouse_viewer' && (m==='finance'||m==='settings'||m==='purchase_orders')); return '<td><input type="checkbox" ' + (on?'checked':'') + ' disabled /></td>'; }).join('') + '</tr>'; }).join('') +
    '</tbody></table></div></div>';

})();
