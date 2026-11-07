(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'catalog',
    title: t('catalog'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('catalog') }]
  });
  if (!ctx) return;
  
  ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="btnExp">'+escapeHtml(t('exportExcel'))+'</button>';
  let html = '<div class="pl-filters"><input class="form-control" id="q" placeholder="'+escapeHtml(t('search'))+'" /><select class="form-select" id="cat"><option value="">'+escapeHtml(t('category'))+'</option>'+
    ProductService.categories().map(function(c){return '<option>'+escapeHtml(c)+'</option>';}).join('')+'</select><button class="btn btn-pl-outline btn-sm" id="go">'+escapeHtml(t('apply'))+'</button></div><div id="box"></div>';
  ctx.body.innerHTML = html;
  function paint(){
    const rows = ProductService.list({ q: document.getElementById('q').value, category: document.getElementById('cat').value });
    let h = '<div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table" id="tbl"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('scientificName'))+'</th><th>'+escapeHtml(t('strength'))+'</th><th>'+escapeHtml(t('dosageForm'))+'</th><th>'+escapeHtml(t('manufacturer'))+'</th><th>'+escapeHtml(t('barcode'))+'</th><th>'+escapeHtml(t('category'))+'</th></tr></thead><tbody>';
    rows.forEach(function(p){ h += '<tr><td>'+escapeHtml(UI.productLabel(p))+'</td><td>'+escapeHtml(p.scientific||'')+'</td><td>'+escapeHtml(p.strength)+'</td><td>'+escapeHtml(p.form)+'</td><td>'+escapeHtml(p.manufacturer)+'</td><td>'+escapeHtml(p.barcode)+'</td><td>'+escapeHtml(p.category)+'</td></tr>'; });
    h += '</tbody></table></div></div>';
    document.getElementById('box').innerHTML = h;
    if (window.jQuery && $.fn.DataTable) $('#tbl').DataTable({pageLength:15});
  }
  document.getElementById('go').onclick = paint; paint();
  document.getElementById('btnExp').onclick = function(){
    ExcelHelper.exportObjects('catalog.xlsx', ProductService.list(), [{key:'nameAr',header:t('productName')},{key:'code',header:t('productCode')},{key:'barcode',header:t('barcode')},{key:'manufacturer',header:t('manufacturer')}]);
  };

})();
