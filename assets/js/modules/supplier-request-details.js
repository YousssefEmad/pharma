(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'requests',
    title: t('requestDetails'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('requestDetails') }]
  });
  if (!ctx) return;
  
  const r = ProcurementService.getRequest(UI.qs('id'));
  if (!r) { UI.emptyState(ctx.body); return; }
  ctx.actions.innerHTML = '<a class="btn btn-pl-accent btn-sm" href="submit-offer.html?requestId='+r.id+'">'+escapeHtml(t('submitOffer'))+'</a>';
  ctx.body.innerHTML = '<div class="pl-card mb-3"><div class="pl-card-body"><div class="d-flex justify-content-between"><div><div class="fw-bold">'+escapeHtml(r.number)+'</div><div class="small text-muted">'+escapeHtml(UI.orgLabel(DataAPI.findOrg(r.buyerOrgId)))+'</div></div>'+Formatters.statusBadge(r.status)+'</div><div class="mt-2">'+escapeHtml(t('offerDeadline'))+': '+Formatters.datetime(r.deadline)+'</div></div></div>'+
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('products'))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('requestedQty'))+'</th><th>'+escapeHtml(t('notes'))+'</th></tr></thead><tbody>'+
    (r.items||[]).map(function(it){ return '<tr><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId)))+'</td><td>'+it.qty+'</td><td>'+escapeHtml(it.notes||'')+'</td></tr>'; }).join('')+
    '</tbody></table></div></div>';

})();
