(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'procurementRequests',
    title: t('procurementRequests'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('procurementRequests') }]
  });
  if (!ctx) return;
  
  ctx.actions.innerHTML = '<a class="btn btn-pl-primary btn-sm" href="create-request.html"><i class="bi bi-plus"></i> '+escapeHtml(t('createRequest'))+'</a>';
  const rows = ProcurementService.requests({ buyerOrgId: ctx.session.orgId });
  let html = '<div class="pl-filters"><select class="form-select" id="st"><option value="">'+escapeHtml(t('status'))+'</option>'+
    ['draft','pending_offers','comparing','allocated','approved','pending_confirmation','delivered','closed','rejected'].map(function(s){return '<option value="'+s+'">'+escapeHtml(t('status_'+s))+'</option>';}).join('')+
    '</select></div><div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table" id="tbl"><thead><tr><th>'+escapeHtml(t('requestNumber'))+'</th><th>'+escapeHtml(t('date'))+'</th><th>'+escapeHtml(t('productCount'))+'</th><th>'+escapeHtml(t('invitedSuppliers'))+'</th><th>'+escapeHtml(t('offerDeadline'))+'</th><th>'+escapeHtml(t('status'))+'</th><th></th></tr></thead><tbody>';
  rows.forEach(function(r){
    html += '<tr><td>'+escapeHtml(r.number)+'</td><td>'+Formatters.date(r.createdAt)+'</td><td>'+(r.items||[]).length+'</td><td>'+(r.invitedSuppliers||[]).length+'</td><td>'+Formatters.datetime(r.deadline)+'</td><td>'+Formatters.statusBadge(r.status)+'</td>'+
      '<td class="actions"><a class="btn btn-sm btn-pl-outline" href="request-details.html?id='+r.id+'">'+escapeHtml(t('view'))+'</a> '+
      '<a class="btn btn-sm btn-pl-ghost" href="offer-comparison.html?id='+r.id+'">'+escapeHtml(t('comparison'))+'</a></td></tr>';
  });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;
  document.getElementById('st').onchange = function(){
    const v = this.value;
    document.querySelectorAll('#tbl tbody tr').forEach(function(tr){ /* simple filter via reload data */ });
    location.href = v ? ('procurement-requests.html?status='+v) : 'procurement-requests.html';
  };

})();
