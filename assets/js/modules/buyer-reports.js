(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'reports',
    title: t('reportCenter'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('reportCenter') }]
  });
  if (!ctx) return;
  
  const session = ctx.session;
  const inv = InventoryService.list(session.warehouseId);
  const short = InventoryService.detectShortages(session.warehouseId);
  const exp = InventoryService.expirationBuckets(session.warehouseId);
  const pos = ProcurementService.purchaseOrders({ buyerOrgId: session.orgId });
  ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="exp">' + escapeHtml(t('exportExcel')) + '</button><button class="btn btn-pl-outline btn-sm" onclick="window.print()">' + escapeHtml(t('print')) + '</button>';
  ctx.body.innerHTML = '<div class="row g-3 mb-3">' +
    '<div class="col-md-3">' + PharmaApp.statCard('bi-box','navy',t('inventoryReport'), Formatters.number(inv.length)) + '</div>' +
    '<div class="col-md-3">' + PharmaApp.statCard('bi-exclamation','amber',t('shortageReport'), Formatters.number(short.length)) + '</div>' +
    '<div class="col-md-3">' + PharmaApp.statCard('bi-calendar-x','red',t('expirationReport'), Formatters.number(exp.expired.length + exp.d30.length)) + '</div>' +
    '<div class="col-md-3">' + PharmaApp.statCard('bi-bag','teal',t('purchaseReport'), Formatters.currency(pos.reduce(function(s,p){return s+p.grandTotal;},0))) + '</div></div>' +
    '<div class="row g-3"><div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('stockValuation')) + '</h3></div><div class="pl-card-body"><canvas id="c1" height="220"></canvas></div></div></div>' +
    '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('monthlySpending')) + '</h3></div><div class="pl-card-body"><canvas id="c2" height="220"></canvas></div></div></div></div>' +
    '<div class="pl-card mt-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('slowMoving')) + '</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('availableQty')) + '</th><th>' + escapeHtml(t('avgDailyUsage')) + '</th></tr></thead><tbody>' +
    inv.filter(function(r){ return (r.avgDailyUsage||0) < 1 && r.available > 20; }).slice(0,8).map(function(r){ return '<tr><td>' + escapeHtml(UI.productLabel(r.product)) + '</td><td>' + r.available + '</td><td>' + Formatters.number(r.avgDailyUsage,1) + '</td></tr>'; }).join('') +
    '</tbody></table></div></div>';
  const cats = {};
  inv.forEach(function(r){ const c=(r.product&&r.product.category)||'—'; cats[c]=(cats[c]||0)+((r.product&&r.product.purchasePrice)||0)*(r.onHand||0); });
  new Chart(document.getElementById('c1'), { type:'doughnut', data:{ labels:Object.keys(cats).slice(0,6), datasets:[{ data:Object.keys(cats).slice(0,6).map(function(k){return cats[k];}), backgroundColor:['#0d9488','#1e4e8c','#d97706','#0284c7','#64748b','#15803d'] }] } });
  new Chart(document.getElementById('c2'), { type:'bar', data:{ labels:['Aug','Sep','Oct','Nov'], datasets:[{ data:[98000,110000,125000,88000], backgroundColor:'#1e4e8c' }] }, options:{ plugins:{legend:{display:false}} } });
  document.getElementById('exp').onclick = function(){
    ExcelHelper.exportObjects('inventory-report.xlsx', inv.map(function(r){ return { n:UI.productLabel(r.product), a:r.available, v:((r.product&&r.product.purchasePrice)||0)*r.onHand }; }),
      [{key:'n',header:t('productName')},{key:'a',header:t('availableQty')},{key:'v',header:t('inventoryValue')}]);
  };

})();
