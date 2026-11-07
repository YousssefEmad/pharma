(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'deliveries',
    title: t('deliveries'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('deliveries') }]
  });
  if (!ctx) return;
  
  const id = UI.qs('id');
  const session = ctx.session;
  if (id) {
    const po = ProcurementService.getPO(id);
    if (!po) { UI.emptyState(ctx.body); return; }
    let html = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('receiveGoods'))+' — '+escapeHtml(po.number)+'</h3></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>'+escapeHtml(t('receivedQty'))+'</th><th>'+escapeHtml(t('damagedQty'))+'</th><th>'+escapeHtml(t('batchNumber'))+'</th><th>'+escapeHtml(t('expiryDate'))+'</th></tr></thead><tbody>';
    (po.items||[]).forEach(function(it,i){
      const remain = it.qty - (it.receivedQty||0);
      html += '<tr data-pid="'+it.productId+'"><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId)))+'</td><td>'+it.qty+' ('+(it.receivedQty||0)+')</td>'+
        '<td><input type="number" class="form-control form-control-sm rcv" value="'+Math.max(remain,0)+'" style="width:90px" /></td>'+
        '<td><input type="number" class="form-control form-control-sm dmg" value="0" style="width:80px" /></td>'+
        '<td><input class="form-control form-control-sm batch" value="B'+Date.now().toString().slice(-5)+i+'" style="width:110px" /></td>'+
        '<td><input type="date" class="form-control form-control-sm exp" style="width:150px" /></td></tr>';
    });
    html += '</tbody></table></div><div class="p-3"><button class="btn btn-pl-accent" id="btnRcv">'+escapeHtml(t('confirmReceipt'))+'</button></div></div>';
    ctx.body.innerHTML = html;
    document.getElementById('btnRcv').onclick = async function(){
      const ok = await UI.confirm({ title: t('confirmReceipt') });
      if (!ok) return;
      const receipts = [];
      ctx.body.querySelectorAll('tbody tr').forEach(function(tr){
        receipts.push({ productId: tr.getAttribute('data-pid'), receivedQty: Number(tr.querySelector('.rcv').value)||0, damagedQty: Number(tr.querySelector('.dmg').value)||0, batchNo: tr.querySelector('.batch').value, expiryDate: tr.querySelector('.exp').value, notes: '' });
      });
      ProcurementService.receivePO(po.id, receipts);
      UI.toast(t('inventoryUpdated'));
      location.href = 'purchase-orders.html?id='+po.id;
    };
    return;
  }
  const rows = ProcurementService.purchaseOrders({ buyerOrgId: session.orgId }).filter(function(p){ return ['confirmed','partially_delivered','pending_confirmation'].indexOf(p.status)!==-1; });
  let html = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('poNumber'))+'</th><th>'+escapeHtml(t('suppliers'))+'</th><th>'+escapeHtml(t('expectedDelivery'))+'</th><th>'+escapeHtml(t('status'))+'</th><th></th></tr></thead><tbody>';
  rows.forEach(function(p){ html += '<tr><td>'+escapeHtml(p.number)+'</td><td>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(p.supplierOrgId)))+'</td><td>'+Formatters.date(p.expectedDelivery)+'</td><td>'+Formatters.statusBadge(p.status)+'</td><td><a class="btn btn-sm btn-pl-primary" href="deliveries.html?id='+p.id+'">'+escapeHtml(t('receiveGoods'))+'</a></td></tr>'; });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;

})();
