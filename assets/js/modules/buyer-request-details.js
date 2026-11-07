(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'procurementRequests',
    title: t('requestDetails'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('requestDetails') }]
  });
  if (!ctx) return;
  
  const id = UI.qs('id');
  const r = ProcurementService.getRequest(id);
  if (!r) { UI.emptyState(ctx.body); return; }
  const offers = ProcurementService.offersForRequest(r.id);
  const open = ProcurementService.isWindowOpen(r);
  ctx.actions.innerHTML = '<a class="btn btn-pl-outline btn-sm" href="offer-comparison.html?id='+r.id+'">'+escapeHtml(t('offerComparison'))+'</a>'+
    '<a class="btn btn-pl-accent btn-sm" href="allocation-review.html?id='+r.id+'">'+escapeHtml(t('runAllocation'))+'</a>';
  let html = '<div class="row g-3 mb-3"><div class="col-md-3">'+PharmaApp.statCard('bi-hash','navy',t('requestNumber'), escapeHtml(r.number))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-box','teal',t('productCount'), String((r.items||[]).length))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-building','blue',t('invitedSuppliers'), String((r.invitedSuppliers||[]).length))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-tag','amber',t('pendingOffers'), String(offers.filter(function(o){return o.status==='submitted';}).length))+'</div></div>';
  html += '<div class="mb-3"><span class="pl-countdown '+(open?'':'closed')+'"><i class="bi bi-clock"></i> '+escapeHtml(open?t('windowOpen'):t('windowClosed'))+' · '+Formatters.datetime(r.deadline)+'</span> '+Formatters.statusBadge(r.status)+'</div>';
  html += '<div class="row g-3"><div class="col-lg-7"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('products'))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>'+escapeHtml(t('notes'))+'</th></tr></thead><tbody>';
  (r.items||[]).forEach(function(it){ html += '<tr><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId)))+'</td><td>'+it.qty+'</td><td>'+escapeHtml(it.notes||'')+'</td></tr>'; });
  html += '</tbody></table></div></div></div><div class="col-lg-5"><div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('suppliers'))+'</h3></div><div class="pl-card-body">';
  (r.invitedSuppliers||[]).forEach(function(sid){
    const off = offers.find(function(o){ return o.supplierOrgId===sid; });
    html += '<div class="d-flex justify-content-between align-items-center border-bottom py-2"><span>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(sid)))+'</span>'+(off?Formatters.statusBadge(off.status):'<span class="pl-badge badge-muted">—</span>')+'</div>';
  });
  html += '</div></div></div></div>';
  ctx.body.innerHTML = html;

})();
