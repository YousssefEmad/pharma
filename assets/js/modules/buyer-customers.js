(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'customers',
    title: t('customers'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('customers') }]
  });
  if (!ctx) return;
  
  const rows = DataAPI.data().customers || [];
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('name')) + '</th><th>' + escapeHtml(t('phone')) + '</th><th>' + escapeHtml(t('city')) + '</th><th>' + escapeHtml(t('receivables')) + '</th></tr></thead><tbody>' +
    rows.map(function(c){ return '<tr><td>' + escapeHtml(StorageService.getLang()==='ar'?c.nameAr:c.nameEn) + '</td><td>' + escapeHtml(c.phone||'') + '</td><td>' + escapeHtml(c.city||'') + '</td><td>' + Formatters.currency(c.balance||0) + '</td></tr>'; }).join('') +
    '</tbody></table></div></div>';

})();
