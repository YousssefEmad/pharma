(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'movements',
    title: t('movements'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('movements') }]
  });
  if (!ctx) return;
  
  
  const types = ['','purchase_receipt','sales_issue','purchase_return','sales_return','adjustment','transfer','damaged','expired'];
  let html = '<div class="pl-filters"><input class="form-control" id="q" placeholder="'+escapeHtml(t('search'))+'" /><select class="form-select" id="type"><option value="">'+escapeHtml(t('movementType'))+'</option>';
  types.slice(1).forEach(function(tp){ html += '<option value="'+tp+'">'+escapeHtml(t('movement_'+tp))+'</option>'; });
  html += '</select><button class="btn btn-pl-outline btn-sm" id="btnGo">'+escapeHtml(t('apply'))+'</button></div><div id="box"></div>';
  ctx.body.innerHTML = html;
  function paint(){
    const rows = InventoryService.movements(ctx.session.warehouseId, { q: document.getElementById('q').value, type: document.getElementById('type').value });
    let h = '<div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('date'))+'</th><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('movementType'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>Ref</th><th>'+escapeHtml(t('notes'))+'</th></tr></thead><tbody>';
    rows.forEach(function(m){
      h += '<tr><td>'+Formatters.datetime(m.date)+'</td><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(m.productId)))+'</td><td>'+escapeHtml(t('movement_'+m.type))+'</td><td>'+m.qty+'</td><td>'+escapeHtml(m.ref||'')+'</td><td>'+escapeHtml(m.notes||'')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    document.getElementById('box').innerHTML = h;
  }
  document.getElementById('btnGo').onclick = paint;
  paint();

})();
