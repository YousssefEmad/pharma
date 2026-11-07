(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'offerHistory',
    title: t('offerHistory'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('offerHistory') }]
  });
  if (!ctx) return;
  
  const rows = ProcurementService.offersForSupplier(ctx.session.orgId);
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>ID</th><th>'+escapeHtml(t('requestNumber'))+'</th><th>'+escapeHtml(t('productCount'))+'</th><th>'+escapeHtml(t('status'))+'</th><th>'+escapeHtml(t('date'))+'</th><th></th></tr></thead><tbody>'+
    rows.map(function(o){ return '<tr><td>'+escapeHtml(o.id)+'</td><td>'+escapeHtml(o.requestId)+'</td><td>'+(o.items||[]).length+'</td><td>'+Formatters.statusBadge(o.status)+'</td><td>'+Formatters.datetime(o.submittedAt)+'</td><td><a class="btn btn-sm btn-pl-outline" href="submit-offer.html?requestId='+o.requestId+'">'+escapeHtml(t('view'))+'</a></td></tr>'; }).join('')+
    '</tbody></table></div></div>';

})();
