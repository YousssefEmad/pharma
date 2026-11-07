(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'procurementRequests',
    title: t('createRequest'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('createRequest') }]
  });
  if (!ctx) return;
  
  const existingId = UI.qs('id');
  let draft = existingId ? ProcurementService.getRequest(existingId) : null;
  const session = ctx.session;
  const suppliers = DataAPI.data().supplierRelations.filter(function(r){ return r.buyerOrgId===session.orgId && !r.blocked; });
  const shortages = ShortageService.list(session.warehouseId);
  if (!draft) {
    draft = { buyerOrgId: session.orgId, warehouseId: session.warehouseId, status:'draft', notes:'', invitedSuppliers: suppliers.slice(0,4).map(function(s){return s.supplierOrgId;}), items: shortages.map(function(s){return {productId:s.productId, qty:s.requestedQty, notes:s.notes||''};}) };
  }
  ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="btnDraft">'+escapeHtml(t('saveDraft'))+'</button><button class="btn btn-pl-accent btn-sm" id="btnPub">'+escapeHtml(t('publishRequest'))+'</button>';
  function paint(){
    let html = '<div class="pl-card mb-3"><div class="pl-card-body"><div class="row g-3"><div class="col-md-6"><label class="form-label">'+escapeHtml(t('offerDeadline'))+'</label><input class="form-control" id="deadline" type="datetime-local" /></div>'+
      '<div class="col-md-6"><label class="form-label">'+escapeHtml(t('notes'))+'</label><input class="form-control" id="notes" value="'+escapeHtml(draft.notes||'')+'" /></div></div>'+
      '<div class="mt-3"><label class="form-label">'+escapeHtml(t('invitedSuppliers'))+'</label><div class="row g-2">';
    suppliers.forEach(function(sr){
      const org = DataAPI.findOrg(sr.supplierOrgId);
      const checked = (draft.invitedSuppliers||[]).indexOf(sr.supplierOrgId)!==-1 ? ' checked' : '';
      html += '<div class="col-md-4"><label class="form-check"><input class="form-check-input sup" type="checkbox" value="'+sr.supplierOrgId+'"'+checked+'> <span class="form-check-label">'+escapeHtml(UI.orgLabel(org))+(sr.preferred?' ★':'')+'</span></label></div>';
    });
    html += '</div></div></div></div><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('products'))+'</h3><button class="btn btn-sm btn-pl-outline" id="btnAddLine">'+escapeHtml(t('add'))+'</button></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('quantity'))+'</th><th>'+escapeHtml(t('notes'))+'</th><th></th></tr></thead><tbody id="lines">';
    (draft.items||[]).forEach(function(it,i){
      html += '<tr><td>'+escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId)))+'</td><td><input type="number" class="form-control form-control-sm qty" data-i="'+i+'" value="'+it.qty+'" style="width:100px" /></td><td>'+escapeHtml(it.notes||'')+'</td><td><button class="btn btn-sm btn-pl-ghost rm" data-i="'+i+'"><i class="bi bi-trash"></i></button></td></tr>';
    });
    html += '</tbody></table></div></div>';
    ctx.body.innerHTML = html;
    if (window.flatpickr) { /* optional */ }
    ctx.body.querySelectorAll('.rm').forEach(function(b){ b.onclick = function(){ draft.items.splice(Number(b.getAttribute('data-i')),1); paint(); }; });
    document.getElementById('btnAddLine').onclick = async function(){
      const { value: pid } = await Swal.fire({ title:t('selectProduct'), input:'select', inputOptions: ProductService.list().slice(0,40).reduce(function(a,p){a[p.id]=UI.productLabel(p);return a;},{}), showCancelButton:true });
      if (!pid) return;
      draft.items = draft.items || [];
      draft.items.push({ productId: pid, qty: 10, notes:'' });
      paint();
    };
  }
  function collect(){
    draft.notes = document.getElementById('notes').value;
    draft.invitedSuppliers = Array.prototype.map.call(document.querySelectorAll('.sup:checked'), function(c){ return c.value; });
    ctx.body.querySelectorAll('.qty').forEach(function(inp){ draft.items[Number(inp.getAttribute('data-i'))].qty = Number(inp.value)||0; });
    const dl = document.getElementById('deadline').value;
    if (dl) draft.deadline = new Date(dl).toISOString();
  }
  paint();
  document.getElementById('btnDraft').onclick = function(){ collect(); const saved = ProcurementService.saveRequest(draft); UI.toast(t('savedAsDraft')); location.href='request-details.html?id='+saved.id; };
  document.getElementById('btnPub').onclick = async function(){
    collect();
    if (!(draft.items||[]).length) { UI.toast(t('validationError'),'warning'); return; }
    const ok = await UI.confirm({ title: t('publishRequest') });
    if (!ok) return;
    const saved = ProcurementService.saveRequest(Object.assign(draft,{ status:'draft' }));
    ProcurementService.publishRequest(saved.id);
    UI.toast(t('requestPublished'));
    location.href='request-details.html?id='+saved.id;
  };

})();
