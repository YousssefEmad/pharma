/**
 * PHARMA LINK — Application Shell (sidebar + header)
 */
window.Layout = (function () {
  function assetPrefix() {
    // pages live in /buyer, /supplier, /admin or root
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.indexOf('/buyer/') !== -1 || path.indexOf('/supplier/') !== -1 || path.indexOf('/admin/') !== -1) {
      return '..';
    }
    return '.';
  }

  function href(path) {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    const prefix = assetPrefix();
    // normalize: path like /buyer/dashboard.html
    if (prefix === '.') return path.replace(/^\//, '');
    // from /buyer/foo.html to /supplier/bar.html => ../supplier/bar.html
    return '..' + path;
  }

  function brandAsset(file) {
    return assetPrefix() + '/assets/brand/' + file;
  }

  function ensureFavicons() {
    if (document.querySelector('link[data-pl-favicon]')) return;
    const head = document.head;
    const links = [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: brandAsset('favicon-32.png') },
      { rel: 'icon', type: 'image/x-icon', href: brandAsset('favicon.ico') },
      { rel: 'apple-touch-icon', sizes: '180x180', href: brandAsset('apple-touch-icon.png') }
    ];
    links.forEach(function (spec) {
      const el = document.createElement('link');
      Object.keys(spec).forEach(function (k) { el.setAttribute(k, spec[k]); });
      el.setAttribute('data-pl-favicon', '1');
      head.appendChild(el);
    });
  }

  function logoMarkHtml(extraClass) {
    return '<img class="pl-logo-mark' + (extraClass ? ' ' + extraClass : '') +
      '" src="' + brandAsset('pharmalink-mark.png') +
      '" alt="PharmaLink" width="40" height="40" decoding="async" />';
  }

  function render(options) {
    const opts = options || {};
    const session = PermissionService.requireAuth(opts.area ? [opts.area] : null);
    if (!session) return null;

    StorageService.ensureInitialized();
    const lang = StorageService.getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    ensureFavicons();

    // Keep browser tab title aligned with active locale
    if (opts.title) {
      document.title = opts.title + ' | PharmaLink';
    }

    const root = document.getElementById('app');
    if (!root) return session;

    const collapsed = StorageService.getSidebarCollapsed();
    const nav = PermissionService.getNav(session.role);
    const unread = NotificationService.unreadCount(session.userId);
    const display = Auth.displayName(session);
    const org = Auth.orgName(session);

    root.innerHTML = '';
    root.className = 'pl-app' + (collapsed ? ' sidebar-collapsed' : '');

    // Remove legacy full-width demo banner if present from older builds
    document.querySelectorAll('.pl-proto-banner').forEach(function (el) { el.remove(); });
    document.body.style.paddingTop = '';

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'pl-sidebar-backdrop';
    backdrop.id = 'sidebarBackdrop';
    root.appendChild(backdrop);

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'pl-sidebar' + (collapsed ? ' collapsed' : '');
    sidebar.id = 'appSidebar';

    const brand = document.createElement('div');
    brand.className = 'pl-sidebar-brand';
    brand.innerHTML = '<div class="pl-logo-lockup">' + logoMarkHtml() +
      '<div class="pl-brand-text"><div class="pl-brand-name">' +
      escapeHtml(t('appName')) + '</div><div class="pl-brand-org" title="' + escapeHtml(org) + '">' +
      escapeHtml(org) + '</div></div></div>';
    sidebar.appendChild(brand);

    const navEl = document.createElement('nav');
    navEl.className = 'pl-sidebar-nav';
    const activeId = opts.active || '';

    nav.forEach(function (section) {
      const sec = document.createElement('div');
      sec.className = 'nav-section';
      const title = document.createElement('div');
      title.className = 'nav-section-title';
      title.textContent = t(section.section);
      sec.appendChild(title);
      section.items.forEach(function (item) {
        const a = document.createElement('a');
        a.className = 'pl-nav-link' + (item.id === activeId ? ' active' : '');
        a.href = href(item.href);
        a.innerHTML = '<i class="bi ' + item.icon + '"></i><span class="nav-label">' + escapeHtml(t(item.label)) + '</span>';
        sec.appendChild(a);
      });
      navEl.appendChild(sec);
    });
    sidebar.appendChild(navEl);
    root.appendChild(sidebar);

    // Main
    const main = document.createElement('div');
    main.className = 'pl-main';

    const header = document.createElement('header');
    header.className = 'pl-header no-print';

    const left = document.createElement('div');
    left.className = 'pl-header-left';
    left.innerHTML = '<button type="button" class="pl-icon-btn" id="btnToggleSidebar" title="' + escapeHtml(t('sidebarCollapse')) + '"><i class="bi bi-list"></i></button>' +
      '<a class="pl-header-brand" href="' + href(PermissionService.dashboardPath(session.role)) + '" aria-label="PharmaLink">' +
      logoMarkHtml() + '</a>' +
      '<span class="pl-demo-chip no-print" title="' + escapeHtml(t('demoNote')) + '"><i class="bi bi-beaker"></i> ' + escapeHtml(t('demoBadge')) + '</span>';
    header.appendChild(left);

    const center = document.createElement('div');
    center.className = 'pl-header-center';
    center.innerHTML = '<div class="pl-search"><i class="bi bi-search"></i><input type="search" id="globalSearch" placeholder="' + escapeHtml(t('globalSearch')) + '" /></div>';
    header.appendChild(center);

    const right = document.createElement('div');
    right.className = 'pl-header-right';

    // Language switch — pill with translate icon (shows destination locale)
    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.className = 'pl-lang-btn';
    langBtn.id = 'btnLang';
    langBtn.setAttribute('aria-label', t('changeLanguage'));
    langBtn.title = t('changeLanguage');
    const nextLangLabel = lang === 'ar' ? 'EN' : 'عربي';
    langBtn.innerHTML = '<i class="bi bi-translate" aria-hidden="true"></i><span class="pl-lang-code">' +
      nextLangLabel + '</span>';
    right.appendChild(langBtn);

    // Notif
    const notifWrap = document.createElement('div');
    notifWrap.className = 'dropdown';
    notifWrap.innerHTML = '<button type="button" class="pl-icon-btn position-relative" data-bs-toggle="dropdown" id="btnNotif"><i class="bi bi-bell"></i>' +
      (unread ? '<span class="pl-notif-dot"></span>' : '') + '</button>' +
      '<div class="dropdown-menu dropdown-menu-end p-0" style="width:320px;max-height:360px;overflow:auto">' +
      '<div class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"><strong>' + escapeHtml(t('notifications')) +
      '</strong><button type="button" class="btn btn-link btn-sm p-0" id="btnMarkAllRead">' + escapeHtml(t('markAllRead')) + '</button></div>' +
      '<div id="notifDropdownList"></div></div>';
    right.appendChild(notifWrap);

    // Help
    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'pl-icon-btn';
    helpBtn.id = 'btnHelp';
    helpBtn.innerHTML = '<i class="bi bi-question-circle"></i>';
    right.appendChild(helpBtn);

    // User
    const userDrop = document.createElement('div');
    userDrop.className = 'dropdown';
    const roleLabel = t('role_' + session.role);
    userDrop.innerHTML = '<button type="button" class="pl-user-chip" data-bs-toggle="dropdown">' +
      '<span class="pl-avatar">' + escapeHtml(UI.initials(display)) + '</span>' +
      '<span class="pl-user-meta"><span class="pl-user-name">' + escapeHtml(display) + '</span>' +
      '<span class="pl-user-role">' + escapeHtml(roleLabel) + '</span></span>' +
      '<i class="bi bi-chevron-down text-muted" style="font-size:0.75rem"></i></button>' +
      '<ul class="dropdown-menu dropdown-menu-end pl-user-menu">' +
      '<li class="px-3 py-2 small text-muted">' + escapeHtml(org) + '</li>' +
      '<li><hr class="dropdown-divider"></li>' +
      '<li><a class="dropdown-item" href="' + href('/demo-accounts.html') + '"><i class="bi bi-people me-2"></i>' + escapeHtml(t('switchAccount')) + '</a></li>' +
      '<li><a class="dropdown-item" href="' + href(PermissionService.dashboardPath(session.role).replace('dashboard.html', 'settings.html')) + '"><i class="bi bi-gear me-2"></i>' + escapeHtml(t('settings')) + '</a></li>' +
      '<li><hr class="dropdown-divider"></li>' +
      '<li><button type="button" class="dropdown-item text-danger pl-logout-item" id="btnLogout"><i class="bi bi-box-arrow-right me-2"></i>' + escapeHtml(t('logout')) + '</button></li>' +
      '</ul>';
    right.appendChild(userDrop);
    header.appendChild(right);
    main.appendChild(header);

    // Content host
    const content = document.createElement('div');
    content.className = 'pl-content';
    content.id = 'pageContent';

    // Page header slot
    if (opts.title) {
      const ph = document.createElement('div');
      ph.className = 'pl-page-header';
      const leftPh = document.createElement('div');
      if (opts.breadcrumb) {
        const bc = document.createElement('div');
        bc.className = 'pl-breadcrumb';
        opts.breadcrumb.forEach(function (b, i) {
          if (i) {
            const sep = document.createElement('span');
            sep.className = 'sep';
            sep.textContent = '›';
            bc.appendChild(sep);
          }
          if (b.href) {
            const a = document.createElement('a');
            a.href = href(b.href);
            a.textContent = b.label;
            bc.appendChild(a);
          } else {
            const span = document.createElement('span');
            span.textContent = b.label;
            bc.appendChild(span);
          }
        });
        leftPh.appendChild(bc);
      }
      const h1 = document.createElement('h1');
      h1.className = 'pl-page-title';
      h1.textContent = opts.title;
      leftPh.appendChild(h1);
      if (opts.description) {
        const desc = document.createElement('p');
        desc.className = 'pl-page-desc';
        desc.textContent = opts.description;
        leftPh.appendChild(desc);
      }
      ph.appendChild(leftPh);
      const actions = document.createElement('div');
      actions.className = 'pl-page-actions';
      actions.id = 'pageActions';
      ph.appendChild(actions);
      content.appendChild(ph);
    }

    const body = document.createElement('div');
    body.id = 'pageBody';
    content.appendChild(body);
    main.appendChild(content);
    root.appendChild(main);

    // Populate notifications dropdown
    const listEl = document.getElementById('notifDropdownList');
    const notifs = NotificationService.list(session.userId).slice(0, 8);
    if (!notifs.length) {
      listEl.innerHTML = '<div class="p-3 text-muted small">' + escapeHtml(t('noNotifications')) + '</div>';
    } else {
      notifs.forEach(function (n) {
        const item = document.createElement('div');
        item.className = 'pl-notif-item' + (n.read ? '' : ' unread');
        const title = lang === 'ar' ? n.titleAr : n.titleEn;
        item.innerHTML = '<div class="icon"><i class="bi bi-bell"></i></div><div><div class="fw-semibold small">' +
          escapeHtml(title) + '</div><div class="text-muted" style="font-size:0.75rem">' +
          escapeHtml(Formatters.relative(n.createdAt)) + '</div></div>';
        item.addEventListener('click', function () {
          NotificationService.markRead(n.id);
          if (n.link) window.location.href = href(n.link);
          else renderNotifRefresh();
        });
        listEl.appendChild(item);
      });
    }

    // Events
    document.getElementById('btnToggleSidebar').addEventListener('click', function () {
      // Match CSS drawer breakpoint (≤1199)
      if (window.innerWidth < 1200) {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('show');
      } else {
        const next = !StorageService.getSidebarCollapsed();
        StorageService.setSidebarCollapsed(next);
        sidebar.classList.toggle('collapsed', next);
        root.classList.toggle('sidebar-collapsed', next);
      }
    });
    backdrop.addEventListener('click', function () {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('show');
    });
    document.getElementById('btnLang').addEventListener('click', function () {
      const next = StorageService.getLang() === 'ar' ? 'en' : 'ar';
      setLang(next);
      window.location.reload();
    });
    document.getElementById('btnLogout').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      Auth.logout();
    });
    document.getElementById('btnMarkAllRead').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      NotificationService.markAllRead(session.userId);
      UI.toast(t('success'));
      window.location.reload();
    });
    document.getElementById('btnHelp').addEventListener('click', function () {
      UI.alert({
        title: t('help'),
        text: t('demoNote') + '\n\n' + t('deterministicNote'),
        icon: 'info'
      });
    });

    const search = document.getElementById('globalSearch');
    if (search) {
      search.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          const q = search.value.trim();
          if (!q) return;
          const area = PermissionService.getRolePerms(session.role).area;
          if (area === 'buyer') window.location.href = href('/buyer/products.html?q=' + encodeURIComponent(q));
          else if (area === 'supplier') window.location.href = href('/supplier/requests.html?q=' + encodeURIComponent(q));
          else window.location.href = href('/admin/organizations.html?q=' + encodeURIComponent(q));
        }
      });
    }

    return { session: session, body: body, actions: document.getElementById('pageActions'), href: href };
  }

  function renderNotifRefresh() {
    window.location.reload();
  }

  function pageCard(title, bodyHtml) {
    return '<div class="pl-card mb-3"><div class="pl-card-header"><h3 class="pl-card-title">' +
      escapeHtml(title) + '</h3></div><div class="pl-card-body">' + bodyHtml + '</div></div>';
  }

  return { render: render, href: href, assetPrefix: assetPrefix, pageCard: pageCard, ensureFavicons: ensureFavicons, brandAsset: brandAsset };
})();
