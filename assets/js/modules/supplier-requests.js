(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'requests',
    title: t('availableRequests'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('availableRequests') }]
  });
  if (!ctx) return;
  
  const rows = ProcurementService.requests({ supplierOrgId: ctx.session.orgId });
  const q = UI.qs('q') || '';
  let html = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('requestNumber'))+'</th><th>'+escapeHtml(t('organization'))+'</th><th>'+escapeHtml(t('productCount'))+'</th><th>'+escapeHtml(t('offerDeadline'))+'</th><th>'+escapeHtml(t('status'))+'</th><th></th></tr></thead><tbody>';
  rows.filter(function(r){ return !q || (r.number||'').toLowerCase().indexOf(q.toLowerCase())!==-1; }).forEach(function(r){
    const off = ProcurementService.offersForSupplier(ctx.session.orgId).find(function(o){ return o.requestId===r.id; });
    html += '<tr><td>'+escapeHtml(r.number)+'</td><td>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(r.buyerOrgId)))+'</td><td>'+(r.items||[]).length+'</td><td>'+Formatters.datetime(r.deadline)+'</td><td>'+Formatters.statusBadge(r.status)+'</td>'+
      '<td><a class="btn btn-sm btn-pl-outline" href="request-details.html?id='+r.id+'">'+escapeHtml(t('view'))+'</a> '+
      '<a class="btn btn-sm btn-pl-primary" href="submit-offer.html?requestId='+r.id+'">'+(off&&off.status==='submitted'?escapeHtml(t('edit')):escapeHtml(t('submitOffer')))+'</a></td></tr>';
  });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;

})();
