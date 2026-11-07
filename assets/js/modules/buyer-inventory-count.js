(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'inventoryCount',
    title: t('inventoryCount'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('inventoryCount') }]
  });
  if (!ctx) return;
  
  
  const session = ctx.session;
  const inv = InventoryService.list(session.warehouseId).slice(0, 12);
  let html = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('createSession'))+'</h3><button class="btn btn-pl-accent btn-sm" id="btnConfirm">'+escapeHtml(t('confirm'))+'</button></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('systemQty'))+'</th><th>'+escapeHtml(t('countedQty'))+'</th><th>'+escapeHtml(t('discrepancy'))+'</th></tr></thead><tbody>';
  inv.forEach(function(r){
    html += '<tr><td>'+escapeHtml(UI.productLabel(r.product))+'</td><td class="sys" data-pid="'+r.productId+'">'+r.onHand+'</td><td><input type="number" class="form-control form-control-sm cnt" data-pid="'+r.productId+'" value="'+r.onHand+'" style="width:100px" /></td><td class="disc" data-pid="'+r.productId+'">0</td></tr>';
  });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;
  ctx.body.querySelectorAll('.cnt').forEach(function(inp){
    inp.addEventListener('input', function(){
      const pid = inp.getAttribute('data-pid');
      const sys = Number(ctx.body.querySelector('.sys[data-pid="'+pid+'"]').textContent)||0;
      ctx.body.querySelector('.disc[data-pid="'+pid+'"]').textContent = (Number(inp.value)||0) - sys;
    });
  });
  document.getElementById('btnConfirm').onclick = async function(){
    const ok = await UI.confirm({ title: t('inventoryCount'), text: t('confirmAction') });
    if (!ok) return;
    ctx.body.querySelectorAll('.cnt').forEach(function(inp){
      const pid = inp.getAttribute('data-pid');
      const sys = Number(ctx.body.querySelector('.sys[data-pid="'+pid+'"]').textContent)||0;
      const counted = Number(inp.value)||0;
      if (counted !== sys) InventoryService.adjust(session.warehouseId, pid, counted, 'جرد', 'Inventory count');
    });
    UI.toast(t('counted'));
    location.href = 'movements.html';
  };

})();
