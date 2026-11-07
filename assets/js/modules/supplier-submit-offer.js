/**
 * PHARMA LINK — Supplier Submit Offer
 */
(function () {
  const ctx = Layout.render({
    area: 'supplier',
    active: 'requests',
    title: t('submitOffer'),
    breadcrumb: [
      { label: t('home'), href: '/supplier/dashboard.html' },
      { label: t('availableRequests'), href: '/supplier/requests.html' },
      { label: t('submitOffer') }
    ]
  });
  if (!ctx) return;

  const session = ctx.session;
  const requestId = UI.qs('requestId') || UI.qs('id');
  const request = ProcurementService.getRequest(requestId);
  if (!request) {
    UI.emptyState(ctx.body, t('noData'), t('availableRequests'));
    ctx.body.innerHTML += '<div class="text-center"><a class="btn btn-pl-primary" href="requests.html">' + escapeHtml(t('availableRequests')) + '</a></div>';
    return;
  }

  const windowOpen = ProcurementService.isWindowOpen(request);
  let offer = ProcurementService.offersForSupplier(session.orgId).find(function (o) { return o.requestId === request.id; });
  if (!offer) {
    offer = ProcurementService.saveOffer({
      requestId: request.id,
      supplierOrgId: session.orgId,
      status: 'draft',
      items: (request.items || []).map(function (it) {
        return { productId: it.productId, unitPrice: 0, discountPct: 0, availableQty: 0, committedQty: 0, deliveryDays: 3, minOrderQty: 1, notes: '' };
      })
    });
  }

  ctx.actions.innerHTML =
    '<a class="btn btn-pl-outline btn-sm" href="offer-import.html?requestId=' + encodeURIComponent(request.id) + '&offerId=' + encodeURIComponent(offer.id) + '"><i class="bi bi-file-earmark-excel"></i> ' + escapeHtml(t('excelImport')) + '</a>' +
    '<button type="button" class="btn btn-pl-outline btn-sm" id="btnDraft">' + escapeHtml(t('saveDraft')) + '</button>' +
    '<button type="button" class="btn btn-pl-accent btn-sm" id="btnSubmit"' + (!windowOpen ? ' disabled' : '') + '>' + escapeHtml(t('submitOffer')) + '</button>';

  function calcNet(price, disc) {
    return Math.round(Number(price) * (1 - (Number(disc) || 0) / 100) * 100) / 100;
  }

  function render() {
    offer = ProcurementService.getOffer(offer.id);
    let totalValue = 0;
    let offered = 0;
    (offer.items || []).forEach(function (it) {
      if (Number(it.unitPrice) > 0) {
        offered++;
        totalValue += calcNet(it.unitPrice, it.discountPct) * (Number(it.committedQty || it.availableQty) || 0);
      }
    });
    const missing = (request.items || []).length - offered;

    let html = '';
    if (!windowOpen) {
      html += '<div class="alert alert-danger">' + escapeHtml(t('cannotAcceptOffers')) + ' — ' + escapeHtml(t('windowClosed')) + '</div>';
    } else {
      html += '<div class="alert alert-success">' + escapeHtml(t('windowOpen')) + ' · ' + escapeHtml(t('offerDeadline')) + ': ' + Formatters.datetime(request.deadline) + '</div>';
    }
    html += '<div class="row g-3 mb-3">';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-box', 'blue', t('productCount'), String((offer.items || []).length)) + '</div>';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-check2', 'green', t('offerCount'), String(offered)) + '</div>';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-exclamation', 'amber', t('unmatched'), String(Math.max(0, missing))) + '</div>';
    html += '<div class="col-md-3">' + PharmaApp.statCard('bi-cash', 'teal', t('totalCost'), Formatters.currency(totalValue)) + '</div>';
    html += '</div>';

    html += '<div class="pl-card"><div class="pl-card-header"><h3 class="pl-card-title">' + escapeHtml(request.number) + '</h3><span class="pl-badge badge-demo">' + escapeHtml(t('simulated')) + '</span></div>';
    html += '<div class="pl-card-body p-0 pl-table-wrap"><table class="pl-table"><thead><tr>' +
      '<th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('requestedQty')) + '</th>' +
      '<th>' + escapeHtml(t('unitPrice')) + '</th><th>' + escapeHtml(t('discountPct')) + '</th><th>' + escapeHtml(t('netUnitPrice')) + '</th>' +
      '<th>' + escapeHtml(t('availableQuantity')) + '</th><th>' + escapeHtml(t('committedQty')) + '</th>' +
      '<th>' + escapeHtml(t('minOrderQty')) + '</th><th>' + escapeHtml(t('deliveryTime')) + '</th></tr></thead><tbody>';

    (offer.items || []).forEach(function (it, idx) {
      const reqItem = (request.items || []).find(function (r) { return r.productId === it.productId; });
      const np = calcNet(it.unitPrice, it.discountPct);
      html += '<tr>' +
        '<td>' + escapeHtml(UI.productLabel(DataAPI.findProduct(it.productId))) + '</td>' +
        '<td>' + (reqItem ? reqItem.qty : '—') + '</td>' +
        '<td><input type="number" min="0" step="0.01" class="form-control form-control-sm f-price" data-i="' + idx + '" value="' + (it.unitPrice || '') + '" style="width:100px" /></td>' +
        '<td><input type="number" min="0" max="100" step="0.1" class="form-control form-control-sm f-disc" data-i="' + idx + '" value="' + (it.discountPct || 0) + '" style="width:80px" /></td>' +
        '<td class="fw-bold text-accent net-cell" data-i="' + idx + '">' + Formatters.currency(np) + '</td>' +
        '<td><input type="number" min="0" class="form-control form-control-sm f-avail" data-i="' + idx + '" value="' + (it.availableQty || 0) + '" style="width:90px" /></td>' +
        '<td><input type="number" min="0" class="form-control form-control-sm f-commit" data-i="' + idx + '" value="' + (it.committedQty || 0) + '" style="width:90px" /></td>' +
        '<td><input type="number" min="0" class="form-control form-control-sm f-min" data-i="' + idx + '" value="' + (it.minOrderQty || 1) + '" style="width:80px" /></td>' +
        '<td><input type="number" min="0" class="form-control form-control-sm f-del" data-i="' + idx + '" value="' + (it.deliveryDays || 3) + '" style="width:80px" /></td>' +
        '</tr>';
    });
    html += '</tbody></table></div></div>';
    ctx.body.innerHTML = html;

    function readItems() {
      return (offer.items || []).map(function (it, idx) {
        const price = Number(ctx.body.querySelector('.f-price[data-i="' + idx + '"]').value) || 0;
        const disc = Number(ctx.body.querySelector('.f-disc[data-i="' + idx + '"]').value) || 0;
        return {
          productId: it.productId,
          unitPrice: price,
          discountPct: disc,
          netUnitPrice: calcNet(price, disc),
          availableQty: Number(ctx.body.querySelector('.f-avail[data-i="' + idx + '"]').value) || 0,
          committedQty: Number(ctx.body.querySelector('.f-commit[data-i="' + idx + '"]').value) || 0,
          minOrderQty: Number(ctx.body.querySelector('.f-min[data-i="' + idx + '"]').value) || 0,
          deliveryDays: Number(ctx.body.querySelector('.f-del[data-i="' + idx + '"]').value) || 0,
          notes: it.notes || ''
        };
      });
    }

    function refreshNets() {
      ctx.body.querySelectorAll('.f-price, .f-disc').forEach(function (inp) {
        const i = inp.getAttribute('data-i');
        const price = Number(ctx.body.querySelector('.f-price[data-i="' + i + '"]').value) || 0;
        const disc = Number(ctx.body.querySelector('.f-disc[data-i="' + i + '"]').value) || 0;
        const cell = ctx.body.querySelector('.net-cell[data-i="' + i + '"]');
        if (cell) cell.textContent = Formatters.currency(calcNet(price, disc));
      });
    }
    ctx.body.querySelectorAll('.f-price, .f-disc').forEach(function (inp) {
      inp.addEventListener('input', refreshNets);
    });

    document.getElementById('btnDraft').onclick = function () {
      ProcurementService.saveOffer({ id: offer.id, requestId: request.id, supplierOrgId: session.orgId, status: 'draft', items: readItems() });
      UI.toast(t('savedAsDraft'));
      render();
    };
    document.getElementById('btnSubmit').onclick = async function () {
      if (!windowOpen) { UI.toast(t('cannotAcceptOffers'), 'error'); return; }
      const items = readItems();
      const invalid = items.filter(function (it) { return !(it.unitPrice > 0) || !(it.availableQty > 0); });
      if (invalid.length === items.length) { UI.toast(t('validationError'), 'warning'); return; }
      const ok = await UI.confirm({ title: t('submitOffer'), text: t('confirmAction') });
      if (!ok) return;
      ProcurementService.saveOffer({ id: offer.id, requestId: request.id, supplierOrgId: session.orgId, status: 'draft', items: items });
      try {
        ProcurementService.submitOffer(offer.id);
        UI.alert({ title: t('offerSubmitted'), icon: 'success' }).then(function () {
          location.href = 'offer-history.html';
        });
      } catch (e) {
        UI.toast(t(e.message) || t('error'), 'error');
      }
    };
  }

  render();
})();
