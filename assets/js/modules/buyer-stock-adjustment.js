(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'stockAdjustment',
    title: t('stockAdjustment'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('stockAdjustment') }]
  });
  if (!ctx) return;
  
  
  if (!PermissionService.can('edit')) { ctx.body.innerHTML = '<div class="alert alert-warning">'+escapeHtml(t('permissionDenied'))+'</div>'; return; }
  const products = InventoryService.list(ctx.session.warehouseId);
  let html = '<div class="pl-card" style="max-width:640px"><div class="pl-card-body"><div class="mb-3"><label class="form-label">'+escapeHtml(t('selectProduct'))+'</label><select class="form-select" id="pid">';
  products.forEach(function(r){ html += '<option value="'+r.productId+'" data-qty="'+r.onHand+'">'+escapeHtml(UI.productLabel(r.product))+' ('+r.onHand+')</option>'; });
  html += '</select></div><div class="mb-3"><label class="form-label">'+escapeHtml(t('currentQty'))+'</label><input class="form-control" id="cur" readonly /></div>'+
    '<div class="mb-3"><label class="form-label">'+escapeHtml(t('newQty'))+'</label><input type="number" class="form-control" id="neu" min="0" /></div>'+
    '<div class="mb-3"><label class="form-label">'+escapeHtml(t('difference'))+'</label><input class="form-control" id="diff" readonly /></div>'+
    '<div class="mb-3"><label class="form-label">'+escapeHtml(t('adjustmentReason'))+'</label><select class="form-select" id="reason"><option>جرد</option><option>تلف</option><option>خطأ إدخال</option><option>أخرى</option></select></div>'+
    '<div class="mb-3"><label class="form-label">'+escapeHtml(t('notes'))+'</label><textarea class="form-control" id="notes"></textarea></div>'+
    '<button class="btn btn-pl-primary" id="btnSave">'+escapeHtml(t('confirm'))+'</button></div></div>';
  ctx.body.innerHTML = html;
  function sync(){
    const opt = document.getElementById('pid').selectedOptions[0];
    const cur = Number(opt.getAttribute('data-qty'))||0;
    document.getElementById('cur').value = cur;
    const neu = Number(document.getElementById('neu').value);
    document.getElementById('diff').value = isNaN(neu) ? '' : (neu - cur);
  }
  document.getElementById('pid').onchange = sync;
  document.getElementById('neu').oninput = sync;
  sync();
  document.getElementById('btnSave').onclick = async function(){
    const ok = await UI.confirm({ title: t('stockAdjustment') });
    if (!ok) return;
    InventoryService.adjust(ctx.session.warehouseId, document.getElementById('pid').value, Number(document.getElementById('neu').value), document.getElementById('reason').value, document.getElementById('notes').value);
    UI.toast(t('adjusted'));
    location.href = 'movements.html';
  };

})();
