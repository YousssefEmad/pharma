(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'finance',
    title: t('finance'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('finance') }]
  });
  if (!ctx) return;
  
  const fin = DataAPI.data().finance;
  ctx.body.innerHTML = '<div class="alert alert-warning small"><span class="pl-badge badge-demo">' + escapeHtml(t('simBadge')) + '</span> ' + escapeHtml(t('financialSimNote')) + '</div>' +
    '<div class="row g-3 mb-3"><div class="col-md-4">' + PharmaApp.statCard('bi-arrow-up-circle','red',t('payables'), Formatters.currency(fin.payables.reduce(function(s,p){return s+p.balance;},0))) + '</div>' +
    '<div class="col-md-4">' + PharmaApp.statCard('bi-arrow-down-circle','green',t('receivables'), Formatters.currency(fin.receivables.reduce(function(s,p){return s+p.balance;},0))) + '</div>' +
    '<div class="col-md-4">' + PharmaApp.statCard('bi-graph-up','teal',t('profitLoss'), Formatters.currency(fin.monthlyPnL.slice(-1)[0].profit)) + '</div></div>' +
    '<div class="row g-3"><div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('profitLoss')) + '</h3></div><div class="pl-card-body"><canvas id="pnl" height="200"></canvas></div></div></div>' +
    '<div class="col-lg-6"><div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('expenses')) + '</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('date')) + '</th><th>' + escapeHtml(t('category')) + '</th><th>' + escapeHtml(t('total')) + '</th></tr></thead><tbody>' +
    fin.expenses.map(function(e){ return '<tr><td>' + Formatters.date(e.date) + '</td><td>' + escapeHtml(e.category) + '</td><td>' + Formatters.currency(e.amount) + '</td></tr>'; }).join('') +
    '</tbody></table></div></div></div></div>';
  new Chart(document.getElementById('pnl'), { type:'bar', data:{ labels: fin.monthlyPnL.map(function(m){return m.month;}), datasets:[{ label:t('profitLoss'), data: fin.monthlyPnL.map(function(m){return m.profit;}), backgroundColor:'#0d9488' }] }, options:{ plugins:{legend:{display:false}} } });

})();
