(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'dashboard',
    title: t('supplierDash'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('supplierDash') }]
  });
  if (!ctx) return;
  
  if (window.PharmaCharts) PharmaCharts.applyDefaults();
  const sid = ctx.session.orgId;
  const reqs = ProcurementService.requests({ supplierOrgId: sid });
  const offers = ProcurementService.offersForSupplier(sid);
  const pos = ProcurementService.purchaseOrders({ supplierOrgId: sid });
  const pending = pos.filter(function(p){ return p.status==='pending_confirmation'; });
  const monthly = pos.reduce(function(s,p){ return s+(p.grandTotal||0); },0);
  let reqRows = '';
  reqs.slice(0,6).forEach(function(r){
    reqRows += '<tr class="cursor-pointer" data-href="request-details.html?id=' + r.id + '"><td>' + escapeHtml(r.number) + '</td><td>' + (r.items||[]).length + '</td><td>' + Formatters.datetime(r.deadline) + '</td><td>' + Formatters.statusBadge(r.status) + '</td></tr>';
  });
  ctx.body.innerHTML = '<div class="row g-3 mb-3">' +
    '<div class="col-6 col-md-3">' + PharmaApp.statCard('bi-inbox','blue',t('incomingProcurement'), String(reqs.length)) + '</div>' +
    '<div class="col-6 col-md-3">' + PharmaApp.statCard('bi-tag','teal',t('submittedOffers'), String(offers.filter(function(o){return o.status==='submitted';}).length)) + '</div>' +
    '<div class="col-6 col-md-3">' + PharmaApp.statCard('bi-receipt','amber',t('pendingPOs'), String(pending.length)) + '</div>' +
    '<div class="col-6 col-md-3">' + PharmaApp.statCard('bi-cash','green',t('monthlySales'), Formatters.currency(monthly)) + '</div></div>' +
    '<div class="row g-3"><div class="col-lg-7"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('monthlyOfferActivity')) + '</h3></div><div class="pl-card-body"><div class="pl-chart-box"><canvas id="c1"></canvas></div></div></div></div>' +
    '<div class="col-lg-5"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('ordersByStatus')) + '</h3></div><div class="pl-card-body"><div class="pl-chart-box"><canvas id="c2"></canvas></div></div></div></div></div>' +
    '<div class="pl-card mt-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('availableRequests')) + '</h3><a href="requests.html">' + escapeHtml(t('viewAll')) + '</a></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('requestNumber')) + '</th><th>' + escapeHtml(t('productCount')) + '</th><th>' + escapeHtml(t('offerDeadline')) + '</th><th>' + escapeHtml(t('status')) + '</th></tr></thead><tbody>' + reqRows + '</tbody></table></div></div>';
  ctx.body.querySelectorAll('[data-href]').forEach(function(tr){ tr.addEventListener('click', function(){ location.href = tr.getAttribute('data-href'); }); });
  new Chart(document.getElementById('c1'), { type:'line', data:{ labels:['Aug','Sep','Oct','Nov'], datasets:[{ data:[4,7,5,offers.length], borderColor:'#0d9488', fill:false, tension:0.3 }] }, options:{ maintainAspectRatio:false, plugins:{legend:{display:false}} } });
  const statuses = {};
  pos.forEach(function(p){ statuses[p.status]=(statuses[p.status]||0)+1; });
  new Chart(document.getElementById('c2'), { type:'doughnut', data:{ labels:Object.keys(statuses), datasets:[{ data:Object.keys(statuses).map(function(k){return statuses[k];}), backgroundColor:['#0d9488','#1e4e8c','#d97706','#dc2626','#64748b'] }] }, options:{ maintainAspectRatio:false } });

})();
