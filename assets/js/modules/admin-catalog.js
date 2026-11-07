(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'catalog',
    title: t('catalog'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('catalog') }]
  });
  if (!ctx) return;
  
  ctx.actions.innerHTML = '<button class="btn btn-pl-primary btn-sm" id="add">'+escapeHtml(t('addProduct'))+'</button>';
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table" id="tbl"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('productCode'))+'</th><th>'+escapeHtml(t('barcode'))+'</th><th>'+escapeHtml(t('manufacturer'))+'</th><th>'+escapeHtml(t('category'))+'</th></tr></thead><tbody>'+
    ProductService.list().map(function(p){ return '<tr><td>'+escapeHtml(UI.productLabel(p))+'</td><td>'+escapeHtml(p.code)+'</td><td>'+escapeHtml(p.barcode)+'</td><td>'+escapeHtml(p.manufacturer)+'</td><td>'+escapeHtml(p.category)+'</td></tr>'; }).join('')+
    '</tbody></table></div></div>';
  if (window.jQuery && $.fn.DataTable) $('#tbl').DataTable({pageLength:20});
  document.getElementById('add').onclick = async function(){
    const { value: name } = await Swal.fire({ title:t('addProduct'), input:'text', showCancelButton:true });
    if (!name) return;
    ProductService.saveProduct({ nameAr:name, nameEn:name, code:'NEW-'+Date.now().toString().slice(-4), barcode:'', scientific:'', ingredient:'', strength:'—', form:'أقراص', pack:'—', manufacturer:'—', category:'مسكنات', unit:'علبة', purchasePrice:0, sellPrice:0 });
    location.reload();
  };

})();
