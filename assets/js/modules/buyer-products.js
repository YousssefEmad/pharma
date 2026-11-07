(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'products',
    title: t('products'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('products') }]
  });
  if (!ctx) return;
    ctx.actions.innerHTML = '<button type="button" class="btn btn-pl-primary btn-sm" id="btnAdd"><i class="bi bi-plus"></i> '+escapeHtml(t('addProduct'))+'</button>'+
    '<button type="button" class="btn btn-pl-outline btn-sm" id="btnExport">'+escapeHtml(t('exportExcel'))+'</button>';
  const session = ctx.session;
  function render(q) {
    const inv = InventoryService.list(session.warehouseId, { q: q });
    let html = '<div class="pl-filters"><input class="form-control" id="q" placeholder="'+escapeHtml(t('search'))+'" value="'+escapeHtml(q||'')+'" /><select class="form-select" id="cat"><option value="">'+escapeHtml(t('category'))+'</option>';
    ProductService.categories().forEach(function(c){ html += '<option>'+escapeHtml(c)+'</option>'; });
    html += '</select></div><div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table" id="tbl"><thead><tr>'+
      '<th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('productCode'))+'</th><th>'+escapeHtml(t('barcode'))+'</th><th>'+escapeHtml(t('manufacturer'))+'</th>'+
      '<th>'+escapeHtml(t('availableQty'))+'</th><th>'+escapeHtml(t('purchasePrice'))+'</th><th>'+escapeHtml(t('urgency'))+'</th><th>'+escapeHtml(t('actions'))+'</th></tr></thead><tbody>';
    inv.forEach(function(r){
      const p=r.product||{};
      html += '<tr><td>'+escapeHtml(UI.productLabel(p))+'</td><td>'+escapeHtml(p.code||'')+'</td><td>'+escapeHtml(p.barcode||'')+'</td><td>'+escapeHtml(p.manufacturer||'')+'</td>'+
        '<td>'+Formatters.number(r.available)+'</td><td>'+Formatters.currency(p.purchasePrice)+'</td><td>'+Formatters.urgencyBadge(r.urgency)+'</td>'+
        '<td class="actions"><a class="btn btn-sm btn-pl-outline" href="product-details.html?id='+p.id+'">'+escapeHtml(t('view'))+'</a></td></tr>';
    });
    html += '</tbody></table></div></div>';
    ctx.body.innerHTML = html;
    document.getElementById('q').addEventListener('keydown', function(e){ if(e.key==='Enter') render(this.value); });
    if (window.jQuery && $.fn.DataTable) $('#tbl').DataTable({ pageLength: 15, ordering: true, language: { search: t('search') } });
  }
  render(UI.qs('q'));
  document.getElementById('btnExport').onclick = function(){
    const rows = InventoryService.list(session.warehouseId);
    ExcelHelper.exportObjects('products.xlsx', rows.map(function(r){ return { name: UI.productLabel(r.product), code: r.product&&r.product.code, stock: r.available, price: r.product&&r.product.purchasePrice }; }),
      [{key:'name',header:t('productName')},{key:'code',header:t('productCode')},{key:'stock',header:t('availableQty')},{key:'price',header:t('purchasePrice')}]);
  };
  document.getElementById('btnAdd').onclick = async function(){
    const { value: form } = await Swal.fire({
      title: t('addProduct'),
      html: '<input id="swName" class="swal2-input" placeholder="'+t('productName')+'"><input id="swCode" class="swal2-input" placeholder="'+t('productCode')+'"><input id="swPrice" type="number" class="swal2-input" placeholder="'+t('purchasePrice')+'">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: function(){ return { nameAr: document.getElementById('swName').value, nameEn: document.getElementById('swName').value, code: document.getElementById('swCode').value, purchasePrice: Number(document.getElementById('swPrice').value)||0, sellPrice:0, category:'مسكنات', form:'أقراص', strength:'—', pack:'—', barcode:'', manufacturer:'—', scientific:'', ingredient:'', unit:'علبة', active:true }; }
    });
    if (!form || !form.nameAr) return;
    ProductService.saveProduct(form);
    UI.toast(t('added'));
    render();
  };
})();
