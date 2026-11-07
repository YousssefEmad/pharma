(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'purchaseOrders',
    title: t('purchaseOrders'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('purchaseOrders') }]
  });
  if (!ctx) return;
  
  const id = UI.qs('id');
  const rows = ProcurementService.purchaseOrders({ supplierOrgId: ctx.session.orgId });
  if (id) {
    const po = ProcurementService.getPO(id);
    if (!po) { UI.emptyState(ctx.body); return; }
    const canConfirm = PermissionService.can('confirmPO');
    ctx.actions.innerHTML = canConfirm ? '<button class="btn btn-pl-accent btn-sm" id="btnOk">'+escapeHtml(t('confirmOrder'))+'</button><button class="btn btn-outline-danger btn-sm" id="btnNo">'+escapeHtml(t('reject'))+'</button>' : '<span class="pl-badge badge-warning">'+escapeHtml(t('viewerCannotApprove'))+'</span>';
    ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body"><div class="fw-bold mb-2">'+escapeHtml(po.number)+' '+Formatters.statusBadge(po.status)+'</div><div class="mb-2">'+escapeHtml(UI.orgLabel(DataAPI.findOrg(po.buyerOrgId)))+' · '+Formatters.currency(po.grandTotal)+'</div><table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>'+escapeHtml(t('netUnitPrice'))+'</th><th>'+escapeHtml(t('lineCost'))+'</th></tr></thead><tbody>'+
      (po.items||[]).map(function(it){ return '<tr><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId)))+'</td><td>'+it.qty+'</td><td>'+Formatters.currency(it.netUnitPrice)+'</td><td>'+Formatters.currency(it.lineTotal)+'</td></tr>'; }).join('')+
      '</tbody></table></div></div>';
    if (canConfirm) {
      document.getElementById('btnOk').onclick = async function(){ if(await UI.confirm({title:t('confirmOrder')})){ ProcurementService.updatePOStatus(po.id,'confirmed'); UI.toast(t('confirmed')); location.reload(); } };
      document.getElementById('btnNo').onclick = async function(){ if(await UI.confirm({title:t('reject'),icon:'warning'})){ ProcurementService.updatePOStatus(po.id,'rejected'); UI.toast(t('status_rejected')); location.reload(); } };
    }
    return;
  }
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('poNumber'))+'</th><th>'+escapeHtml(t('organization'))+'</th><th>'+escapeHtml(t('grandTotal'))+'</th><th>'+escapeHtml(t('status'))+'</th><th></th></tr></thead><tbody>'+
    rows.map(function(p){ return '<tr><td>'+escapeHtml(p.number)+'</td><td>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(p.buyerOrgId)))+'</td><td>'+Formatters.currency(p.grandTotal)+'</td><td>'+Formatters.statusBadge(p.status)+'</td><td><a class="btn btn-sm btn-pl-outline" href="purchase-orders.html?id='+p.id+'">'+escapeHtml(t('view'))+'</a></td></tr>'; }).join('')+
    '</tbody></table></div></div>';

})();
