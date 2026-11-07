(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'products',
    title: t('productDetails'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('productDetails') }]
  });
  if (!ctx) return;
    const id = UI.qs("id");
  const p = ProductService.get(id);
  if (!p) { UI.emptyState(ctx.body); return; }
  const inv = DataAPI.getInventoryRow(ctx.session.warehouseId, id);
  const batches = DataAPI.data().batches.filter(function(b){ return b.productId===id && b.warehouseId===ctx.session.warehouseId; });
  const mov = InventoryService.movements(ctx.session.warehouseId, { productId: id }).slice(0,10);
  ctx.body.innerHTML = '<div class="row g-3"><div class="col-lg-8"><div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(UI.productLabel(p))+'</h3></div><div class="pl-card-body">'+
    '<div class="row g-2 small"><div class="col-md-6"><strong>'+escapeHtml(t("productCode"))+':</strong> '+escapeHtml(p.code)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("barcode"))+':</strong> '+escapeHtml(p.barcode)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("activeIngredient"))+':</strong> '+escapeHtml(p.ingredient)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("strength"))+':</strong> '+escapeHtml(p.strength)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("dosageForm"))+':</strong> '+escapeHtml(p.form)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("manufacturer"))+':</strong> '+escapeHtml(p.manufacturer)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("purchasePrice"))+':</strong> '+Formatters.currency(p.purchasePrice)+'</div>'+
    '<div class="col-md-6"><strong>'+escapeHtml(t("sellingPrice"))+':</strong> '+Formatters.currency(p.sellPrice)+'</div></div></div></div>'+
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t("movements"))+'</h3></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t("date"))+'</th><th>'+escapeHtml(t("movementType"))+'</th><th>'+escapeHtml(t("quantity"))+'</th><th>'+escapeHtml(t("notes"))+'</th></tr></thead><tbody>'+
    mov.map(function(m){ return '<tr><td>'+Formatters.date(m.date)+'</td><td>'+escapeHtml(t("movement_"+m.type))+'</td><td>'+m.qty+'</td><td>'+escapeHtml(m.notes||"")+'</td></tr>'; }).join("")+
    '</tbody></table></div></div></div><div class="col-lg-4">'+
    '<div class="pl-card mb-3"><div class="pl-card-body">'+PharmaApp.statCard("bi-box","teal",t("availableQty"), Formatters.number(DataAPI.availableQty(inv)))+
    '<div class="mt-3 small"><div>'+escapeHtml(t("onHand"))+': '+Formatters.number(inv&&inv.onHand)+'</div><div>'+escapeHtml(t("reservedQty"))+': '+Formatters.number(inv&&inv.reserved)+'</div><div>'+escapeHtml(t("warehouseLocation"))+': '+escapeHtml(inv&&inv.location||"—")+'</div></div></div></div>'+
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t("batches"))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t("batchNumber"))+'</th><th>'+escapeHtml(t("expiryDate"))+'</th><th>'+escapeHtml(t("quantity"))+'</th></tr></thead><tbody>'+
    batches.map(function(b){ return '<tr><td>'+escapeHtml(b.batchNo)+'</td><td>'+Formatters.date(b.expiryDate)+'</td><td>'+b.qty+'</td></tr>'; }).join("")+
    '</tbody></table></div></div></div></div>';
})();
