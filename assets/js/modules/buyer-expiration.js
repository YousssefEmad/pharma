(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'expiration',
    title: t('expiration'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('expiration') }]
  });
  if (!ctx) return;
  
  
  const b = InventoryService.expirationBuckets(ctx.session.warehouseId);
  function table(rows){
    let h = '<table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('batchNumber'))+'</th><th>'+escapeHtml(t('expiryDate'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>'+escapeHtml(t('daysLeft'))+'</th></tr></thead><tbody>';
    rows.forEach(function(r){ h += '<tr><td>'+escapeHtml(UI.productLabel(r.product))+'</td><td>'+escapeHtml(r.batchNo)+'</td><td>'+Formatters.date(r.expiryDate)+'</td><td>'+r.qty+'</td><td>'+r.daysLeft+'</td></tr>'; });
    if (!rows.length) h += '<tr><td colspan="5" class="text-center text-muted py-3">'+escapeHtml(t('noData'))+'</td></tr>';
    return h + '</tbody></table>';
  }
  ctx.body.innerHTML = '<div class="row g-3 mb-3"><div class="col-md-3">'+PharmaApp.statCard('bi-x-circle','red',t('expiredProducts'), String(b.expired.length))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-clock','amber',t('expiring30'), String(b.d30.length))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-clock-history','blue',t('expiring60'), String(b.d60.length))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-calendar','teal',t('expiring90'), String(b.d90.length))+'</div></div>'+
    '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('expiredProducts'))+'</h3></div><div class="pl-card-body p-0 pl-table-wrap">'+table(b.expired)+'</div></div>'+
    '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('expiring30'))+'</h3></div><div class="pl-card-body p-0 pl-table-wrap">'+table(b.d30)+'</div></div>'+
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('expiring60'))+' / 90</h3></div><div class="pl-card-body p-0 pl-table-wrap">'+table(b.d60.concat(b.d90))+'</div></div>';

})();
