/**
 * PHARMA LINK — Smart Offer Comparison
 */
(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'offerComparison',
    title: t('offerComparison'),
    description: t('comparison'),
    breadcrumb: [
      { label: t('home'), href: '/buyer/dashboard.html' },
      { label: t('procurementRequests'), href: '/buyer/procurement-requests.html' },
      { label: t('offerComparison') }
    ]
  });
  if (!ctx) return;

  let requestId = UI.qs('id') || 'PR-2024-009';
  let request = ProcurementService.getRequest(requestId);
  if (!request) request = ProcurementService.getRequest('PR-2024-003') || ProcurementService.requests()[0];
  if (!request) { UI.emptyState(ctx.body); return; }
  requestId = request.id;

  let viewMode = 'product';
  let sortBy = 'net';
  let filterSupplier = '';

  ctx.actions.innerHTML =
    '<select class="form-select form-select-sm" id="reqSel" style="min-width:170px"></select>' +
    '<a class="btn btn-pl-accent btn-sm" id="btnAlloc" href="allocation-review.html?id=' + encodeURIComponent(requestId) + '"><i class="bi bi-diagram-3"></i> ' + escapeHtml(t('runAllocation')) + '</a>' +
    '<a class="btn btn-pl-outline btn-sm" href="request-details.html?id=' + encodeURIComponent(requestId) + '">' + escapeHtml(t('requestDetails')) + '</a>';

  const reqSel = document.getElementById('reqSel');
  ProcurementService.requests().forEach(function (r) {
    const o = document.createElement('option');
    o.value = r.id;
    o.textContent = r.number;
    if (r.id === requestId) o.selected = true;
    reqSel.appendChild(o);
  });
  reqSel.addEventListener('change', function () {
    location.href = 'offer-comparison.html?id=' + encodeURIComponent(reqSel.value);
  });

  function net(it) {
    return AllocationService.netPrice(it);
  }

  function render() {
    const offers = ProcurementService.offersForRequest(requestId).filter(function (o) { return o.status === 'submitted'; });
    let html = '<div class="d-flex flex-wrap gap-2 align-items-center mb-3">';
    html += '<div class="pl-pill-tabs" id="viewTabs">';
    html += '<button type="button" data-mode="product" class="' + (viewMode === 'product' ? 'active' : '') + '">' + escapeHtml(t('byProduct')) + '</button>';
    html += '<button type="button" data-mode="supplier" class="' + (viewMode === 'supplier' ? 'active' : '') + '">' + escapeHtml(t('bySupplier')) + '</button>';
    html += '<button type="button" data-mode="summary" class="' + (viewMode === 'summary' ? 'active' : '') + '">' + escapeHtml(t('fullSummary')) + '</button>';
    html += '</div>';
    html += '<select class="form-select form-select-sm" id="sortBy" style="width:auto"><option value="net">' + escapeHtml(t('sortByNet')) + '</option><option value="discount">' + escapeHtml(t('sortByDiscount')) + '</option><option value="qty">' + escapeHtml(t('sortByQty')) + '</option></select>';
    html += '<select class="form-select form-select-sm" id="fltSup" style="width:auto"><option value="">' + escapeHtml(t('filterSupplier')) + '</option>';
    (request.invitedSuppliers || []).forEach(function (sid) {
      html += '<option value="' + sid + '"' + (filterSupplier === sid ? ' selected' : '') + '>' + escapeHtml(UI.orgLabel(DataAPI.findOrg(sid))) + '</option>';
    });
    html += '</select></div>';

    // Build comparison rows
    const engine = AllocationService.allocate(request, offers, DataAPI.data().allocationPolicies);

    if (viewMode === 'summary') {
      html += '<div class="row g-3 mb-3">';
      html += '<div class="col-md-4">' + PharmaApp.statCard('bi-cash', 'teal', t('totalCost'), Formatters.currency(engine.totals.totalCost)) + '</div>';
      html += '<div class="col-md-4">' + PharmaApp.statCard('bi-piggy-bank', 'green', t('estimatedSavings'), Formatters.currency(engine.totals.savings)) + '</div>';
      html += '<div class="col-md-4">' + PharmaApp.statCard('bi-people', 'blue', t('supplierDistribution'), Formatters.number(Object.keys(engine.supplierDistribution).length)) + '</div>';
      html += '</div>';
      html += '<div class="pl-card"><div class="pl-card-body pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('requestedQty')) + '</th><th>' + escapeHtml(t('allocatedQty')) + '</th><th>' + escapeHtml(t('uncoveredQty')) + '</th><th>' + escapeHtml(t('totalCost')) + '</th></tr></thead><tbody>';
      engine.byProduct.forEach(function (p) {
        html += '<tr><td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(p.productId))) + '</td><td>' + p.requestedQty + '</td><td>' + p.allocatedQty + '</td><td>' + p.uncoveredQty + '</td><td>' + Formatters.currency(p.totalCost) + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
    } else if (viewMode === 'supplier') {
      offers.forEach(function (off) {
        if (filterSupplier && off.supplierOrgId !== filterSupplier) return;
        const org = DataAPI.findOrg(off.supplierOrgId);
        let offerValue = 0;
        (off.items || []).forEach(function (it) {
          offerValue += net(it) * (Number(it.committedQty || it.availableQty) || 0);
        });
        html += '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(UI.orgLabel(org)) + '</h3><span>' + Formatters.currency(offerValue) + '</span></div><div class="pl-card-body pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('unitPrice')) + '</th><th>' + escapeHtml(t('discount')) + '</th><th>' + escapeHtml(t('netUnitPrice')) + '</th><th>' + escapeHtml(t('availableQuantity')) + '</th><th>' + escapeHtml(t('deliveryTime')) + '</th></tr></thead><tbody>';
        (off.items || []).forEach(function (it) {
          html += '<tr><td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId))) + '</td><td>' + Formatters.currency(it.unitPrice) + '</td><td>' + Formatters.percent(it.discountPct || 0) + '</td><td class="cell-best">' + Formatters.currency(net(it)) + '</td><td>' + (it.availableQty || 0) + '</td><td>' + (it.deliveryDays || '—') + ' ' + escapeHtml(t('days_unit')) + '</td></tr>';
        });
        html += '</tbody></table></div></div>';
      });
    } else {
      // by product
      (request.items || []).forEach(function (reqItem) {
        const product = DataAPI.findProduct(reqItem.productId);
        let rows = [];
        offers.forEach(function (off) {
          if (filterSupplier && off.supplierOrgId !== filterSupplier) return;
          (off.items || []).forEach(function (it) {
            if (it.productId !== reqItem.productId) return;
            rows.push({
              offer: off,
              item: it,
              supplierOrgId: off.supplierOrgId,
              net: net(it),
              discount: Number(it.discountPct) || 0,
              qty: Number(it.availableQty) || 0
            });
          });
        });
        if (sortBy === 'net') rows.sort(function (a, b) { return a.net - b.net; });
        if (sortBy === 'discount') rows.sort(function (a, b) { return b.discount - a.discount; });
        if (sortBy === 'qty') rows.sort(function (a, b) { return b.qty - a.qty; });

        const bestNet = rows.length ? rows[0].net : null;
        // find best among sorted by net for highlight regardless of current sort
        const byNet = rows.slice().sort(function (a, b) { return a.net - b.net; });
        const bestId = byNet[0] ? byNet[0].supplierOrgId + '-' + byNet[0].offer.id : null;

        html += '<div class="pl-card mb-3"><div class="pl-card-header"><div><h3 class="pl-card-title mb-0">' + escapeHtml(UI.productLabel(product)) + '</h3>' +
          '<div class="small text-muted">' + escapeHtml(t('requestedQty')) + ': ' + reqItem.qty + '</div></div></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
          '<th>' + escapeHtml(t('suppliers')) + '</th><th>' + escapeHtml(t('originalPrice')) + '</th><th>' + escapeHtml(t('discount')) + '</th><th>' + escapeHtml(t('netUnitPrice')) + '</th>' +
          '<th>' + escapeHtml(t('availableQuantity')) + '</th><th>' + escapeHtml(t('deliveryTime')) + '</th><th>' + escapeHtml(t('lineCost')) + '</th><th></th></tr></thead><tbody>';

        if (!rows.length) {
          html += '<tr><td colspan="8" class="text-muted text-center py-3">' + escapeHtml(t('noData')) + '</td></tr>';
        }
        rows.forEach(function (r) {
          const isBest = (r.supplierOrgId + '-' + r.offer.id) === bestId;
          const line = Math.round(r.net * Math.min(reqItem.qty, r.qty) * 100) / 100;
          html += '<tr class="' + (isBest ? 'row-best' : '') + '"><td>' + escapeHtml(UI.orgLabel(DataAPI.findOrg(r.supplierOrgId))) + '</td>' +
            '<td>' + Formatters.currency(r.item.unitPrice) + '</td><td>' + Formatters.percent(r.discount) + '</td>' +
            '<td class="' + (isBest ? 'cell-best' : '') + '">' + Formatters.currency(r.net) + '</td>' +
            '<td>' + r.qty + '</td><td>' + (r.item.deliveryDays || '—') + '</td><td>' + Formatters.currency(line) + '</td>' +
            '<td>' + (isBest ? '<span class="pl-badge badge-teal">' + escapeHtml(t('bestEligible')) + '</span>' : '') + '</td></tr>';
        });
        html += '</tbody></table></div></div>';
      });

      if (engine.excluded && engine.excluded.length) {
        html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('excluded')) + '</h3></div><div class="pl-card-body small">';
        engine.excluded.slice(0, 10).forEach(function (ex) {
          html += '<div class="mb-1">' + escapeHtml(UI.productLabel(DataAPI.findProduct(ex.productId))) + ' / ' +
            escapeHtml(UI.orgLabel(DataAPI.findOrg(ex.supplierOrgId))) + ' — ' + escapeHtml((ex.reasons || []).join(', ')) + '</div>';
        });
        html += '</div></div>';
      }
    }

    ctx.body.innerHTML = html;
    document.getElementById('viewTabs').addEventListener('click', function (e) {
      const btn = e.target.closest('[data-mode]');
      if (!btn) return;
      viewMode = btn.getAttribute('data-mode');
      render();
    });
    document.getElementById('sortBy').value = sortBy;
    document.getElementById('sortBy').addEventListener('change', function () { sortBy = this.value; render(); });
    document.getElementById('fltSup').addEventListener('change', function () { filterSupplier = this.value; render(); });
  }

  render();
})();
