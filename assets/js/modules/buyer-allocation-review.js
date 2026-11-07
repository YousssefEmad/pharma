/**
 * PHARMA LINK — Smart Allocation Review (deterministic engine demo)
 */
(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'allocationReview',
    title: t('allocationReview'),
    description: t('deterministicNote'),
    breadcrumb: [
      { label: t('home'), href: '/buyer/dashboard.html' },
      { label: t('procurement'), href: '/buyer/procurement-requests.html' },
      { label: t('allocationReview') }
    ]
  });
  if (!ctx) return;

  if (!PermissionService.can('approve')) {
    ctx.body.innerHTML = '<div class="alert alert-warning">' + escapeHtml(t('viewerCannotApprove')) + '</div>';
    return;
  }

  const data = DataAPI.data();
  let requestId = UI.qs('id') || 'PR-2024-012';
  let request = ProcurementService.getRequest(requestId);
  if (!request) {
    request = ProcurementService.requests()[0];
    requestId = request && request.id;
  }
  if (!request) {
    UI.emptyState(ctx.body, t('noData'));
    return;
  }

  let policies = Object.assign({}, data.allocationPolicies);
  let result = null;
  let editableLines = [];

  ctx.actions.innerHTML =
    '<select class="form-select form-select-sm" id="reqSelect" style="width:auto;min-width:180px"></select>' +
    '<button type="button" class="btn btn-pl-accent btn-sm" id="btnRun"><i class="bi bi-cpu"></i> ' + escapeHtml(t('runAllocation')) + '</button>' +
    '<button type="button" class="btn btn-pl-primary btn-sm" id="btnApprove"><i class="bi bi-check2-circle"></i> ' + escapeHtml(t('approveAllocation')) + '</button>' +
    '<button type="button" class="btn btn-outline-danger btn-sm" id="btnReject">' + escapeHtml(t('reject')) + '</button>';

  const sel = document.getElementById('reqSelect');
  ProcurementService.requests().forEach(function (r) {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.number + ' (' + r.status + ')';
    if (r.id === requestId) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', function () {
    location.href = 'allocation-review.html?id=' + encodeURIComponent(sel.value);
  });

  function render() {
    const offers = ProcurementService.offersForRequest(request.id);
    result = AllocationService.allocate(request, offers, policies);
    editableLines = result.lines.map(function (l) { return Object.assign({}, l); });
    paint();
  }

  function paint() {
    const view = AllocationService.recalculateFromLines(request, editableLines);
    // keep savings from engine result when lines unchanged length-wise
    if (result && result.totals) view.totals.savings = result.totals.savings;

    let html = '';
    html += '<div class="row g-3 mb-3">';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-cash-stack', 'teal', t('totalCost'), Formatters.currency(view.totals.totalCost)) + '</div>';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-piggy-bank', 'green', t('estimatedSavings'), Formatters.currency(view.totals.savings || 0)) + '</div>';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-percent', 'blue', t('fulfillment'), Formatters.percent(view.totals.fulfillmentPct)) + '</div>';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-box', 'amber', t('uncoveredQty'), Formatters.number(view.byProduct.reduce(function (s, p) { return s + (p.uncoveredQty || 0); }, 0))) + '</div>';
    html += '</div>';

    html += '<div class="row g-3 mb-3"><div class="col-lg-8">';
    html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('proposedAllocation')) + ' — ' + escapeHtml(request.number) + '</h3>';
    html += '<span class="pl-badge badge-demo">' + escapeHtml(t('simulated')) + '</span></div><div class="pl-card-body pl-table-wrap">';
    html += '<table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('suppliers')) + '</th><th>' + escapeHtml(t('netUnitPrice')) + '</th><th>' + escapeHtml(t('allocatedQty')) + '</th><th>' + escapeHtml(t('lineCost')) + '</th><th></th></tr></thead><tbody>';
    editableLines.forEach(function (l, idx) {
      const p = DataAPI.findProduct(l.productId);
      const s = DataAPI.findOrg(l.supplierOrgId);
      html += '<tr>' +
        '<td>' + escapeHtml(UI.productLabel(p)) + '</td>' +
        '<td>' + escapeHtml(UI.orgLabel(s)) + (l.best ? ' <span class="pl-badge badge-teal">' + escapeHtml(t('bestOffer')) + '</span>' : '') + '</td>' +
        '<td>' + Formatters.currency(l.netUnitPrice) + '</td>' +
        '<td><input type="number" min="0" class="form-control form-control-sm alloc-qty" data-idx="' + idx + '" value="' + l.qty + '" style="width:90px" /></td>' +
        '<td>' + Formatters.currency(l.lineCost) + '</td>' +
        '<td><button type="button" class="btn btn-sm btn-pl-ghost btn-rm" data-idx="' + idx + '"><i class="bi bi-x"></i></button></td></tr>';
    });
    html += '</tbody></table></div></div>';

    // Uncovered
    const uncovered = view.byProduct.filter(function (p) { return p.uncoveredQty > 0; });
    if (uncovered.length) {
      html += '<div class="alert alert-warning mt-3"><strong>' + escapeHtml(t('uncoveredQty')) + ':</strong> ';
      html += uncovered.map(function (u) {
        return escapeHtml(UI.productLabel(DataAPI.findProduct(u.productId))) + ' (' + u.uncoveredQty + ')';
      }).join('، ');
      html += '</div>';
    }

    if (result && result.warnings && result.warnings.length) {
      html += '<div class="alert alert-info mt-2"><strong>' + escapeHtml(t('warnings')) + '</strong><ul class="mb-0 mt-1">';
      result.warnings.forEach(function (w) {
        html += '<li>' + escapeHtml(w.type) + (w.productId ? ' — ' + escapeHtml(UI.productLabel(DataAPI.findProduct(w.productId))) : '') + '</li>';
      });
      html += '</ul></div>';
    }

    html += '</div><div class="col-lg-4">';
    html += '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('policies')) + '</h3></div><div class="pl-card-body">';
    html += field('maxSuppliersPerProduct', policies.maxSuppliersPerProduct);
    html += field('maxPriceDiffPct', policies.maxPriceDiffPct);
    html += field('minFulfillmentPct', policies.minFulfillmentPct);
    html += field('maxConcentrationPct', policies.maxConcentrationPct);
    html += '<div class="form-check mb-2"><input class="form-check-input" type="checkbox" id="allowPartial"' + (policies.allowPartial ? ' checked' : '') + '><label class="form-check-label" for="allowPartial">' + escapeHtml(t('allowPartial')) + '</label></div>';
    html += '<button type="button" class="btn btn-pl-outline btn-sm w-100" id="btnApplyPol">' + escapeHtml(t('recalculate')) + '</button>';
    html += '</div></div>';

    html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('supplierDistribution')) + '</h3></div><div class="pl-card-body">';
    const dist = view.supplierDistribution || {};
    Object.keys(dist).forEach(function (sid) {
      const org = DataAPI.findOrg(sid);
      const pct = view.totals.totalCost ? Math.round((dist[sid].cost / view.totals.totalCost) * 100) : 0;
      html += '<div class="mb-2"><div class="d-flex justify-content-between small"><span>' + escapeHtml(UI.orgLabel(org)) + '</span><span>' + Formatters.currency(dist[sid].cost) + '</span></div>';
      html += '<div class="pl-progress"><span style="width:' + pct + '%"></span></div></div>';
    });
    html += '<canvas id="distChart" height="160" class="mt-3"></canvas>';
    html += '</div></div></div></div>';

    // Example note for classic case
    if (request.id === 'PR-2024-012') {
      html += '<div class="pl-card"><div class="pl-card-body small text-muted">' +
        '<strong>' + escapeHtml(t('allocationEngine')) + ':</strong> ' +
        'Requested 100 → Supplier C (75 EGP × 20) + A (80 × 60) + B (83 × 20) = <strong>7,960 EGP</strong>' +
        '</div></div>';
    }

    ctx.body.innerHTML = html;

    // chart
    const labels = Object.keys(dist).map(function (sid) { return UI.orgLabel(DataAPI.findOrg(sid)); });
    const values = Object.keys(dist).map(function (sid) { return dist[sid].cost; });
    if (labels.length && window.Chart) {
      new Chart(document.getElementById('distChart'), {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: values, backgroundColor: ['#0d9488', '#1e4e8c', '#d97706', '#0284c7', '#64748b'] }] },
        options: { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: true }
      });
    }

    ctx.body.querySelectorAll('.alloc-qty').forEach(function (inp) {
      inp.addEventListener('change', function () {
        const i = Number(inp.getAttribute('data-idx'));
        editableLines[i].qty = Math.max(0, Number(inp.value) || 0);
        paint();
      });
    });
    ctx.body.querySelectorAll('.btn-rm').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const i = Number(btn.getAttribute('data-idx'));
        editableLines.splice(i, 1);
        paint();
      });
    });
    const ap = document.getElementById('btnApplyPol');
    if (ap) ap.addEventListener('click', function () {
      policies.maxSuppliersPerProduct = Number(document.getElementById('pol_maxSuppliersPerProduct').value) || 5;
      policies.maxPriceDiffPct = Number(document.getElementById('pol_maxPriceDiffPct').value) || 25;
      policies.minFulfillmentPct = Number(document.getElementById('pol_minFulfillmentPct').value) || 0;
      policies.maxConcentrationPct = Number(document.getElementById('pol_maxConcentrationPct').value) || 100;
      policies.allowPartial = document.getElementById('allowPartial').checked;
      render();
      UI.toast(t('recalculate'));
    });
  }

  function field(key, val) {
    const labelMap = {
      maxSuppliersPerProduct: 'maxSuppliersPerProduct',
      maxPriceDiffPct: 'maxPriceDiff',
      minFulfillmentPct: 'minFulfillment',
      maxConcentrationPct: 'maxConcentration'
    };
    const labelKey = labelMap[key] || key;
    const label = t(labelKey) !== labelKey ? t(labelKey) : key;
    return '<div class="mb-2"><label class="form-label">' + escapeHtml(label) + '</label>' +
      '<input type="number" class="form-control form-control-sm" id="pol_' + key + '" value="' + val + '" /></div>';
  }

  document.getElementById('btnRun').addEventListener('click', function () {
    render();
    UI.toast(t('success'));
  });

  document.getElementById('btnApprove').addEventListener('click', async function () {
    const ok = await UI.confirm({ title: t('approveAllocation'), text: t('confirmAction') });
    if (!ok) return;
    const final = AllocationService.recalculateFromLines(request, editableLines);
    final.policies = policies;
    final.warnings = (result && result.warnings) || [];
    final.totals.savings = (result && result.totals && result.totals.savings) || 0;
    const alcId = AllocationService.saveAllocation(final, 'approved');
    const alc = DataAPI.data().allocations.find(function (a) { return a.id === alcId; }) || final;
    alc.id = alcId;
    const gen = ProcurementService.generatePOsFromAllocation(alc);
    let msg = t('poGenerated') + ': ' + gen.created.map(function (p) { return p.number; }).join(', ');
    if (gen.skipped.length) msg += ' — ' + t('duplicatePOPrevented') + ': ' + gen.skipped.join(', ');
    UI.alert({ title: t('allocationApproved'), text: msg, icon: 'success' }).then(function () {
      location.href = 'purchase-orders.html';
    });
  });

  document.getElementById('btnReject').addEventListener('click', async function () {
    const ok = await UI.confirm({ title: t('reject'), icon: 'warning' });
    if (!ok) return;
    AllocationService.saveAllocation(AllocationService.recalculateFromLines(request, editableLines), 'rejected');
    DataAPI.save(function (d) {
      const r = d.requests.find(function (x) { return x.id === request.id; });
      if (r) r.status = 'comparing';
      return d;
    });
    UI.toast(t('allocationRejected'), 'info');
  });

  render();
})();
