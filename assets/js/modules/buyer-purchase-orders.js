(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'purchaseOrders',
    title: t('purchaseOrders'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('purchaseOrders') }]
  });
  if (!ctx) return;
  
  const id = UI.qs('id');
  if (id) {
    const po = ProcurementService.getPO(id);
    if (!po) { UI.emptyState(ctx.body); return; }
    ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="btnPrint">'+escapeHtml(t('print'))+'</button><button class="btn btn-pl-outline btn-sm" id="btnPdf">'+escapeHtml(t('exportPdf'))+'</button><button class="btn btn-pl-outline btn-sm" id="btnXls">'+escapeHtml(t('exportExcel'))+'</button><button class="btn btn-pl-ghost btn-sm" id="btnNotify">'+escapeHtml(t('sendSimulated'))+'</button>';
    let html = '<div class="pl-po-doc" id="poDoc"><div class="po-header"><div><div class="fw-bold fs-5">'+escapeHtml(t('appName'))+'</div><div class="small text-muted">'+escapeHtml(t('demoBadge'))+'</div></div><div class="text-end"><div class="fw-bold">'+escapeHtml(po.number)+'</div>'+Formatters.statusBadge(po.status)+'</div></div>';
    html += '<div class="row mb-3"><div class="col-md-6"><strong>'+escapeHtml(t('buyerInfo'))+'</strong><div>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(po.buyerOrgId)))+'</div></div><div class="col-md-6"><strong>'+escapeHtml(t('supplierInfo'))+'</strong><div>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(po.supplierOrgId)))+'</div></div></div>';
    html += '<table class="pl-table mb-3"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>'+escapeHtml(t('unitPrice'))+'</th><th>'+escapeHtml(t('discount'))+'</th><th>'+escapeHtml(t('netUnitPrice'))+'</th><th>'+escapeHtml(t('lineCost'))+'</th></tr></thead><tbody>';
    (po.items||[]).forEach(function(it){ html += '<tr><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId)))+'</td><td>'+it.qty+'</td><td>'+Formatters.currency(it.unitPrice)+'</td><td>'+Formatters.percent(it.discountPct||0)+'</td><td>'+Formatters.currency(it.netUnitPrice)+'</td><td>'+Formatters.currency(it.lineTotal)+'</td></tr>'; });
    html += '</tbody></table><div class="text-end fw-bold fs-5">'+escapeHtml(t('grandTotal'))+': '+Formatters.currency(po.grandTotal)+'</div>';
    html += '<div class="small text-muted mt-3">'+escapeHtml(t('expectedDelivery'))+': '+Formatters.date(po.expectedDelivery)+' · '+escapeHtml(t('approvalDate'))+': '+Formatters.date(po.approvedAt)+'</div></div>';
    ctx.body.innerHTML = html + '<div class="mt-3"><a href="purchase-orders.html" class="btn btn-pl-outline btn-sm">'+escapeHtml(t('back'))+'</a> <a href="deliveries.html?id='+po.id+'" class="btn btn-pl-primary btn-sm">'+escapeHtml(t('receiveGoods'))+'</a></div>';
    document.getElementById('btnPrint').onclick = function(){ window.print(); };
    document.getElementById('btnNotify').onclick = function(){ UI.toast(t('notificationSent')); };
    document.getElementById('btnXls').onclick = function(){ ExcelHelper.exportObjects(po.number+'.xlsx', po.items.map(function(it){return {p:UI.productLabel(DataAPI.findProduct(it.productId)),q:it.qty,n:it.netUnitPrice,t:it.lineTotal};}), [{key:'p',header:t('productName')},{key:'q',header:t('quantity')},{key:'n',header:t('netUnitPrice')},{key:'t',header:t('lineCost')}]); };
    document.getElementById('btnPdf').onclick = function(){
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(14); doc.text(po.number, 14, 20);
      doc.setFontSize(10); doc.text('Total: '+po.grandTotal+' EGP', 14, 28);
      doc.autoTable({ startY: 35, head: [['Product','Qty','Net','Total']], body: po.items.map(function(it){ return [UI.productLabel(DataAPI.findProduct(it.productId)), it.qty, it.netUnitPrice, it.lineTotal]; }) });
      doc.save(po.number+'.pdf');
    };
    return;
  }
  const rows = ProcurementService.purchaseOrders({ buyerOrgId: ctx.session.orgId });
  let html = '<div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('poNumber'))+'</th><th>'+escapeHtml(t('suppliers'))+'</th><th>'+escapeHtml(t('date'))+'</th><th>'+escapeHtml(t('grandTotal'))+'</th><th>'+escapeHtml(t('status'))+'</th><th></th></tr></thead><tbody>';
  rows.forEach(function(p){ html += '<tr><td>'+escapeHtml(p.number)+'</td><td>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(p.supplierOrgId)))+'</td><td>'+Formatters.date(p.createdAt)+'</td><td>'+Formatters.currency(p.grandTotal)+'</td><td>'+Formatters.statusBadge(p.status)+'</td><td><a class="btn btn-sm btn-pl-outline" href="purchase-orders.html?id='+p.id+'">'+escapeHtml(t('view'))+'</a></td></tr>'; });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;

})();
