/**
 * PHARMA LINK — Role-based Permissions
 */
window.PermissionService = (function () {
  const R = PharmaConfig.roles;

  const NAV = {
    buyer: [
      { section: 'navOps', items: [
        { id: 'dashboard', icon: 'bi-speedometer2', label: 'dashboard', href: '/buyer/dashboard.html' }
      ]},
      { section: 'navWarehouse', items: [
        { id: 'products', icon: 'bi-capsule', label: 'products', href: '/buyer/products.html' },
        { id: 'inventory', icon: 'bi-box-seam', label: 'inventory', href: '/buyer/inventory.html' },
        { id: 'movements', icon: 'bi-arrow-left-right', label: 'movements', href: '/buyer/movements.html' },
        { id: 'expiration', icon: 'bi-calendar-x', label: 'expiration', href: '/buyer/expiration.html' },
        { id: 'stockAdjustment', icon: 'bi-sliders', label: 'stockAdjustment', href: '/buyer/stock-adjustment.html' },
        { id: 'stockTransfers', icon: 'bi-truck', label: 'stockTransfers', href: '/buyer/stock-transfers.html' },
        { id: 'inventoryCount', icon: 'bi-clipboard-check', label: 'inventoryCount', href: '/buyer/inventory-count.html' },
        { id: 'catalog', icon: 'bi-journal-medical', label: 'catalog', href: '/buyer/catalog.html' }
      ]},
      { section: 'navProcurement', items: [
        { id: 'shortages', icon: 'bi-exclamation-triangle', label: 'shortages', href: '/buyer/shortages.html' },
        { id: 'shortageImport', icon: 'bi-file-earmark-excel', label: 'shortageImport', href: '/buyer/shortage-import.html' },
        { id: 'procurementRequests', icon: 'bi-cart-plus', label: 'procurementRequests', href: '/buyer/procurement-requests.html' },
        { id: 'offerComparison', icon: 'bi-bar-chart-steps', label: 'offerComparison', href: '/buyer/offer-comparison.html' },
        { id: 'allocationReview', icon: 'bi-diagram-3', label: 'allocationReview', href: '/buyer/allocation-review.html' },
        { id: 'suppliers', icon: 'bi-building', label: 'suppliers', href: '/buyer/suppliers.html' },
        { id: 'purchaseOrders', icon: 'bi-receipt', label: 'purchaseOrders', href: '/buyer/purchase-orders.html' },
        { id: 'deliveries', icon: 'bi-box-arrow-in-down', label: 'deliveries', href: '/buyer/deliveries.html' }
      ]},
      { section: 'navCommercial', items: [
        { id: 'purchases', icon: 'bi-bag-check', label: 'purchases', href: '/buyer/purchases.html' },
        { id: 'sales', icon: 'bi-cash-coin', label: 'sales', href: '/buyer/sales.html' },
        { id: 'customers', icon: 'bi-people', label: 'customers', href: '/buyer/customers.html' },
        { id: 'finance', icon: 'bi-wallet2', label: 'finance', href: '/buyer/finance.html' }
      ]},
      { section: 'navSystem', items: [
        { id: 'reports', icon: 'bi-graph-up', label: 'reports', href: '/buyer/reports.html' },
        { id: 'notifications', icon: 'bi-bell', label: 'notifications', href: '/buyer/notifications.html' },
        { id: 'users', icon: 'bi-person-gear', label: 'users', href: '/buyer/users.html' },
        { id: 'subscriptions', icon: 'bi-credit-card', label: 'subscriptions', href: '/buyer/subscriptions.html' },
        { id: 'settings', icon: 'bi-gear', label: 'settings', href: '/buyer/settings.html' }
      ]}
    ],
    supplier: [
      { section: 'navOps', items: [
        { id: 'dashboard', icon: 'bi-speedometer2', label: 'dashboard', href: '/supplier/dashboard.html' }
      ]},
      { section: 'navOffers', items: [
        { id: 'requests', icon: 'bi-inbox', label: 'availableRequests', href: '/supplier/requests.html' },
        { id: 'offerHistory', icon: 'bi-clock-history', label: 'offerHistory', href: '/supplier/offer-history.html' },
        { id: 'purchaseOrders', icon: 'bi-receipt', label: 'purchaseOrders', href: '/supplier/purchase-orders.html' },
        { id: 'deliveries', icon: 'bi-truck', label: 'deliveries', href: '/supplier/deliveries.html' }
      ]},
      { section: 'navSystem', items: [
        { id: 'notifications', icon: 'bi-bell', label: 'notifications', href: '/supplier/notifications.html' },
        { id: 'settings', icon: 'bi-gear', label: 'settings', href: '/supplier/settings.html' }
      ]}
    ],
    admin: [
      { section: 'navAdmin', items: [
        { id: 'dashboard', icon: 'bi-speedometer2', label: 'dashboard', href: '/admin/dashboard.html' },
        { id: 'organizations', icon: 'bi-buildings', label: 'organizations', href: '/admin/organizations.html' },
        { id: 'verification', icon: 'bi-shield-check', label: 'verification', href: '/admin/verification.html' },
        { id: 'users', icon: 'bi-people', label: 'users', href: '/admin/users.html' },
        { id: 'catalog', icon: 'bi-journal-medical', label: 'catalog', href: '/admin/catalog.html' },
        { id: 'subscriptions', icon: 'bi-credit-card', label: 'subscriptions', href: '/admin/subscriptions.html' },
        { id: 'procurementSettings', icon: 'bi-clock', label: 'procurementSettings', href: '/admin/procurement-settings.html' },
        { id: 'auditLogs', icon: 'bi-list-check', label: 'auditLogs', href: '/admin/audit-logs.html' },
        { id: 'reports', icon: 'bi-graph-up', label: 'platformReports', href: '/admin/reports.html' },
        { id: 'settings', icon: 'bi-gear', label: 'settings', href: '/admin/settings.html' }
      ]}
    ]
  };

  const PERMS = {
    platform_admin: { area: 'admin', canApprove: true, canEdit: true, canManageCatalog: true, canManageOrgs: true, canResetData: true },
    buyer_owner: { area: 'buyer', canApprove: true, canEdit: true, canManageUsers: true, canExport: true },
    buyer_procurement: { area: 'buyer', canApprove: true, canEdit: true, canExport: true, hide: ['users', 'subscriptions', 'finance'] },
    warehouse_viewer: { area: 'buyer', canApprove: false, canEdit: false, canExport: true, hide: ['users', 'subscriptions', 'finance', 'stockAdjustment', 'inventoryCount', 'createRequest'] },
    supplier_owner: { area: 'supplier', canApprove: true, canEdit: true, canConfirmPO: true },
    supplier_sales: { area: 'supplier', canApprove: false, canEdit: true, canConfirmPO: false }
  };

  function getRolePerms(role) {
    return PERMS[role] || PERMS.warehouse_viewer;
  }

  function getNav(role) {
    const p = getRolePerms(role);
    const tree = NAV[p.area] || [];
    const hide = p.hide || [];
    return tree.map(function (sec) {
      return {
        section: sec.section,
        items: sec.items.filter(function (it) { return hide.indexOf(it.id) === -1; })
      };
    }).filter(function (sec) { return sec.items.length; });
  }

  function can(action, role) {
    const p = getRolePerms(role || (Auth.getSession() || {}).role);
    if (action === 'approve') return !!p.canApprove;
    if (action === 'edit') return !!p.canEdit;
    if (action === 'manageCatalog') return !!p.canManageCatalog;
    if (action === 'manageOrgs') return !!p.canManageOrgs;
    if (action === 'confirmPO') return !!p.canConfirmPO;
    if (action === 'resetData') return !!p.canResetData || p.area === 'buyer' || p.area === 'supplier' || p.area === 'admin';
    if (action === 'export') return p.canExport !== false;
    return true;
  }

  function dashboardPath(role) {
    const p = getRolePerms(role);
    if (p.area === 'admin') return '/admin/dashboard.html';
    if (p.area === 'supplier') return '/supplier/dashboard.html';
    return '/buyer/dashboard.html';
  }

  function loginPath() {
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    if (/\/(buyer|supplier|admin)\//.test(path)) return '../login.html';
    return 'login.html';
  }

  function requireAuth(allowedAreas) {
    const session = Auth.getSession();
    if (!session) {
      window.location.href = loginPath();
      return null;
    }
    const area = getRolePerms(session.role).area;
    if (allowedAreas && allowedAreas.indexOf(area) === -1) {
      const dash = dashboardPath(session.role);
      // Absolute app paths work under static root; fall back to relative when nested
      window.location.href = dash;
      return null;
    }
    return session;
  }

  return { getNav: getNav, can: can, getRolePerms: getRolePerms, dashboardPath: dashboardPath, requireAuth: requireAuth, loginPath: loginPath, NAV: NAV, PERMS: PERMS };
})();

window.Auth = (function () {
  function getSession() {
    return StorageService.getSession();
  }

  function loginAsUser(userId) {
    const data = StorageService.ensureInitialized();
    const user = data.users.find(function (u) { return u.id === userId; });
    if (!user) return false;
    const org = data.organizations.find(function (o) { return o.id === user.orgId; });
    const warehouse = data.warehouses.find(function (w) { return w.id === user.warehouseId; }) || null;
    const session = {
      userId: user.id,
      email: user.email,
      nameAr: user.nameAr,
      nameEn: user.nameEn,
      role: user.role,
      orgId: user.orgId,
      orgNameAr: org ? org.nameAr : '',
      orgNameEn: org ? org.nameEn : '',
      orgType: org ? org.type : '',
      warehouseId: user.warehouseId,
      warehouseNameAr: warehouse ? warehouse.nameAr : '',
      warehouseNameEn: warehouse ? warehouse.nameEn : '',
      loggedInAt: new Date().toISOString()
    };
    StorageService.setSession(session);
    return session;
  }

  function loginByEmail(email) {
    const data = StorageService.ensureInitialized();
    const user = data.users.find(function (u) { return u.email.toLowerCase() === String(email).toLowerCase(); });
    if (!user) return null;
    return loginAsUser(user.id);
  }

  function logout() {
    try { StorageService.clearSession(); } catch (e) {}
    // Prefer relative login so logout works from buyer/supplier/admin routes
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    const target = /\/(buyer|supplier|admin)\//.test(path) ? '../login.html' : 'login.html';
    window.location.replace(target);
  }

  function displayName(session) {
    if (!session) return '';
    return StorageService.getLang() === 'ar' ? session.nameAr : session.nameEn;
  }

  function orgName(session) {
    if (!session) return '';
    return StorageService.getLang() === 'ar' ? session.orgNameAr : session.orgNameEn;
  }

  return { getSession: getSession, loginAsUser: loginAsUser, loginByEmail: loginByEmail, logout: logout, displayName: displayName, orgName: orgName };
})();
