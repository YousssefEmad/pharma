(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'stockTransfers',
    title: t('stockTransfers'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('stockTransfers') }]
  });
  if (!ctx) return;
  
  
  const data = DataAPI.data();
  const whs = data.warehouses.filter(function(w){ return w.orgId === ctx.session.orgId; });
  let html = '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('transferRequest'))+'</h3></div><div class="pl-card-body"><div class="row g-2">'+
    '<div class="col-md-4"><label class="form-label">'+escapeHtml(t('sourceWarehouse'))+'</label><select class="form-select" id="src">'+whs.map(function(w){return '<option value="'+w.id+'">'+escapeHtml(StorageService.getLang()==='ar'?w.nameAr:w.nameEn)+'</option>';}).join('')+'</select></div>'+
    '<div class="col-md-4"><label class="form-label">'+escapeHtml(t('destWarehouse'))+'</label><select class="form-select" id="dst">'+whs.map(function(w){return '<option value="'+w.id+'">'+escapeHtml(StorageService.getLang()==='ar'?w.nameAr:w.nameEn)+'</option>';}).join('')+'</select></div>'+
    '<div class="col-md-4"><label class="form-label">'+escapeHtml(t('productName'))+'</label><select class="form-select" id="pid">'+ProductService.list().slice(0,40).map(function(p){return '<option value="'+p.id+'">'+escapeHtml(UI.productLabel(p))+'</option>';}).join('')+'</select></div>'+
    '<div class="col-md-3"><label class="form-label">'+escapeHtml(t('quantity'))+'</label><input type="number" class="form-control" id="qty" value="5" /></div>'+
    '<div class="col-md-3 d-flex align-items-end"><button class="btn btn-pl-primary" id="btnAdd">'+escapeHtml(t('add'))+'</button></div></div></div></div>';
  html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('transferHistory'))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>ID</th><th>'+escapeHtml(t('sourceWarehouse'))+'</th><th>'+escapeHtml(t('destWarehouse'))+'</th><th>'+escapeHtml(t('status'))+'</th><th>'+escapeHtml(t('date'))+'</th></tr></thead><tbody>';
  (data.transfers||[]).forEach(function(tr){
    const src = data.warehouses.find(function(w){return w.id===tr.fromWarehouseId;});
    const dst = data.warehouses.find(function(w){return w.id===tr.toWarehouseId;});
    html += '<tr><td>'+escapeHtml(tr.id)+'</td><td>'+escapeHtml(src?src.nameAr:'')+'</td><td>'+escapeHtml(dst?dst.nameAr:'')+'</td><td>'+Formatters.statusBadge(tr.status)+'</td><td>'+Formatters.date(tr.createdAt)+'</td></tr>';
  });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;
  document.getElementById('btnAdd').onclick = function(){
    DataAPI.save(function(d){
      d.counters.transfer = (d.counters.transfer||0)+1;
      d.transfers.unshift({ id:'TR-'+String(d.counters.transfer).padStart(3,'0'), fromWarehouseId:document.getElementById('src').value, toWarehouseId:document.getElementById('dst').value, status:'pending', createdAt:new Date().toISOString(), items:[{ productId:document.getElementById('pid').value, qty:Number(document.getElementById('qty').value)||0 }] });
      return d;
    });
    UI.toast(t('transferred'));
    location.reload();
  };

})();
