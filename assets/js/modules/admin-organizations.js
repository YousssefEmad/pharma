(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'organizations',
    title: t('organizations'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('organizations') }]
  });
  if (!ctx) return;
  
  const q = UI.qs('q')||'';
  let rows = DataAPI.data().organizations;
  if (q) rows = rows.filter(function(o){ return (o.nameAr+o.nameEn).toLowerCase().indexOf(q.toLowerCase())!==-1; });
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('name'))+'</th><th>'+escapeHtml(t('type'))+'</th><th>'+escapeHtml(t('city'))+'</th><th>'+escapeHtml(t('status'))+'</th><th></th></tr></thead><tbody>'+
    rows.map(function(o){ return '<tr><td>'+escapeHtml(UI.orgLabel(o))+'</td><td>'+escapeHtml(o.type)+'</td><td>'+escapeHtml(o.city||'')+'</td><td>'+Formatters.statusBadge(o.status)+'</td><td><button class="btn btn-sm btn-pl-outline btn-act" data-id="'+o.id+'" data-st="'+(o.status==='suspended'?'active':'suspended')+'">'+(o.status==='suspended'?escapeHtml(t('activate')):escapeHtml(t('suspendAccount')))+'</button></td></tr>'; }).join('')+
    '</tbody></table></div></div>';
  ctx.body.querySelectorAll('.btn-act').forEach(function(b){ b.onclick=function(){ DataAPI.save(function(d){ const o=d.organizations.find(function(x){return x.id===b.getAttribute('data-id');}); if(o) o.status=b.getAttribute('data-st'); d.auditLogs.unshift({id:'AUD-'+Date.now(),userId:ctx.session.userId,action:'status_change',target:o.id,at:new Date().toISOString(),detail:o.status}); return d; }); location.reload(); }; });

})();
