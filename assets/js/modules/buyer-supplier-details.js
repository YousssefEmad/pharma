(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'suppliers',
    title: t('supplierDetails'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('supplierDetails') }]
  });
  if (!ctx) return;
  
  const id = UI.qs('id');
  const o = DataAPI.findOrg(id);
  if (!o) { UI.emptyState(ctx.body); return; }
  const offers = DataAPI.data().offers.filter(function(x){ return x.supplierOrgId===id; });
  const pos = DataAPI.data().purchaseOrders.filter(function(x){ return x.supplierOrgId===id && x.buyerOrgId===ctx.session.orgId; });
  ctx.body.innerHTML = '<div class="row g-3"><div class="col-lg-4"><div class="pl-card"><div class="pl-card-body"><h3 class="h5">'+escapeHtml(UI.orgLabel(o))+'</h3><div class="small text-muted mb-2">'+escapeHtml(o.city)+'</div>'+Formatters.statusBadge(o.status)+
    '<div class="mt-3"><div>'+escapeHtml(t('responseRate'))+': '+Formatters.percent(o.responseRate||0)+'</div><div>'+escapeHtml(t('onTimeRate'))+': '+Formatters.percent(o.onTimeRate||0)+'</div><div>'+escapeHtml(t('rating'))+': '+(o.rating||'—')+'</div></div></div></div></div>'+
    '<div class="col-lg-8"><div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('offerHistory'))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>ID</th><th>'+escapeHtml(t('requestNumber'))+'</th><th>'+escapeHtml(t('status'))+'</th><th>'+escapeHtml(t('date'))+'</th></tr></thead><tbody>'+
    offers.map(function(off){ return '<tr><td>'+escapeHtml(off.id)+'</td><td>'+escapeHtml(off.requestId)+'</td><td>'+Formatters.statusBadge(off.status)+'</td><td>'+Formatters.date(off.submittedAt)+'</td></tr>'; }).join('')+
    '</tbody></table></div></div><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('purchaseOrders'))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('poNumber'))+'</th><th>'+escapeHtml(t('total'))+'</th><th>'+escapeHtml(t('status'))+'</th></tr></thead><tbody>'+
    pos.map(function(p){ return '<tr><td><a href="purchase-orders.html?id='+p.id+'">'+escapeHtml(p.number)+'</a></td><td>'+Formatters.currency(p.grandTotal)+'</td><td>'+Formatters.statusBadge(p.status)+'</td></tr>'; }).join('')+
    '</tbody></table></div></div></div></div>';

})();
