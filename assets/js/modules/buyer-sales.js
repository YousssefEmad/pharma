(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'sales',
    title: t('sales'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('sales') }]
  });
  if (!ctx) return;
  
  const invoices = DataAPI.data().salesInvoices || [];
  ctx.body.innerHTML = '<div class="alert alert-info small"><span class="pl-badge badge-demo">' + escapeHtml(t('simBadge')) + '</span> ' + escapeHtml(t('financialSimNote')) + '</div>' +
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('salesInvoices')) + '</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>ID</th><th>' + escapeHtml(t('customers')) + '</th><th>' + escapeHtml(t('date')) + '</th><th>' + escapeHtml(t('total')) + '</th><th>' + escapeHtml(t('status')) + '</th></tr></thead><tbody>' +
    invoices.map(function(s){ const c=DataAPI.data().customers.find(function(x){return x.id===s.customerId;}); return '<tr><td>' + escapeHtml(s.id) + '</td><td>' + escapeHtml(c?(StorageService.getLang()==='ar'?c.nameAr:c.nameEn):'') + '</td><td>' + Formatters.date(s.date) + '</td><td>' + Formatters.currency(s.total) + '</td><td>' + Formatters.statusBadge(s.status==='paid'?'delivered':s.status==='unpaid'?'pending':'partially_delivered') + '</td></tr>'; }).join('') +
    '</tbody></table></div></div>';

})();
