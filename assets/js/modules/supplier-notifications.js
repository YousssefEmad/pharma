(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'notifications',
    title: t('notifications'),
    breadcrumb: [{ label: t('home'), href: '/supplier/dashboard.html' }, { label: t('notifications') }]
  });
  if (!ctx) return;
  
  const rows = NotificationService.list(ctx.session.userId);
  ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="all">'+escapeHtml(t('markAllRead'))+'</button>';
  document.getElementById('all').onclick = function(){ NotificationService.markAllRead(); location.reload(); };
  ctx.body.innerHTML = '<div class="pl-card"><div class="pl-card-body p-0">'+rows.map(function(n){
    const title = StorageService.getLang()==='ar'?n.titleAr:n.titleEn;
    const body = StorageService.getLang()==='ar'?n.bodyAr:n.bodyEn;
    return '<div class="pl-notif-item '+(n.read?'':'unread')+'" data-id="'+n.id+'"><div class="icon"><i class="bi bi-bell"></i></div><div><div class="fw-semibold">'+escapeHtml(title)+'</div><div class="small text-muted">'+escapeHtml(body)+'</div><div class="small text-muted">'+Formatters.relative(n.createdAt)+'</div></div></div>';
  }).join('')+'</div></div>';
  ctx.body.querySelectorAll('.pl-notif-item').forEach(function(el){ el.onclick=function(){ NotificationService.markRead(el.getAttribute('data-id')); el.classList.remove('unread'); }; });

})();
