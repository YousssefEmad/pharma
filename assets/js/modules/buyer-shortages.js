/**
 * PHARMA LINK — Shortage Management
 */
(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'shortages',
    title: t('shortages'),
    description: t('shortageList'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('shortages') }]
  });
  if (!ctx) return;

  let tab = UI.qs('tab') || 'auto';
  const session = ctx.session;

  ctx.actions.innerHTML =
    '<a class="btn btn-pl-outline btn-sm" href="shortage-import.html"><i class="bi bi-file-earmark-excel"></i> ' + escapeHtml(t('excelImport')) + '</a>' +
    '<button type="button" class="btn btn-pl-primary btn-sm" id="btnCreatePR"><i class="bi bi-cart-plus"></i> ' + escapeHtml(t('createProcurementRequest')) + '</button>';

  function render() {
    let html = '<div class="pl-pill-tabs mb-3" id="tabs">';
    [['auto', t('autoDetection')], ['manual', t('manualEntry')], ['list', t('shortageList')]].forEach(function (x) {
      html += '<button type="button" data-tab="' + x[0] + '" class="' + (tab === x[0] ? 'active' : '') + '">' + escapeHtml(x[1]) + '</button>';
    });
    html += '</div><div id="tabBody"></div>';
    ctx.body.innerHTML = html;
    document.getElementById('tabs').addEventListener('click', function (e) {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      tab = b.getAttribute('data-tab');
      UI.setQs({ tab: tab });
      render();
    });
    const body = document.getElementById('tabBody');
    if (tab === 'auto') renderAuto(body);
    else if (tab === 'manual') renderManual(body);
    else renderList(body);
  }

  function renderAuto(el) {
    const rows = InventoryService.detectShortages(session.warehouseId);
    let html = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('autoDetection')) + ' (' + rows.length + ')</h3>' +
      '<button type="button" class="btn btn-pl-accent btn-sm" id="btnAddSelected">' + escapeHtml(t('addToShortage')) + '</button></div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th><input type="checkbox" id="chkAll" /></th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('availableQty')) + '</th>' +
      '<th>' + escapeHtml(t('reorderPoint')) + '</th><th>' + escapeHtml(t('avgDailyUsage')) + '</th><th>' + escapeHtml(t('suggestedQty')) + '</th>' +
      '<th>' + escapeHtml(t('urgency')) + '</th><th>' + escapeHtml(t('lastPurchase')) + '</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td><input type="checkbox" class="chk" data-pid="' + r.productId + '" data-qty="' + r.suggestedQty + '" data-urg="' + r.urgency + '" /></td>' +
        '<td>' + escapeHtml(UI.productLabel(r.product)) + '</td><td>' + Formatters.number(r.available) + '</td><td>' + Formatters.number(r.reorderPoint, 1) + '</td>' +
        '<td>' + Formatters.number(r.avgDailyUsage, 1) + '</td>' +
        '<td><input type="number" class="form-control form-control-sm sug-qty" data-pid="' + r.productId + '" value="' + r.suggestedQty + '" style="width:90px" /></td>' +
        '<td>' + Formatters.urgencyBadge(r.urgency) + '</td><td>' + Formatters.date(r.lastPurchaseDate) + '</td></tr>';
    });
    if (!rows.length) html += '<tr><td colspan="8"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;
    document.getElementById('chkAll').addEventListener('change', function () {
      el.querySelectorAll('.chk').forEach(function (c) { c.checked = document.getElementById('chkAll').checked; });
    });
    document.getElementById('btnAddSelected').addEventListener('click', function () {
      const items = [];
      el.querySelectorAll('.chk:checked').forEach(function (c) {
        const pid = c.getAttribute('data-pid');
        const qtyInp = el.querySelector('.sug-qty[data-pid="' + pid + '"]');
        items.push({
          productId: pid,
          requestedQty: Number(qtyInp && qtyInp.value) || Number(c.getAttribute('data-qty')),
          source: 'auto',
          urgency: c.getAttribute('data-urg')
        });
      });
      if (!items.length) { UI.toast(t('selectProduct'), 'warning'); return; }
      ShortageService.addMany(items);
      UI.toast(t('added'));
      tab = 'list';
      render();
    });
  }

  function renderManual(el) {
    el.innerHTML = '<div class="pl-card"><div class="pl-card-body"><div class="row g-2 align-items-end">' +
      '<div class="col-md-5"><label class="form-label">' + escapeHtml(t('productName')) + '</label><select class="form-select" id="manProduct"></select></div>' +
      '<div class="col-md-2"><label class="form-label">' + escapeHtml(t('quantity')) + '</label><input type="number" class="form-control" id="manQty" value="10" min="1" /></div>' +
      '<div class="col-md-3"><label class="form-label">' + escapeHtml(t('notes')) + '</label><input class="form-control" id="manNotes" /></div>' +
      '<div class="col-md-2"><button type="button" class="btn btn-pl-primary w-100" id="btnManAdd">' + escapeHtml(t('add')) + '</button></div></div>' +
      '<div class="mt-3" id="manLines"></div></div></div>';
    const sel = document.getElementById('manProduct');
    ProductService.list().forEach(function (p) {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = UI.productLabel(p);
      sel.appendChild(o);
    });
    if (window.jQuery && $.fn.select2) $(sel).select2({ theme: 'bootstrap-5', width: '100%' });
    const draft = [];
    function paintLines() {
      const box = document.getElementById('manLines');
      if (!draft.length) { box.innerHTML = '<div class="text-muted small">' + escapeHtml(t('emptyDesc')) + '</div>'; return; }
      let h = '<table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('quantity')) + '</th><th></th></tr></thead><tbody>';
      draft.forEach(function (d, i) {
        h += '<tr><td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(d.productId))) + '</td><td>' + d.requestedQty + '</td>' +
          '<td><button type="button" class="btn btn-sm btn-pl-ghost" data-i="' + i + '"><i class="bi bi-trash"></i></button></td></tr>';
      });
      h += '</tbody></table><button type="button" class="btn btn-pl-accent mt-2" id="btnSaveDraft">' + escapeHtml(t('saveShortageList')) + '</button>';
      box.innerHTML = h;
      box.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () { draft.splice(Number(b.getAttribute('data-i')), 1); paintLines(); });
      });
      document.getElementById('btnSaveDraft').addEventListener('click', function () {
        ShortageService.addMany(draft.map(function (d) { return Object.assign({ source: 'manual', urgency: 'medium' }, d); }));
        UI.toast(t('savedAsDraft'));
        tab = 'list';
        render();
      });
    }
    document.getElementById('btnManAdd').addEventListener('click', function () {
      draft.push({ productId: sel.value, requestedQty: Number(document.getElementById('manQty').value) || 1, notes: document.getElementById('manNotes').value });
      paintLines();
    });
    paintLines();
  }

  function renderList(el) {
    const rows = ShortageService.list(session.warehouseId);
    let html = '<div class="pl-card"><div class="pl-card-header flex-wrap gap-2"><h3 class="pl-card-title">' + escapeHtml(t('shortageList')) + '</h3><div class="d-flex gap-2">' +
      '<button type="button" class="btn btn-sm btn-pl-outline" id="btnMerge">' + escapeHtml(t('mergeDuplicates')) + '</button>' +
      '<button type="button" class="btn btn-sm btn-pl-primary" id="btnConvert">' + escapeHtml(t('convertToRequest')) + '</button></div></div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th><input type="checkbox" id="chkAllL" /></th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('quantity')) + '</th><th>' + escapeHtml(t('urgency')) + '</th><th>' + escapeHtml(t('type')) + '</th><th>' + escapeHtml(t('actions')) + '</th></tr></thead><tbody>';
    rows.forEach(function (s) {
      html += '<tr><td><input type="checkbox" class="chkL" value="' + s.id + '" checked /></td><td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(s.productId))) + '</td>' +
        '<td><input type="number" class="form-control form-control-sm qty-edit" data-id="' + s.id + '" value="' + s.requestedQty + '" style="width:90px" /></td>' +
        '<td>' + Formatters.urgencyBadge(s.urgency) + '</td><td>' + escapeHtml(s.source) + '</td>' +
        '<td><button type="button" class="btn btn-sm btn-pl-ghost btn-del" data-id="' + s.id + '"><i class="bi bi-trash"></i></button></td></tr>';
    });
    if (!rows.length) html += '<tr><td colspan="6"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;
    el.querySelectorAll('.qty-edit').forEach(function (inp) {
      inp.addEventListener('change', function () {
        ShortageService.update(inp.getAttribute('data-id'), { requestedQty: Number(inp.value) || 0 });
        UI.toast(t('updated'));
      });
    });
    el.querySelectorAll('.btn-del').forEach(function (b) {
      b.addEventListener('click', function () {
        ShortageService.remove(b.getAttribute('data-id'));
        render();
      });
    });
    document.getElementById('chkAllL').addEventListener('change', function () {
      el.querySelectorAll('.chkL').forEach(function (c) { c.checked = document.getElementById('chkAllL').checked; });
    });
    document.getElementById('btnMerge').addEventListener('click', function () {
      ShortageService.mergeDuplicates();
      UI.toast(t('success'));
      render();
    });
    document.getElementById('btnConvert').addEventListener('click', function () {
      const ids = Array.prototype.map.call(el.querySelectorAll('.chkL:checked'), function (c) { return c.value; });
      const suppliers = DataAPI.data().supplierRelations.filter(function (r) { return r.buyerOrgId === session.orgId && !r.blocked; }).map(function (r) { return r.supplierOrgId; });
      const req = ShortageService.convertToRequest(ids, suppliers.slice(0, 5));
      UI.toast(t('requestPublished'));
      location.href = 'create-request.html?id=' + encodeURIComponent(req.id);
    });
  }

  document.getElementById('btnCreatePR').addEventListener('click', function () {
    tab = 'list';
    render();
    setTimeout(function () {
      const btn = document.getElementById('btnConvert');
      if (btn) btn.click();
    }, 100);
  });

  render();
})();
