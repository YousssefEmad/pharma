/**
 * PHARMA LINK — Buyer Dashboard (redesigned composition)
 */
(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'dashboard',
    title: t('buyerDash'),
    description: t('tagline'),
    breadcrumb: [{ label: t('home') }]
  });
  if (!ctx) return;

  if (window.PharmaCharts) PharmaCharts.applyDefaults();

  const session = ctx.session;
  const wid = session.warehouseId;
  const inv = InventoryService.list(wid);
  const value = InventoryService.inventoryValue(wid);
  const low = inv.filter(function (r) { return r.available > 0 && r.available <= (r.minStock || 0); });
  const out = inv.filter(function (r) { return r.available <= 0; });
  const reqs = ProcurementService.requests({ buyerOrgId: session.orgId });
  const openReqs = reqs.filter(function (r) { return ['pending_offers', 'open', 'comparing', 'allocated'].indexOf(r.status) !== -1; });
  const pos = ProcurementService.purchaseOrders({ buyerOrgId: session.orgId });
  const pendingPO = pos.filter(function (p) { return ['pending_confirmation', 'confirmed', 'partially_delivered'].indexOf(p.status) !== -1; });
  const deliveries = pos.filter(function (p) { return ['confirmed', 'partially_delivered'].indexOf(p.status) !== -1; });
  let pendingOffers = 0;
  openReqs.forEach(function (r) {
    pendingOffers += ProcurementService.offersForRequest(r.id).filter(function (o) { return o.status === 'submitted'; }).length;
  });
  const monthlyPurchasing = pos.filter(function (p) {
    const d = new Date(p.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce(function (s, p) { return s + (p.grandTotal || 0); }, 0);
  const savings = (DataAPI.data().allocations || []).reduce(function (s, a) { return s + ((a.totals && a.totals.savings) || 0); }, 0);

  ctx.actions.innerHTML =
    '<a class="btn btn-pl-primary btn-sm" href="create-request.html"><i class="bi bi-plus-lg"></i> ' + escapeHtml(t('createRequest')) + '</a>' +
    '<a class="btn btn-pl-outline btn-sm" href="shortages.html">' + escapeHtml(t('shortages')) + '</a>' +
    '<a class="btn btn-pl-outline btn-sm" href="reports.html">' + escapeHtml(t('reports')) + '</a>';

  const display = Auth.displayName(session);
  const today = Formatters.date(new Date().toISOString());

  let html = '';
  html += '<div class="pl-welcome">' +
    '<div><h2 class="pl-welcome-title">' + escapeHtml(t('welcome') + (StorageService.getLang() === 'ar' ? '، ' : ', ') + display) + '</h2>' +
    '<p class="pl-welcome-sub">' + escapeHtml(Auth.orgName(session)) + ' · ' + escapeHtml(today) + '</p></div>' +
    '<div class="d-flex flex-wrap gap-2">' +
    '<a class="btn btn-pl-outline btn-sm" href="offer-comparison.html">' + escapeHtml(t('offerComparison')) + '</a>' +
    '<a class="btn btn-pl-accent btn-sm" href="allocation-review.html?id=PR-2024-012">' + escapeHtml(t('runAllocation')) + '</a>' +
    '</div></div>';

  // Primary KPIs (business pulse)
  const primary = [
    ['bi-cash-stack', 'teal', t('inventoryValue'), Formatters.currency(value), 'inventory.html'],
    ['bi-exclamation-triangle', 'amber', t('lowStock'), Formatters.number(low.length + out.length), 'shortages.html'],
    ['bi-cart-plus', 'blue', t('openRequests'), Formatters.number(openReqs.length), 'procurement-requests.html'],
    ['bi-piggy-bank', 'green', t('procurementSavings'), Formatters.currency(savings), 'allocation-review.html']
  ];
  html += '<div class="row g-3 mb-3">';
  primary.forEach(function (c) {
    html += '<div class="col-6 col-lg-3"><a href="' + c[4] + '" class="text-decoration-none text-reset">' +
      PharmaApp.statCard(c[0], c[1], c[2], c[3]) + '</a></div>';
  });
  html += '</div>';

  // Secondary compact metrics
  const secondary = [
    [t('totalProducts'), Formatters.number(inv.length), 'products.html'],
    [t('outOfStock'), Formatters.number(out.length), 'shortages.html'],
    [t('pendingOffers'), Formatters.number(pendingOffers), 'offer-comparison.html'],
    [t('pendingPOs'), Formatters.number(pendingPO.length), 'purchase-orders.html'],
    [t('expectedDeliveries'), Formatters.number(deliveries.length), 'deliveries.html'],
    [t('monthlyPurchasing'), Formatters.currency(monthlyPurchasing), 'purchases.html']
  ];
  html += '<div class="pl-card mb-3"><div class="pl-card-body py-2"><div class="row g-2 align-items-center">';
  secondary.forEach(function (s) {
    html += '<div class="col-6 col-md-4 col-xl-2"><a href="' + s[2] + '" class="text-decoration-none d-block px-1 py-2">' +
      '<div class="pl-metric-label">' + escapeHtml(s[0]) + '</div>' +
      '<div class="fw-bold text-primary-pl" style="font-size:1.05rem;font-variant-numeric:tabular-nums">' + s[1] + '</div></a></div>';
  });
  html += '</div></div></div>';

  // Charts — primary activity + distribution
  html += '<div class="row g-3 mb-3">';
  html += '<div class="col-lg-8"><div class="pl-card h-100"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('purchasingActivity')) + '</h3></div><div class="pl-card-body"><div class="pl-chart-box"><canvas id="chartPurchase"></canvas></div></div></div></div>';
  html += '<div class="col-lg-4"><div class="pl-card h-100"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('inventoryDistribution')) + '</h3></div><div class="pl-card-body"><div class="pl-chart-box"><canvas id="chartInv"></canvas></div></div></div></div>';
  html += '</div>';

  html += '<div class="row g-3 mb-3">';
  html += '<div class="col-lg-6"><div class="pl-card h-100"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('monthlySpending')) + '</h3></div><div class="pl-card-body"><div class="pl-chart-box sm"><canvas id="chartSpend"></canvas></div></div></div></div>';
  html += '<div class="col-lg-6"><div class="pl-card h-100"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('shortageTrends')) + '</h3></div><div class="pl-card-body"><div class="pl-chart-box sm"><canvas id="chartShort"></canvas></div></div></div></div>';
  html += '</div>';

  html += '<div class="row g-3">';
  html += '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('recentRequests')) + '</h3><a href="procurement-requests.html" class="small">' + escapeHtml(t('viewAll')) + '</a></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('requestNumber')) + '</th><th>' + escapeHtml(t('status')) + '</th><th>' + escapeHtml(t('date')) + '</th></tr></thead><tbody>';
  reqs.slice(0, 5).forEach(function (r) {
    html += '<tr class="cursor-pointer" data-href="request-details.html?id=' + r.id + '"><td class="pl-mono">' + escapeHtml(r.number) + '</td><td>' + Formatters.statusBadge(r.status) + '</td><td>' + Formatters.date(r.createdAt) + '</td></tr>';
  });
  html += '</tbody></table></div></div></div>';

  html += '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('productsAttention')) + '</h3><a href="shortages.html" class="small">' + escapeHtml(t('viewAll')) + '</a></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th class="num">' + escapeHtml(t('availableQty')) + '</th><th>' + escapeHtml(t('urgency')) + '</th></tr></thead><tbody>';
  inv.filter(function (r) { return r.urgency === 'critical' || r.urgency === 'high'; }).slice(0, 6).forEach(function (r) {
    html += '<tr><td>' + escapeHtml(UI.productLabel(r.product)) + '</td><td class="num">' + Formatters.number(r.available) + '</td><td>' + Formatters.urgencyBadge(r.urgency) + '</td></tr>';
  });
  html += '</tbody></table></div></div></div>';

  html += '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('recentActivity')) + '</h3></div><div class="pl-card-body"><ul class="pl-timeline">';
  (DataAPI.data().activity || []).slice(0, 6).forEach(function (a) {
    const txt = StorageService.getLang() === 'ar' ? a.textAr : a.textEn;
    html += '<li><div>' + escapeHtml(txt) + '</div><div class="time">' + Formatters.relative(a.at) + '</div></li>';
  });
  html += '</ul></div></div></div>';

  html += '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('upcomingDeliveries')) + '</h3><a href="deliveries.html" class="small">' + escapeHtml(t('viewAll')) + '</a></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('poNumber')) + '</th><th>' + escapeHtml(t('suppliers')) + '</th><th>' + escapeHtml(t('expectedDelivery')) + '</th></tr></thead><tbody>';
  deliveries.slice(0, 5).forEach(function (p) {
    html += '<tr class="cursor-pointer" data-href="purchase-orders.html?id=' + p.id + '"><td class="pl-mono">' + escapeHtml(p.number) + '</td><td>' + escapeHtml(UI.orgLabel(DataAPI.findOrg(p.supplierOrgId))) + '</td><td>' + Formatters.date(p.expectedDelivery) + '</td></tr>';
  });
  html += '</tbody></table></div></div></div>';
  html += '</div>';

  ctx.body.innerHTML = html;
  ctx.body.querySelectorAll('[data-href]').forEach(function (tr) {
    tr.addEventListener('click', function () { location.href = tr.getAttribute('data-href'); });
  });

  const months = ['Aug', 'Sep', 'Oct', 'Nov'];
  const c1 = (window.PharmaCharts && PharmaCharts.palette[1]) || '#2563eb';
  const c0 = (window.PharmaCharts && PharmaCharts.palette[0]) || '#0f766e';
  const c2 = (window.PharmaCharts && PharmaCharts.palette[2]) || '#d97706';
  const soft = window.PharmaCharts ? PharmaCharts.softFill(c1) : 'rgba(37,99,235,0.12)';

  new Chart(document.getElementById('chartPurchase'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: t('purchasingActivity'),
        data: [120000, 145000, 138000, monthlyPurchasing || 95000],
        borderColor: c1,
        backgroundColor: soft,
        fill: true,
        tension: 0.35
      }]
    },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, grid: { color: '#eef1f5' } }, x: { grid: { display: false } } } }
  });

  const catMap = {};
  inv.forEach(function (r) {
    const c = (r.product && r.product.category) || '—';
    catMap[c] = (catMap[c] || 0) + (r.onHand || 0);
  });
  const catLabels = Object.keys(catMap).slice(0, 6);
  new Chart(document.getElementById('chartInv'), {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{ data: catLabels.map(function (k) { return catMap[k]; }), backgroundColor: window.PharmaCharts ? PharmaCharts.colors(catLabels.length) : undefined, borderWidth: 0 }]
    },
    options: { maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom' } } }
  });

  new Chart(document.getElementById('chartSpend'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{ label: t('monthlySpending'), data: [98000, 110000, 125000, monthlyPurchasing || 88000], backgroundColor: c0 }]
    },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }
  });

  new Chart(document.getElementById('chartShort'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{ label: t('shortageTrends'), data: [8, 12, 9, low.length + out.length], backgroundColor: c2 }]
    },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }
  });
})();
