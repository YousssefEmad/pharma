(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'subscriptions',
    title: t('subscriptions'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('subscriptions') }]
  });
  if (!ctx) return;
  
  const sub = DataAPI.data().subscriptions.find(function(s){ return s.orgId===ctx.session.orgId; }) || DataAPI.data().subscriptions[0];
  const plans = DataAPI.data().plans;
  ctx.body.innerHTML = '<div class="pl-card mb-3"><div class="pl-card-body"><div class="small text-muted">' + escapeHtml(t('currentPlan')) + '</div><div class="fs-4 fw-bold">' + escapeHtml(sub?sub.plan:'—') + '</div><div>' + Formatters.statusBadge(sub&&sub.status) + ' · ' + escapeHtml(t('renewsOn')) + ' ' + Formatters.date(sub&&sub.renewsAt) + '</div><div class="small mt-2">' + escapeHtml(t('usersLimit')) + ': ' + (sub&&sub.usersLimit) + '</div></div></div>' +
    '<div class="row g-3">' + plans.map(function(p){ return '<div class="col-md-3"><div class="pl-card h-100"><div class="pl-card-body"><div class="fw-bold">' + escapeHtml(t(p.nameKey)) + '</div><div class="my-2 fs-5">' + (p.price==null ? escapeHtml(t('enterprisePlan')) : Formatters.currency(p.price) + ' ' + escapeHtml(t('perMonth'))) + '</div><button class="btn btn-pl-outline btn-sm w-100 btn-plan" data-plan="' + p.id + '">' + escapeHtml(t('upgradePlan')) + '</button></div></div></div>'; }).join('') + '</div>';
  ctx.body.querySelectorAll('.btn-plan').forEach(function(b){ b.onclick=async function(){ if(await UI.confirm({title:t('upgradePlan')})){ DataAPI.save(function(d){ const s=d.subscriptions.find(function(x){return x.orgId===ctx.session.orgId;}); if(s){ s.plan=b.getAttribute('data-plan').replace('plan_',''); s.price= (d.plans.find(function(p){return p.id===b.getAttribute('data-plan');})||{}).price||0; } return d; }); UI.toast(t('planChanged')); location.reload(); } }; });

})();
