(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'notifications',
    title: t('notificationCenter'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('notificationCenter') }]
  });
  if (!ctx) return;
  
  let type = '';
  const all = NotificationService.list(ctx.session.userId);
  ctx.actions.innerHTML = '<button class="btn btn-pl-outline btn-sm" id="all">' + escapeHtml(t('markAllRead')) + '</button>';
  document.getElementById('all').onclick = function(){ NotificationService.markAllRead(); location.reload(); };
  function paint(){
    const rows = all.filter(function(n){ return !type || n.type===type; });
    ctx.body.innerHTML = '<div class="pl-filters"><select class="form-select" id="tp"><option value="">' + escapeHtml(t('allTypes')) + '</option>' +
      Array.from(new Set(all.map(function(n){return n.type;}))).map(function(tp){ return '<option value="' + tp + '"' + (type===tp?' selected':'') + '>' + escapeHtml(tp) + '</option>'; }).join('') +
      '</select></div><div class="pl-card"><div class="pl-card-body p-0">' +
      (rows.length ? rows.map(function(n){ const title=StorageService.getLang()==='ar'?n.titleAr:n.titleEn; const body=StorageService.getLang()==='ar'?n.bodyAr:n.bodyEn; return '<div class="pl-notif-item ' + (n.read?'':'unread') + '" data-id="' + n.id + '"><div class="icon"><i class="bi bi-bell"></i></div><div><div class="fw-semibold">' + escapeHtml(title) + '</div><div class="small text-muted">' + escapeHtml(body) + '</div><div class="small text-muted">' + Formatters.relative(n.createdAt) + ' · ' + escapeHtml(n.type) + '</div></div></div>'; }).join('') : '<div class="pl-empty">' + escapeHtml(t('noNotifications')) + '</div>') +
      '</div></div>';
    document.getElementById('tp').onchange = function(){ type=this.value; paint(); };
    ctx.body.querySelectorAll('.pl-notif-item').forEach(function(el){ el.onclick=function(){ NotificationService.markRead(el.getAttribute('data-id')); paint(); }; });
  }
  paint();

})();
