(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'suppliers',
    title: t('suppliers'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('suppliers') }]
  });
  if (!ctx) return;
  
  const rels = DataAPI.data().supplierRelations.filter(function(r){ return r.buyerOrgId===ctx.session.orgId; });
  let html = '<div class="pl-card"><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('name'))+'</th><th>'+escapeHtml(t('status'))+'</th><th>'+escapeHtml(t('responseRate'))+'</th><th>'+escapeHtml(t('onTimeRate'))+'</th><th>'+escapeHtml(t('rating'))+'</th><th>'+escapeHtml(t('actions'))+'</th></tr></thead><tbody>';
  rels.forEach(function(rel){
    const o = DataAPI.findOrg(rel.supplierOrgId);
    html += '<tr><td>'+escapeHtml(UI.orgLabel(o))+(rel.preferred?' <span class="pl-badge badge-teal">'+escapeHtml(t('preferred'))+'</span>':'')+(rel.blocked?' <span class="pl-badge badge-danger">'+escapeHtml(t('blocked'))+'</span>':'')+'</td>'+
      '<td>'+Formatters.statusBadge(o&&o.verified?'verified':'unverified')+'</td><td>'+Formatters.percent(o&&o.responseRate||0)+'</td><td>'+Formatters.percent(o&&o.onTimeRate||0)+'</td><td>'+(o&&o.rating||'—')+'</td>'+
      '<td><a class="btn btn-sm btn-pl-outline" href="supplier-details.html?id='+rel.supplierOrgId+'">'+escapeHtml(t('view'))+'</a> '+
      '<button class="btn btn-sm btn-pl-ghost btn-pref" data-id="'+rel.id+'">★</button> <button class="btn btn-sm btn-pl-ghost btn-block" data-id="'+rel.id+'">⊘</button></td></tr>';
  });
  html += '</tbody></table></div></div>';
  ctx.body.innerHTML = html;
  ctx.body.querySelectorAll('.btn-pref').forEach(function(b){ b.onclick=function(){ DataAPI.save(function(d){ const r=d.supplierRelations.find(function(x){return x.id===b.getAttribute('data-id');}); if(r) r.preferred=!r.preferred; return d; }); location.reload(); }; });
  ctx.body.querySelectorAll('.btn-block').forEach(function(b){ b.onclick=function(){ DataAPI.save(function(d){ const r=d.supplierRelations.find(function(x){return x.id===b.getAttribute('data-id');}); if(r) r.blocked=!r.blocked; return d; }); location.reload(); }; });

})();
