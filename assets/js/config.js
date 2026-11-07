/**
 * PHARMA LINK — Application Configuration
 */
window.PharmaConfig = {
  appName: 'PHARMA LINK',
  appNameAr: 'فارما لينك',
  version: '1.0.0',
  defaultLang: 'ar',
  defaultCurrency: 'EGP',
  storagePrefix: 'pharmalink_',
  storageKeys: {
    data: 'pharmalink_demo_data',
    session: 'pharmalink_session',
    lang: 'pharmalink_lang',
    sidebarCollapsed: 'pharmalink_sidebar_collapsed',
    initialized: 'pharmalink_initialized'
  },
  cdn: {
    bootstrapCss: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    bootstrapJs: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    bootstrapIcons: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    jquery: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    chartJs: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js',
    dataTablesCss: 'https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap5.min.css',
    dataTablesJs: 'https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js',
    dataTablesBs: 'https://cdn.datatables.net/1.13.8/js/dataTables.bootstrap5.min.js',
    sweetalert2Css: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.14.5/dist/sweetalert2.min.css',
    sweetalert2Js: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.14.5/dist/sweetalert2.all.min.js',
    select2Css: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css',
    select2Bs: 'https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css',
    select2Js: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js',
    flatpickrCss: 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css',
    flatpickrJs: 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js',
    flatpickrAr: 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/l10n/ar.js',
    xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    jspdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
    jspdfAutotable: 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js',
    cairoFont: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'
  },
  roles: {
    PLATFORM_ADMIN: 'platform_admin',
    BUYER_OWNER: 'buyer_owner',
    BUYER_PROCUREMENT: 'buyer_procurement',
    SUPPLIER_OWNER: 'supplier_owner',
    SUPPLIER_SALES: 'supplier_sales',
    WAREHOUSE_VIEWER: 'warehouse_viewer'
  },
  orgTypes: {
    PLATFORM: 'platform',
    BUYER: 'buyer',
    SUPPLIER: 'supplier'
  },
  paths: {
    login: '/login.html',
    demoAccounts: '/demo-accounts.html',
    buyerDashboard: '/buyer/dashboard.html',
    supplierDashboard: '/supplier/dashboard.html',
    adminDashboard: '/admin/dashboard.html'
  },
  procurementWindow: {
    startHour: 8,
    endHour: 9,
    workingDays: [0, 1, 2, 3, 4], // Sun-Thu (Egypt)
    label: '08:00 – 09:00'
  },
  demo: true,
  prototypeLabel: true
};
