/**
 * PharmaLink — Transfers + reservation fulfillment
 */
(function () {
  let tab = (function () {
    try { return new URLSearchParams(window.location.search).get('tab') || 'transfers'; } catch (e) { return 'transfers'; }
  })();

  const ctx = Layout.render({
    area: 'buyer',
    active: tab === 'reservations' ? 'reservationTracking' : 'stockTransfers',
    title: tab === 'reservations' ? t('reservationTracking') : t('stockTransfers'),
    description: t('transferCycleDesc'),
    breadcrumb: [{ label: t('home'), href: '/buyer/dashboard.html' }, { label: t('stockTransfers') }]
  });
  if (!ctx) return;

  const session = ctx.session;
  const canWrite = session.role !== 'warehouse_viewer';
  const data = DataAPI.data();
  const whs = data.warehouses.filter(function (w) { return w.orgId === session.orgId; });

  function whLabel(id) {
    const w = whs.find(function (x) { return x.id === id; }) || DataAPI.data().warehouses.find(function (x) { return x.id === id; });
    if (!w) return id;
    return StorageService.getLang() === 'ar' ? w.nameAr : w.nameEn;
  }

  function render() {
    ctx.actions.innerHTML = '<a class="btn btn-pl-outline btn-sm" href="shortages.html?tab=network"><i class="bi bi-exclamation-triangle"></i> ' + escapeHtml(t('shortageNetwork')) + '</a>';

    let html = '<div class="pl-pill-tabs mb-3" id="tabs">' +
      '<button type="button" data-tab="transfers" class="' + (tab === 'transfers' ? 'active' : '') + '">' + escapeHtml(t('transferHistory')) + '</button>' +
      '<button type="button" data-tab="reservations" class="' + (tab === 'reservations' ? 'active' : '') + '">' + escapeHtml(t('reservationTracking')) + '</button>' +
      (canWrite ? '<button type="button" data-tab="new" class="' + (tab === 'new' ? 'active' : '') + '">' + escapeHtml(t('transferRequest')) + '</button>' : '') +
      '</div><div id="tabBody"></div>';
    ctx.body.innerHTML = html;
    document.getElementById('tabs').addEventListener('click', function (e) {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      tab = b.getAttribute('data-tab');
      UI.setQs({ tab: tab });
      render();
    });
    const body = document.getElementById('tabBody');
    if (tab === 'reservations') renderReservations(body);
    else if (tab === 'new') renderNew(body);
    else renderTransfers(body);
  }

  function renderTransfers(el) {
    const rows = TransferService.list(session.orgId);
    let html = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('transferHistory')) + '</h3></div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th>ID</th><th>' + escapeHtml(t('sourceWarehouse')) + '</th><th>' + escapeHtml(t('destWarehouse')) + '</th>' +
      '<th>' + escapeHtml(t('items')) + '</th><th>' + escapeHtml(t('linkedReservation')) + '</th><th>' + escapeHtml(t('status')) + '</th><th>' + escapeHtml(t('date')) + '</th><th>' + escapeHtml(t('actions')) + '</th>' +
      '</tr></thead><tbody>';
    rows.forEach(function (tr) {
      const items = (tr.items || []).map(function (it) {
        return UI.productLabel(DataAPI.findProduct(it.productId)) + ' × ' + it.qty;
      }).join('<br>');
      html += '<tr><td class="pl-mono">' + escapeHtml(tr.id) + '</td>' +
        '<td>' + escapeHtml(whLabel(tr.fromWarehouseId)) + '</td>' +
        '<td>' + escapeHtml(whLabel(tr.toWarehouseId)) + '</td>' +
        '<td class="small">' + items + '</td>' +
        '<td class="pl-mono">' + escapeHtml(tr.reservationId || '—') + '</td>' +
        '<td>' + Formatters.statusBadge(tr.status) + '</td>' +
        '<td>' + Formatters.date(tr.createdAt) + '</td><td class="actions">';
      if (canWrite && (tr.status === 'pending' || tr.status === 'reserved')) {
        html += '<button type="button" class="btn btn-sm btn-pl-accent btn-ship" data-id="' + tr.id + '">' + escapeHtml(t('shipTransfer')) + '</button> ';
      }
      if (canWrite && (tr.status === 'in_transit' || tr.status === 'pending')) {
        html += '<button type="button" class="btn btn-sm btn-pl-primary btn-recv" data-id="' + tr.id + '">' + escapeHtml(t('receiveTransfer')) + '</button>';
      }
      if (canWrite && tr.status !== 'completed' && tr.status !== 'cancelled') {
        html += ' <button type="button" class="btn btn-sm btn-pl-ghost btn-cancel" data-id="' + tr.id + '"><i class="bi bi-x"></i></button>';
      }
      if (tr.status === 'completed') html += '<span class="text-muted small">—</span>';
      html += '</td></tr>';
    });
    if (!rows.length) html += '<tr><td colspan="8"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
    html += '</tbody></table></div></div>';
    el.innerHTML = html;
    el.querySelectorAll('.btn-ship').forEach(function (b) {
      b.addEventListener('click', function () {
        TransferService.ship(b.getAttribute('data-id'));
        UI.toast(t('transferShipped'));
        render();
      });
    });
    el.querySelectorAll('.btn-recv').forEach(function (b) {
      b.addEventListener('click', function () {
        TransferService.receive(b.getAttribute('data-id'));
        UI.toast(t('transferReceived'));
        render();
      });
    });
    el.querySelectorAll('.btn-cancel').forEach(function (b) {
      b.addEventListener('click', function () {
        TransferService.cancel(b.getAttribute('data-id'));
        UI.toast(t('cancelled'));
        render();
      });
    });
  }

  function renderReservations(el) {
    const rows = ReservationService.list(session.orgId);
    let html = '<div class="pl-card mb-3"><div class="pl-card-body small text-muted">' + escapeHtml(t('reservationHint')) + '</div></div>';
    html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('reservationTracking')) + '</h3></div>' +
      '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th>ID</th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('fromWarehouse')) + '</th><th>' + escapeHtml(t('toWarehouse')) + '</th>' +
      '<th class="num">' + escapeHtml(t('quantity')) + '</th><th>' + escapeHtml(t('linkedShortage')) + '</th><th>' + escapeHtml(t('whoRequested')) + '</th>' +
      '<th>' + escapeHtml(t('status')) + '</th><th>' + escapeHtml(t('actions')) + '</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      const user = DataAPI.findUser(r.createdBy);
      const who = user ? (StorageService.getLang() === 'ar' ? user.nameAr : user.nameEn) : r.createdBy;
      html += '<tr><td class="pl-mono">' + escapeHtml(r.id) + '</td>' +
        '<td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(r.productId))) + '</td>' +
        '<td>' + escapeHtml(whLabel(r.fromWarehouseId)) + '</td>' +
        '<td>' + escapeHtml(whLabel(r.toWarehouseId)) + '</td>' +
        '<td class="num">' + Formatters.number(r.qty) + '</td>' +
        '<td class="pl-mono">' + escapeHtml(r.shortageId || '—') + '</td>' +
        '<td>' + escapeHtml(who) + '</td>' +
        '<td>' + Formatters.statusBadge(r.status) + '</td><td class="actions">';
      if (canWrite && r.status === 'requested') {
        html += '<button type="button" class="btn btn-sm btn-pl-primary btn-acc" data-id="' + r.id + '">' + escapeHtml(t('acceptReservation')) + '</button> ';
        html += '<button type="button" class="btn btn-sm btn-pl-outline btn-rej" data-id="' + r.id + '">' + escapeHtml(t('reject')) + '</button>';
      } else if (canWrite && r.status === 'reserved') {
        html += '<button type="button" class="btn btn-sm btn-pl-accent btn-ship" data-id="' + r.id + '">' + escapeHtml(t('shipReservation')) + '</button>';
      } else if (canWrite && r.status === 'shipped') {
        html += '<button type="button" class="btn btn-sm btn-pl-primary btn-recv" data-id="' + r.id + '">' + escapeHtml(t('receiveReservation')) + '</button>';
      } else html += '—';
      html += '</td></tr>';
    });
    if (!rows.length) html += '<tr><td colspan="9"><div class="pl-empty py-4">' + escapeHtml(t('noData')) + '</div></td></tr>';
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

  function renderNew(el) {
    el.innerHTML = '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(t('transferRequest')) + '</h3></div><div class="pl-card-body"><div class="row g-2">' +
      '<div class="col-md-4"><label class="form-label">' + escapeHtml(t('sourceWarehouse')) + '</label><select class="form-select" id="src">' +
      whs.map(function (w) { return '<option value="' + w.id + '">' + escapeHtml(whLabel(w.id)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="col-md-4"><label class="form-label">' + escapeHtml(t('destWarehouse')) + '</label><select class="form-select" id="dst">' +
      whs.map(function (w) { return '<option value="' + w.id + '">' + escapeHtml(whLabel(w.id)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="col-md-4"><label class="form-label">' + escapeHtml(t('productName')) + '</label><select class="form-select" id="pid">' +
      ProductService.list().slice(0, 50).map(function (p) { return '<option value="' + p.id + '">' + escapeHtml(UI.productLabel(p)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="col-md-3"><label class="form-label">' + escapeHtml(t('quantity')) + '</label><input type="number" class="form-control" id="qty" value="5" min="1" /></div>' +
      '<div class="col-md-3 d-flex align-items-end"><button type="button" class="btn btn-pl-primary" id="btnAdd">' + escapeHtml(t('createTransfer')) + '</button></div></div></div></div>';
    if (whs.length > 1) {
      document.getElementById('src').value = whs[0].id;
      document.getElementById('dst').value = whs[1].id;
    }
    document.getElementById('btnAdd').onclick = function () {
      const from = document.getElementById('src').value;
      const to = document.getElementById('dst').value;
      if (from === to) { UI.toast(t('sameWarehouseError'), 'warning'); return; }
      TransferService.create({
        fromWarehouseId: from,
        toWarehouseId: to,
        status: 'pending',
        items: [{ productId: document.getElementById('pid').value, qty: Number(document.getElementById('qty').value) || 0 }]
      });
      UI.toast(t('transferred'));
      tab = 'transfers';
      render();
    };
  }

  render();
})();
