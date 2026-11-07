(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'verification',
    title: t('verification'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('verification') }]
  });
  if (!ctx) return;
  
  const rows = DataAPI.data().organizations.filter(function(o){ return o.status==='pending_verification' || o.verified===false; });
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0"><table class="pl-table"><thead><tr><th>'+escapeHtml(t('name'))+'</th><th>'+escapeHtml(t('type'))+'</th><th>'+escapeHtml(t('city'))+'</th><th>'+escapeHtml(t('actions'))+'</th></tr></thead><tbody>'+
    rows.map(function(o){ return '<tr><td>'+escapeHtml(UI.orgLabel(o))+'</td><td>'+escapeHtml(o.type)+'</td><td>'+escapeHtml(o.city||'')+'</td><td><button class="btn btn-sm btn-pl-accent btn-ok" data-id="'+o.id+'">'+escapeHtml(t('approveVerification'))+'</button> <button class="btn btn-sm btn-outline-danger btn-no" data-id="'+o.id+'">'+escapeHtml(t('rejectVerification'))+'</button></td></tr>'; }).join('')+
    '</tbody></table></div></div>';
  function setStatus(id, status, verified){ DataAPI.save(function(d){ const o=d.organizations.find(function(x){return x.id===id;}); if(o){ o.status=status; o.verified=verified; } d.auditLogs.unshift({id:'AUD-'+Date.now(),userId:ctx.session.userId,action:verified?'approve_verification':'reject_verification',target:id,at:new Date().toISOString(),detail:status}); return d; }); location.reload(); }
  ctx.body.querySelectorAll('.btn-ok').forEach(function(b){ b.onclick=function(){ setStatus(b.getAttribute('data-id'),'active',true); }; });
  ctx.body.querySelectorAll('.btn-no').forEach(function(b){ b.onclick=function(){ setStatus(b.getAttribute('data-id'),'suspended',false); }; });

})();
