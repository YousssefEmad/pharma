(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'purchases',
    title: t('purchases'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('purchases') }]
  });
  if (!ctx) return;
  
  ctx.body.innerHTML = '<div class="alert alert-info small"><span class="pl-badge badge-demo">' + escapeHtml(t('simBadge')) + '</span> ' + escapeHtml(t('taxInvoiceNote')) + '</div>' +
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('purchaseInvoices')) + '</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('poNumber')) + '</th><th>' + escapeHtml(t('suppliers')) + '</th><th>' + escapeHtml(t('date')) + '</th><th>' + escapeHtml(t('grandTotal')) + '</th><th>' + escapeHtml(t('status')) + '</th></tr></thead><tbody>' +
    ProcurementService.purchaseOrders({ buyerOrgId: ctx.session.orgId }).map(function(p){ return '<tr><td><a href="purchase-orders.html?id=' + p.id + '">' + escapeHtml(p.number) + '</a></td><td>' + escapeHtml(UI.orgLabel(DataAPI.findOrg(p.supplierOrgId))) + '</td><td>' + Formatters.date(p.createdAt) + '</td><td>' + Formatters.currency(p.grandTotal) + '</td><td>' + Formatters.statusBadge(p.status) + '</td></tr>'; }).join('') +
    '</tbody></table></div></div>';

})();
