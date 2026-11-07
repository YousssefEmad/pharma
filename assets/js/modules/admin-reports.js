(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'reports',
    title: t('platformReports'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('platformReports') }]
  });
  if (!ctx) return;
  
  const d = DataAPI.data();
  ctx.body.innerHTML = '<div class="row g-3"><div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('totalRequests'))+'</h3></div><div class="pl-card-body"><canvas id="c1" height="200"></canvas></div></div></div><div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('totalPOValue'))+'</h3></div><div class="pl-card-body"><canvas id="c2" height="200"></canvas></div></div></div></div>';
  new Chart(document.getElementById('c1'),{type:'bar',data:{labels:['Requests','Offers','POs'],datasets:[{data:[d.requests.length,d.offers.length,d.purchaseOrders.length],backgroundColor:['#1e4e8c','#0d9488','#d97706']}]},options:{plugins:{legend:{display:false}}}});
  new Chart(document.getElementById('c2'),{type:'line',data:{labels:['W1','W2','W3','W4'],datasets:[{data:[45000,62000,58000,71000],borderColor:'#0d9488',tension:0.3}]},options:{plugins:{legend:{display:false}}}});

})();
