(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'requests',
    title: t('excelImport'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('excelImport') }]
  });
  if (!ctx) return;
  
  // Simplified but real SheetJS offer import
  const requestId = UI.qs('requestId');
  const offerId = UI.qs('offerId');
  ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="tpl">'+escapeHtml(t('downloadTemplate'))+'</button>';
  document.getElementById('tpl').onclick = function(){ ExcelHelper.downloadOfferTemplate(); };
  let wb=null, mapped=[];
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body"><div class="pl-file-drop" id="dz"><i class="bi bi-file-earmark-excel"></i><div class="mt-2">'+escapeHtml(t('uploadFile'))+'</div><input type="file" id="f" accept=".xlsx,.xls,.csv" class="d-none" /></div><div id="out" class="mt-3"></div></div></div>';
  const dz=document.getElementById('dz'), f=document.getElementById('f');
  dz.onclick=function(){ f.click(); };
  f.onchange = async function(){
    try {
      wb = await ExcelHelper.readFile(f.files[0]);
      const sheet = ExcelHelper.sheetNames(wb)[0];
      const headers = ExcelHelper.sheetHeaders(wb, sheet);
      const mapping = ProductService.suggestColumnMapping(headers);
      const rows = ExcelHelper.applyMapping(ExcelHelper.sheetToJson(wb, sheet), mapping);
      mapped = rows.map(function(row){
        const m = ProductService.matchProduct({ name: row.productName, code: row.productCode, barcode: row.barcode });
        return { row: row, product: m.product };
      });
      let h = '<table class="pl-table"><thead><tr><th>'+escapeHtml(t('productName'))+'</th><th>'+escapeHtml(t('matched'))+'</th><th>'+escapeHtml(t('unitPrice'))+'</th><th>'+escapeHtml(t('discount'))+'</th><th>'+escapeHtml(t('availableQuantity'))+'</th></tr></thead><tbody>';
      mapped.forEach(function(m){ h += '<tr><td>'+escapeHtml(m.row.productName||'')+'</td><td>'+escapeHtml(m.product?UI.productLabel(m.product):t('unmatched'))+'</td><td>'+escapeHtml(String(m.row.unitPrice||''))+'</td><td>'+escapeHtml(String(m.row.discount||''))+'</td><td>'+escapeHtml(String(m.row.availableQty||''))+'</td></tr>'; });
      h += '</tbody></table><button class="btn btn-pl-accent mt-3" id="apply">'+escapeHtml(t('confirmImport'))+'</button>';
      document.getElementById('out').innerHTML = h;
      document.getElementById('apply').onclick = function(){
        if (!offerId || !requestId) { UI.toast(t('error'),'error'); return; }
        const offer = ProcurementService.getOffer(offerId);
        const items = (offer.items||[]).slice();
        mapped.forEach(function(m){
          if (!m.product) return;
          let it = items.find(function(x){ return x.productId===m.product.id; });
          if (!it) { it = { productId: m.product.id }; items.push(it); }
          it.unitPrice = Number(m.row.unitPrice)||0;
          it.discountPct = Number(m.row.discount)||0;
          it.availableQty = Number(m.row.availableQty)||0;
          it.committedQty = Number(m.row.committedQty||m.row.availableQty)||0;
          it.deliveryDays = Number(m.row.deliveryTime)||3;
          it.netUnitPrice = Math.round(it.unitPrice*(1-it.discountPct/100)*100)/100;
        });
        ProcurementService.saveOffer({ id: offerId, requestId: requestId, supplierOrgId: ctx.session.orgId, status:'draft', items: items });
        UI.toast(t('importSuccess'));
        location.href = 'submit-offer.html?requestId='+encodeURIComponent(requestId);
      };
    } catch(e) { UI.toast(t(e.message)||t('error'),'error'); }
  };

})();
