(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'dashboard',
    title: t('platformAdminDash'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('platformAdminDash') }]
  });
  if (!ctx) return;
  
  if (window.PharmaCharts) PharmaCharts.applyDefaults();
  const d = DataAPI.data();
  const buyers = d.organizations.filter(function(o){return o.type==='buyer';});
  const suppliers = d.organizations.filter(function(o){return o.type==='supplier';});
  const activeSubs = d.subscriptions.filter(function(s){return s.status==='active';});
  const poValue = d.purchaseOrders.reduce(function(s,p){return s+(p.grandTotal||0);},0);
  ctx.body.innerHTML = '<div class="row g-3 mb-3">'+
    [['bi-buildings','navy',t('totalOrgs'),d.organizations.length],['bi-shop','teal',t('activeBuyers'),buyers.filter(function(b){return b.status==='active';}).length],['bi-truck','blue',t('activeSuppliers'),suppliers.filter(function(b){return b.status==='active';}).length],['bi-credit-card','green',t('activeSubscriptions'),activeSubs.length],['bi-cart', 'amber',t('totalRequests'),d.requests.length],['bi-tag','teal',t('totalOffers'),d.offers.length],['bi-cash-stack','navy',t('totalPOValue'),Formatters.currency(poValue)],['bi-graph-up','green',t('platformRevenue'),Formatters.currency(activeSubs.reduce(function(s,x){return s+(x.price||0);},0))]].map(function(c){ return '<div class="col-6 col-md-3">'+PharmaApp.statCard(c[0],c[1],c[2], typeof c[3]==='number'?Formatters.number(c[3]):c[3])+'</div>'; }).join('')+
    '</div><div class="row g-3"><div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('verificationRequests'))+'</h3></div><div class="pl-card-body">'+d.organizations.filter(function(o){return o.status==='pending_verification';}).map(function(o){return '<div class="d-flex justify-content-between py-2 border-bottom"><span>'+escapeHtml(UI.orgLabel(o))+'</span><a href="verification.html" class="btn btn-sm btn-pl-outline">'+escapeHtml(t('manage'))+'</a></div>';}).join('')+'</div></div></div>'+
    '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('newRegistrations'))+'</h3></div><div class="pl-card-body"><canvas id="c" height="180"></canvas></div></div></div></div>';
  new Chart(document.getElementById('c'),{type:'bar',data:{labels:['Aug','Sep','Oct','Nov'],datasets:[{data:[2,3,1,2],backgroundColor:'#1e4e8c'}]},options:{plugins:{legend:{display:false}}}});

})();
