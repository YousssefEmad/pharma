(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'deliveries',
    title: t('deliveries'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('deliveries') }]
  });
  if (!ctx) return;
  
  const rows = ProcurementService.purchaseOrders({ supplierOrgId: ctx.session.orgId }).filter(function(p){ return ['confirmed','partially_delivered','delivered'].indexOf(p.status)!==-1; });
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('poNumber'))+'</th><th>'+escapeHtml(t('expectedDelivery'))+'</th><th>'+escapeHtml(t('status'))+'</th><th>'+escapeHtml(t('grandTotal'))+'</th></tr></thead><tbody>'+
    rows.map(function(p){ return '<tr><td>'+escapeHtml(p.number)+'</td><td>'+Formatters.date(p.expectedDelivery)+'</td><td>'+Formatters.statusBadge(p.status)+'</td><td>'+Formatters.currency(p.grandTotal)+'</td></tr>'; }).join('')+
    '</tbody></table></div></div>';

})();
