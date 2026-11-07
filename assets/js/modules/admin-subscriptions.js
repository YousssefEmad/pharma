(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'subscriptions',
    title: t('subscriptions'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('subscriptions') }]
  });
  if (!ctx) return;
  
  const d = DataAPI.data();
  ctx.body.innerHTML = '<div class="row g-3 mb-3">'+d.plans.map(function(p){ return '<div class="col-md-3"><div class="pl-card h-100"><div class="pl-card-body"><div class="fw-bold">'+escapeHtml(t(p.nameKey))+'</div><div class="fs-4 my-2">'+(p.price==null?escapeHtml(t('enterprisePlan')):Formatters.currency(p.price)+' '+escapeHtml(t('perMonth')))+'</div><div class="small text-muted">'+escapeHtml(t('usersLimit'))+': '+p.usersLimit+'</div></div></div></div>'; }).join('')+'</div>'+
    '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">'+escapeHtml(t('subscriptionHistory'))+'</h3></div><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('organization'))+'</th><th>'+escapeHtml(t('currentPlan'))+'</th><th>'+escapeHtml(t('status'))+'</th><th>'+escapeHtml(t('renewalDate'))+'</th><th></th></tr></thead><tbody>'+
    d.subscriptions.map(function(s){ return '<tr><td>'+escapeHtml(UI.orgLabel(DataAPI.findOrg(s.orgId)))+'</td><td>'+escapeHtml(s.plan)+'</td><td>'+Formatters.statusBadge(s.status)+'</td><td>'+Formatters.date(s.renewsAt)+'</td><td><button class="btn btn-sm btn-pl-outline btn-up" data-id="'+s.id+'">'+escapeHtml(t('activateSubscription'))+'</button></td></tr>'; }).join('')+
    '</tbody></table></div></div>';
  ctx.body.querySelectorAll('.btn-up').forEach(function(b){ b.onclick=function(){ DataAPI.save(function(d){ const s=d.subscriptions.find(function(x){return x.id===b.getAttribute('data-id');}); if(s) s.status='active'; return d; }); UI.toast(t('success')); }; });

})();
