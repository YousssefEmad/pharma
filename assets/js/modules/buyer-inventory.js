(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'inventory',
    title: t('inventory'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('inventory') }]
  });
  if (!ctx) return;
  
  
  ctx.actions.innerHTML = '<button type="button" class="btn btn-pl-outline btn-sm" id="btnExp">'+escapeHtml(t('exportExcel'))+'</button>';
  const rows = InventoryService.list(ctx.session.warehouseId);
  let html = '<div class="row g-3 mb-3"><div class="col-md-3">'+PharmaApp.statCard('bi-box','teal',t('totalProducts'), Formatters.number(rows.length))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-cash','navy',t('inventoryValue'), Formatters.currency(InventoryService.inventoryValue(ctx.session.warehouseId)))+'</div>'+
    '<div class="col-md-3">'+PharmaApp.statCard('bi-exclamation','amber',t('lowStock'), Formatters.number(rows.filter(function(r){return r.urgency==='high'||r.urgency==='critical';}).length))+'</div></div>';
  html += '<div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table" id="tbl"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('onHand'))+'</th><th>'+escapeHtml(t('reservedQty'))+'</th><th>'+escapeHtml(t('availableQty'))+'</th><th>'+escapeHtml(t('reorderPoint'))+'</th><th>'+escapeHtml(t('warehouseLocation'))+'</th><th>'+escapeHtml(t('urgency'))+'</th></tr></thead><tbody>';
  rows.forEach(function(r){
    html += '<tr><td><a href="product-details.html?id='+r.productId+'">'+escapeHtml(UI.productLabel(r.product))+'</a></td><td>'+r.onHand+'</td><td>'+r.reserved+'</td><td>'+r.available+'</td><td>'+Formatters.number(r.reorderPoint,1)+'</td><td>'+escapeHtml(r.location||'')+'</td><td>'+Formatters.urgencyBadge(r.urgency)+'</td></tr>';
  });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;
  if (window.jQuery && $.fn.DataTable) $('#tbl').DataTable({pageLength:20});
  document.getElementById('btnExp').onclick = function(){
    ExcelHelper.exportObjects('inventory.xlsx', rows.map(function(r){return {n:UI.productLabel(r.product),oh:r.onHand,av:r.available,rp:r.reorderPoint};}),
      [{key:'n',header:t('productName')},{key:'oh',header:t('onHand')},{key:'av',header:t('availableQty')},{key:'rp',header:t('reorderPoint')}]);
  };

})();
