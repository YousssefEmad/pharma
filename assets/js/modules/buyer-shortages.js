/**
 * PharmaLink — Shortage cycle hub
 * Detect → peer reserve → track → residual supplier PR
 */
(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'shortages',
    title: t('shortages'),
    description: t('shortageCycleDesc'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('shortages') }]
  });
  if (!ctx) return;

  let tab = UI.qs('tab') || 'network';
  const session = ctx.session;
  const canWrite = session.role !== 'warehouse_viewer';

  ctx.actions.innerHTML =
    '<a class="btn btn-pl-outline btn-sm" href="stock-transfers.html?tab=reservations"><i class="bi bi-arrow-left-right"></i> ' + escapeHtml(t('reservationTracking')) + '</a>' +
    '<a class="btn btn-pl-outline btn-sm" href="shortage-import.html"><i class="bi bi-file-earmark-excel"></i> ' + escapeHtml(t('excelImport')) + '</a>' +
    (canWrite ? '<button type="button" class="btn btn-pl-primary btn-sm" id="btnCreatePR"><i class="bi bi-cart-plus"></i> ' + escapeHtml(t('convertResidualToPR')) + '</button>' : '');

  function whLabel(w) {
    if (!w) return '—';
    return StorageService.getLang() === 'ar' ? w.nameAr : w.nameEn;
  }

  function render() {
    const board = ShortageService.networkBoard(session.orgId);
    const openCount = board.filter(function (s) { return s.status === 'open'; }).length;
    const partialCount = board.filter(function (s) { return s.status === 'partially_covered'; }).length;
    const peerCoverable = board.filter(function (s) { return s.peerAvailableTotal > 0 && s.remaining > 0; }).length;
    const reservations = ReservationService.list(session.orgId);
    const activeRes = reservations.filter(function (r) { return ['requested', 'reserved', 'shipped'].indexOf(r.status) !== -1; }).length;

    let html = '<div class="row g-3 mb-3">';
    [
      [t('openShortages'), openCount, 'bi-exclamation-triangle', 'danger'],
      [t('partiallyCovered'), partialCount, 'bi-pie-chart', 'warning'],
      [t('peerCoverable'), peerCoverable, 'bi-building', 'teal'],
      [t('activeReservations'), activeRes, 'bi-bookmark-check', 'info']
    ].forEach(function (k) {
      html += '<div class="col-6 col-lg-3"><div class="pl-stat"><div class="pl-stat-icon ' + k[3] + '"><i class="bi ' + k[2] + '"></i></div>' +
        '<div class="pl-stat-label">' + escapeHtml(k[0]) + '</div><div class="pl-stat-value">' + k[1] + '</div></div></div>';
    });
    html += '</div>';

    html += '<div class="pl-pill-tabs mb-3" id="tabs">';
    [
      ['network', t('shortageNetwork')],
      ['auto', t('autoDetection')],
      ['manual', t('manualEntry')],
      ['list', t('shortageList')],
      ['track', t('reservationTracking')]
    ].forEach(function (x) {
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
    if (tab === 'network') renderNetwork(body, board);
    else if (tab === 'auto') renderAuto(body);
    else if (tab === 'manual') renderManual(body);
    else if (tab === 'track') renderTrack(body, reservations);
    else renderList(body);

    const btnPR = document.getElementById('btnCreatePR');
    if (btnPR) {
      btnPR.onclick = function () {
        tab = 'list';
        UI.setQs({ tab: 'list' });
        render();
        setTimeout(function () {
          const btn = document.getElementById('btnConvertResidual');
          if (btn) btn.click();
        }, 80);
      };
    }
  }

  function renderNetwork(el, board) {
    let html = '<div class="pl-card mb-3"><div class="pl-card-body small text-muted">' + escapeHtml(t('shortageNetworkHint')) + '</div></div>';
    html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('shortageNetwork')) + '</h3>' +
      '<span class="pl-badge badge-info">' + board.length + '</span></div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th>' + escapeHtml(t('warehouse')) + '</th>' +
      '<th>' + escapeHtml(t('productName')) + '</th>' +
      '<th class="num">' + escapeHtml(t('neededQty')) + '</th>' +
      '<th class="num">' + escapeHtml(t('coveredQty')) + '</th>' +
      '<th class="num">' + escapeHtml(t('remainingQty')) + '</th>' +
      '<th>' + escapeHtml(t('peerStock')) + '</th>' +
      '<th>' + escapeHtml(t('urgency')) + '</th>' +
      '<th>' + escapeHtml(t('status')) + '</th>' +
      '<th>' + escapeHtml(t('actions')) + '</th>' +
      '</tr></thead><tbody>';

    board.forEach(function (s) {
      const peers = (s.peerStock || []).map(function (p) {
        return '<div class="small"><strong>' + escapeHtml(whLabel(p.warehouse)) + '</strong>: ' + Formatters.number(p.available) + '</div>';
      }).join('') || '<span class="text-muted small">—</span>';
      html += '<tr>' +
        '<td>' + escapeHtml(whLabel(s.warehouse)) + '</td>' +
        '<td>' + escapeHtml(UI.productLabel(s.product)) + '</td>' +
        '<td class="num">' + Formatters.number(s.requestedQty) + '</td>' +
        '<td class="num">' + Formatters.number(s.coveredQty) + '</td>' +
        '<td class="num fw-bold">' + Formatters.number(s.remaining) + '</td>' +
        '<td>' + peers + '</td>' +
        '<td>' + Formatters.urgencyBadge(s.urgency) + '</td>' +
        '<td>' + Formatters.statusBadge(s.status) + '</td>' +
        '<td class="actions">';
      if (canWrite && s.remaining > 0 && s.peerStock && s.peerStock.length) {
        html += '<button type="button" class="btn btn-sm btn-pl-accent btn-peer" data-id="' + s.id + '"><i class="bi bi-bookmark-plus"></i> ' + escapeHtml(t('requestFromPeer')) + '</button>';
      } else if (canWrite && s.remaining > 0) {
        html += '<button type="button" class="btn btn-sm btn-pl-outline btn-buy" data-id="' + s.id + '"><i class="bi bi-cart"></i> ' + escapeHtml(t('buyFromSuppliers')) + '</button>';
      } else {
        html += '<span class="text-muted small">—</span>';
      }
      html += '</td></tr>';
    });
    if (!board.length) html += '<tr><td colspan="9"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;

    el.querySelectorAll('.btn-peer').forEach(function (btn) {
      btn.addEventListener('click', function () { openPeerModal(btn.getAttribute('data-id')); });
    });
    el.querySelectorAll('.btn-buy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const suppliers = DataAPI.data().supplierRelations.filter(function (r) { return r.buyerOrgId === session.orgId && !r.blocked; }).map(function (r) { return r.supplierOrgId; });
        const req = ShortageService.convertToRequest([id], suppliers.slice(0, 5), true);
        if (!req) { UI.toast(t('noResidualQty'), 'warning'); return; }
        UI.toast(t('requestPublished'));
        location.href = 'create-request.html?id=' + encodeURIComponent(req.id);
      });
    });
  }

  async function openPeerModal(shortageId) {
    const board = ShortageService.networkBoard(session.orgId);
    const s = board.find(function (x) { return x.id === shortageId; });
    if (!s || !s.peerStock.length) return;
    const options = {};
    s.peerStock.forEach(function (p) {
      options[p.warehouseId] = whLabel(p.warehouse) + ' — ' + t('availableQty') + ': ' + p.available;
    });
    const pick = await Swal.fire({
      title: t('requestFromPeer'),
      html: '<p class="small text-muted mb-2">' + escapeHtml(UI.productLabel(s.product)) + '</p>' +
        '<label class="form-label">' + escapeHtml(t('sourceWarehouse')) + '</label>' +
        '<select id="peerWh" class="form-select mb-2">' + s.peerStock.map(function (p) {
          return '<option value="' + p.warehouseId + '" data-max="' + p.available + '">' + escapeHtml(whLabel(p.warehouse)) + ' (' + p.available + ')</option>';
        }).join('') + '</select>' +
        '<label class="form-label">' + escapeHtml(t('quantity')) + '</label>' +
        '<input type="number" id="peerQty" class="form-control" value="' + Math.min(s.remaining, s.peerStock[0].available) + '" min="1" />',
      showCancelButton: true,
      confirmButtonText: t('sendReservation'),
      cancelButtonText: t('cancel'),
      preConfirm: function () {
        const sel = document.getElementById('peerWh');
        const max = Number(sel.options[sel.selectedIndex].getAttribute('data-max')) || 0;
        const qty = Number(document.getElementById('peerQty').value) || 0;
        if (qty < 1 || qty > max) {
          Swal.showValidationMessage(t('invalidPeerQty'));
          return false;
        }
        return { fromWarehouseId: sel.value, qty: qty };
      }
    });
    if (!pick.isConfirmed || !pick.value) return;
    ReservationService.requestFromPeer({
      productId: s.productId,
      qty: pick.value.qty,
      fromWarehouseId: pick.value.fromWarehouseId,
      toWarehouseId: s.warehouseId,
      shortageId: s.id
    });
    UI.toast(t('reservationRequested'));
    render();
  }

  function renderTrack(el, reservations) {
    let html = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('reservationTracking')) + '</h3>' +
      '<a class="small" href="stock-transfers.html?tab=reservations">' + escapeHtml(t('manageTransfers')) + '</a></div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th>ID</th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('fromWarehouse')) + '</th><th>' + escapeHtml(t('toWarehouse')) + '</th>' +
      '<th class="num">' + escapeHtml(t('quantity')) + '</th><th>' + escapeHtml(t('linkedShortage')) + '</th><th>' + escapeHtml(t('status')) + '</th><th>' + escapeHtml(t('actions')) + '</th>' +
      '</tr></thead><tbody>';
    reservations.forEach(function (r) {
      const from = DataAPI.data().warehouses.find(function (w) { return w.id === r.fromWarehouseId; });
      const to = DataAPI.data().warehouses.find(function (w) { return w.id === r.toWarehouseId; });
      html += '<tr><td class="pl-mono">' + escapeHtml(r.id) + '</td>' +
        '<td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(r.productId))) + '</td>' +
        '<td>' + escapeHtml(whLabel(from)) + '</td><td>' + escapeHtml(whLabel(to)) + '</td>' +
        '<td class="num">' + Formatters.number(r.qty) + '</td>' +
        '<td class="pl-mono">' + escapeHtml(r.shortageId || '—') + '</td>' +
        '<td>' + Formatters.statusBadge(r.status) + '</td><td class="actions">';
      if (canWrite && r.status === 'requested') {
        html += '<button type="button" class="btn btn-sm btn-pl-primary btn-acc" data-id="' + r.id + '">' + escapeHtml(t('acceptReservation')) + '</button> ';
        html += '<button type="button" class="btn btn-sm btn-pl-outline btn-rej" data-id="' + r.id + '">' + escapeHtml(t('reject')) + '</button>';
      } else if (canWrite && r.status === 'reserved') {
        html += '<button type="button" class="btn btn-sm btn-pl-accent btn-ship" data-id="' + r.id + '">' + escapeHtml(t('shipReservation')) + '</button>';
      } else if (canWrite && r.status === 'shipped') {
        html += '<button type="button" class="btn btn-sm btn-pl-primary btn-recv" data-id="' + r.id + '">' + escapeHtml(t('receiveReservation')) + '</button>';
      } else {
        html += '<span class="text-muted small">—</span>';
      }
      html += '</td></tr>';
    });
    if (!reservations.length) html += '<tr><td colspan="8"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;

    el.querySelectorAll('.btn-acc').forEach(function (b) {
      b.addEventListener('click', function () { ReservationService.accept(b.getAttribute('data-id')); UI.toast(t('reservationAccepted')); render(); });
    });
    el.querySelectorAll('.btn-rej').forEach(function (b) {
      b.addEventListener('click', function () { ReservationService.reject(b.getAttribute('data-id')); UI.toast(t('reservationRejected')); render(); });
    });
    el.querySelectorAll('.btn-ship').forEach(function (b) {
      b.addEventListener('click', function () { ReservationService.ship(b.getAttribute('data-id')); UI.toast(t('reservationShipped')); render(); });
    });
    el.querySelectorAll('.btn-recv').forEach(function (b) {
      b.addEventListener('click', function () { ReservationService.complete(b.getAttribute('data-id')); UI.toast(t('reservationReceived')); render(); });
    });
  }

  function renderAuto(el) {
    const rows = InventoryService.detectShortages(session.warehouseId);
    let html = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('autoDetection')) + ' (' + rows.length + ')</h3>' +
      (canWrite ? '<button type="button" class="btn btn-pl-accent btn-sm" id="btnAddSelected">' + escapeHtml(t('addToShortage')) + '</button>' : '') + '</div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th><input type="checkbox" id="chkAll" /></th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('availableQty')) + '</th>' +
      '<th>' + escapeHtml(t('peerStock')) + '</th><th>' + escapeHtml(t('reorderPoint')) + '</th><th>' + escapeHtml(t('suggestedQty')) + '</th>' +
      '<th>' + escapeHtml(t('urgency')) + '</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      const peers = InventoryService.peerAvailability(session.orgId, r.productId, session.warehouseId);
      const peerTxt = peers.length ? peers.map(function (p) { return whLabel(p.warehouse) + ': ' + p.available; }).join(' · ') : '—';
      html += '<tr><td><input type="checkbox" class="chk" data-pid="' + r.productId + '" data-qty="' + r.suggestedQty + '" data-urg="' + r.urgency + '" /></td>' +
        '<td>' + escapeHtml(UI.productLabel(r.product)) + '</td><td>' + Formatters.number(r.available) + '</td>' +
        '<td class="small">' + escapeHtml(peerTxt) + '</td><td>' + Formatters.number(r.reorderPoint, 1) + '</td>' +
        '<td><input type="number" class="form-control form-control-sm sug-qty" data-pid="' + r.productId + '" value="' + r.suggestedQty + '" style="width:90px" /></td>' +
        '<td>' + Formatters.urgencyBadge(r.urgency) + '</td></tr>';
    });
    if (!rows.length) html += '<tr><td colspan="7"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;
    const chkAll = document.getElementById('chkAll');
    if (chkAll) chkAll.addEventListener('change', function () {
      el.querySelectorAll('.chk').forEach(function (c) { c.checked = chkAll.checked; });
    });
    const btn = document.getElementById('btnAddSelected');
    if (btn) btn.addEventListener('click', function () {
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
      tab = 'network';
      render();
    });
  }

  function renderManual(el) {
    if (!canWrite) {
      el.innerHTML = '<div class="pl-empty">' + escapeHtml(t('viewOnly')) + '</div>';
      return;
    }
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
        tab = 'network';
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
    const scope = UI.qs('scope') || 'org';
    const rows = scope === 'mine' ? ShortageService.list(session.warehouseId) : ShortageService.listOrg(session.orgId);
    let html = '<div class="d-flex gap-2 mb-2 flex-wrap">' +
      '<button type="button" class="btn btn-sm ' + (scope === 'org' ? 'btn-pl-primary' : 'btn-pl-outline') + '" data-scope="org">' + escapeHtml(t('allOrgWarehouses')) + '</button>' +
      '<button type="button" class="btn btn-sm ' + (scope === 'mine' ? 'btn-pl-primary' : 'btn-pl-outline') + '" data-scope="mine">' + escapeHtml(t('thisWarehouse')) + '</button></div>';
    html += '<div class="pl-card"><div class="pl-card-header flex-wrap gap-2"><h3 class="pl-card-title">' + escapeHtml(t('shortageList')) + '</h3><div class="d-flex gap-2">' +
      (canWrite ? '<button type="button" class="btn btn-sm btn-pl-outline" id="btnMerge">' + escapeHtml(t('mergeDuplicates')) + '</button>' : '') +
      (canWrite ? '<button type="button" class="btn btn-sm btn-pl-primary" id="btnConvertResidual">' + escapeHtml(t('convertResidualToPR')) + '</button>' : '') +
      '</div></div><div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr><th><input type="checkbox" id="chkAllL" /></th>' +
      '<th>' + escapeHtml(t('warehouse')) + '</th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('quantity')) + '</th>' +
      '<th>' + escapeHtml(t('coveredQty')) + '</th><th>' + escapeHtml(t('remainingQty')) + '</th><th>' + escapeHtml(t('urgency')) + '</th>' +
      '<th>' + escapeHtml(t('status')) + '</th><th>' + escapeHtml(t('actions')) + '</th></tr></thead><tbody>';
    rows.forEach(function (s) {
      html += '<tr><td><input type="checkbox" class="chkL" value="' + s.id + '" ' + (s.status !== 'closed' ? 'checked' : '') + ' /></td>' +
        '<td>' + escapeHtml(whLabel(s.warehouse)) + '</td>' +
        '<td>' + escapeHtml(UI.productLabel(s.product)) + '</td>' +
        '<td><input type="number" class="form-control form-control-sm qty-edit" data-id="' + s.id + '" value="' + s.requestedQty + '" style="width:90px" ' + (canWrite ? '' : 'disabled') + ' /></td>' +
        '<td class="num">' + Formatters.number(s.coveredQty) + '</td>' +
        '<td class="num">' + Formatters.number(s.remainingQty) + '</td>' +
        '<td>' + Formatters.urgencyBadge(s.urgency) + '</td>' +
        '<td>' + Formatters.statusBadge(s.status) + '</td>' +
        '<td>' + (canWrite ? '<button type="button" class="btn btn-sm btn-pl-ghost btn-del" data-id="' + s.id + '"><i class="bi bi-trash"></i></button>' : '—') + '</td></tr>';
    });
    if (!rows.length) html += '<tr><td colspan="9"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;

    el.querySelectorAll('[data-scope]').forEach(function (b) {
      b.addEventListener('click', function () {
        UI.setQs({ tab: 'list', scope: b.getAttribute('data-scope') });
        render();
      });
    });
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
    const chkAll = document.getElementById('chkAllL');
    if (chkAll) chkAll.addEventListener('change', function () {
      el.querySelectorAll('.chkL').forEach(function (c) { c.checked = chkAll.checked; });
    });
    const btnMerge = document.getElementById('btnMerge');
    if (btnMerge) btnMerge.addEventListener('click', function () {
      ShortageService.mergeDuplicates();
      UI.toast(t('success'));
      render();
    });
    const btnConvert = document.getElementById('btnConvertResidual');
    if (btnConvert) btnConvert.addEventListener('click', function () {
      const ids = Array.prototype.map.call(el.querySelectorAll('.chkL:checked'), function (c) { return c.value; });
      const suppliers = DataAPI.data().supplierRelations.filter(function (r) { return r.buyerOrgId === session.orgId && !r.blocked; }).map(function (r) { return r.supplierOrgId; });
      const req = ShortageService.convertToRequest(ids, suppliers.slice(0, 5), true);
      if (!req) { UI.toast(t('noResidualQty'), 'warning'); return; }
      UI.toast(t('requestPublished'));
      location.href = 'create-request.html?id=' + encodeURIComponent(req.id);
    });
  }

  render();
})();
