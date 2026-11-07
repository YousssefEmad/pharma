/**
 * PHARMA LINK — Real Excel Shortage Import Wizard (SheetJS)
 */
(function () {
  const ctx = Layout.render({
    area: 'buyer',
    active: 'shortageImport',
    title: t('shortageImport'),
    description: t('excelImport'),
    breadcrumb: [
      { label: t('home'), href: '/buyer/dashboard.html' },
      { label: t('shortages'), href: '/buyer/shortages.html' },
      { label: t('shortageImport') }
    ]
  });
  if (!ctx) return;

  ctx.actions.innerHTML = '<button type="button" class="btn btn-pl-outline btn-sm" id="btnTemplate"><i class="bi bi-download"></i> ' + escapeHtml(t('downloadTemplate')) + '</button>' +
    '<a class="btn btn-pl-outline btn-sm" href="shortages.html">' + escapeHtml(t('shortageList')) + '</a>';

  document.getElementById('btnTemplate').addEventListener('click', function () {
    ExcelHelper.downloadShortageTemplate();
  });

  const state = {
    step: 1,
    file: null,
    wb: null,
    sheet: null,
    headers: [],
    mapping: {},
    rows: [],
    mapped: [],
    matched: []
  };

  const SYSTEM_FIELDS = [
    { key: 'productName', required: true },
    { key: 'productCode', required: false },
    { key: 'barcode', required: false },
    { key: 'quantity', required: true },
    { key: 'unit', required: false },
    { key: 'notes', required: false }
  ];

  function stepsHtml() {
    const labels = [t('uploadFile'), t('worksheet'), t('mapColumns'), t('previewData'), t('matchProducts'), t('confirmImport')];
    return '<div class="pl-wizard-steps">' + labels.map(function (lb, i) {
      const n = i + 1;
      const cls = n < state.step ? 'done' : (n === state.step ? 'active' : '');
      return '<div class="pl-wizard-step ' + cls + '">' + n + '. ' + escapeHtml(lb) + '</div>';
    }).join('') + '</div>';
  }

  function render() {
    let body = stepsHtml();
    if (state.step === 1) {
      body += '<div class="pl-card"><div class="pl-card-body">' +
        '<div class="pl-file-drop" id="dropZone"><i class="bi bi-file-earmark-excel"></i>' +
        '<div class="mt-2 fw-semibold">' + escapeHtml(t('uploadFile')) + '</div>' +
        '<div class="small text-muted">XLS / XLSX / CSV</div>' +
        '<input type="file" id="fileInput" accept=".xlsx,.xls,.csv" class="d-none" /></div></div></div>';
    } else if (state.step === 2) {
      const names = ExcelHelper.sheetNames(state.wb);
      body += '<div class="pl-card"><div class="pl-card-body"><label class="form-label">' + escapeHtml(t('worksheet')) + '</label>' +
        '<select class="form-select" id="sheetSelect">' + names.map(function (n) {
          return '<option ' + (n === state.sheet ? 'selected' : '') + '>' + escapeHtml(n) + '</option>';
        }).join('') + '</select>' +
        '<div class="mt-3 d-flex gap-2"><button type="button" class="btn btn-pl-outline" id="btnPrev">' + escapeHtml(t('previous')) + '</button>' +
        '<button type="button" class="btn btn-pl-primary" id="btnNext">' + escapeHtml(t('next')) + '</button></div></div></div>';
    } else if (state.step === 3) {
      body += '<div class="pl-card"><div class="pl-card-body pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('systemField')) + '</th><th>' + escapeHtml(t('fileColumn')) + '</th></tr></thead><tbody>';
      SYSTEM_FIELDS.forEach(function (f) {
        body += '<tr><td>' + escapeHtml(t(f.key) !== t('unknown') && t(f.key) !== f.key ? t(f.key) : f.key) + (f.required ? ' *' : '') + '</td><td><select class="form-select form-select-sm map-sel" data-field="' + f.key + '">' +
          '<option value="__skip__">' + escapeHtml(t('skipColumn')) + '</option>' +
          state.headers.map(function (h) {
            const sel = state.mapping[f.key] === h ? ' selected' : '';
            return '<option value="' + escapeHtml(h) + '"' + sel + '>' + escapeHtml(h) + '</option>';
          }).join('') + '</select></td></tr>';
      });
      body += '</tbody></table><div class="mt-3 d-flex gap-2"><button type="button" class="btn btn-pl-outline" id="btnPrev">' + escapeHtml(t('previous')) + '</button>' +
        '<button type="button" class="btn btn-pl-primary" id="btnNext">' + escapeHtml(t('next')) + '</button></div></div></div>';
    } else if (state.step === 4) {
      body += '<div class="pl-card"><div class="pl-card-body pl-table-wrap"><table class="pl-table"><thead><tr><th>#</th><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('productCode')) + '</th><th>' + escapeHtml(t('barcode')) + '</th><th>' + escapeHtml(t('quantity')) + '</th><th>' + escapeHtml(t('notes')) + '</th></tr></thead><tbody>';
      state.mapped.slice(0, 50).forEach(function (r, i) {
        const qty = Number(r.quantity);
        const invalid = !(r.productName || r.barcode || r.productCode) || !(qty > 0);
        body += '<tr class="' + (invalid ? 'row-excluded' : '') + '"><td>' + (i + 1) + '</td><td>' + escapeHtml(r.productName || '') + '</td><td>' + escapeHtml(r.productCode || '') + '</td><td>' + escapeHtml(r.barcode || '') + '</td>' +
          '<td><input type="number" class="form-control form-control-sm preview-qty" data-i="' + i + '" value="' + (r.quantity || '') + '" style="width:90px" /></td><td>' + escapeHtml(r.notes || '') + '</td></tr>';
      });
      body += '</tbody></table><div class="mt-3 d-flex gap-2"><button type="button" class="btn btn-pl-outline" id="btnPrev">' + escapeHtml(t('previous')) + '</button>' +
        '<button type="button" class="btn btn-pl-primary" id="btnNext">' + escapeHtml(t('next')) + '</button></div></div></div>';
    } else if (state.step === 5) {
      body += '<div class="pl-card"><div class="pl-card-body pl-table-wrap"><table class="pl-table"><thead><tr><th>' + escapeHtml(t('productName')) + '</th><th>' + escapeHtml(t('quantity')) + '</th><th>' + escapeHtml(t('matched')) + '</th><th>' + escapeHtml(t('status')) + '</th><th>' + escapeHtml(t('manualMatch')) + '</th></tr></thead><tbody>';
      state.matched.forEach(function (m, i) {
        const label = m.product ? UI.productLabel(m.product) : '—';
        const warn = (m.warnings && m.warnings.length) ? '<div class="small pl-match-warn">' + escapeHtml(t('mismatchWarning')) + '</div>' : '';
        let statusCls = 'pl-match-bad';
        let statusTxt = t('unmatched');
        if (m.product && m.confidence === 'exact') { statusCls = 'pl-match-ok'; statusTxt = t('matched') + ' (exact)'; }
        else if (m.product) { statusCls = 'pl-match-warn'; statusTxt = t('matched') + ' (' + m.confidence + ')'; }
        const products = ProductService.list();
        body += '<tr><td>' + escapeHtml(m.row.productName || '') + warn + '</td><td>' + escapeHtml(String(m.row.quantity || '')) + '</td><td>' + escapeHtml(label) + '</td>' +
          '<td class="' + statusCls + '">' + escapeHtml(statusTxt) + '</td><td><select class="form-select form-select-sm manual-match" data-i="' + i + '"><option value="">—</option>' +
          products.map(function (p) {
            const sel = m.product && m.product.id === p.id ? ' selected' : '';
            return '<option value="' + p.id + '"' + sel + '>' + escapeHtml(UI.productLabel(p)) + '</option>';
          }).join('') + '</select></td></tr>';
      });
      body += '</tbody></table><div class="small text-muted mt-2">' + escapeHtml(t('doNotAutoReplace')) + '</div>';
      body += '<div class="mt-3 d-flex gap-2"><button type="button" class="btn btn-pl-outline" id="btnPrev">' + escapeHtml(t('previous')) + '</button>' +
        '<button type="button" class="btn btn-pl-primary" id="btnNext">' + escapeHtml(t('next')) + '</button></div></div></div>';
    } else if (state.step === 6) {
      const ok = state.matched.filter(function (m) { return m.product && Number(m.row.quantity) > 0; });
      const bad = state.matched.length - ok.length;
      body += '<div class="pl-card"><div class="pl-card-body">' +
        '<div class="row g-3 mb-3"><div class="col-md-4">' + PharmaApp.statCard('bi-check-circle', 'green', t('rowsValid'), String(ok.length)) + '</div>' +
        '<div class="col-md-4">' + PharmaApp.statCard('bi-x-circle', 'red', t('rowsUnmatched'), String(bad)) + '</div>' +
        '<div class="col-md-4">' + PharmaApp.statCard('bi-file-earmark', 'blue', t('records'), String(state.matched.length)) + '</div></div>' +
        '<div class="d-flex gap-2"><button type="button" class="btn btn-pl-outline" id="btnPrev">' + escapeHtml(t('previous')) + '</button>' +
        '<button type="button" class="btn btn-pl-accent" id="btnConfirm">' + escapeHtml(t('confirmImport')) + '</button>' +
        '<button type="button" class="btn btn-pl-ghost" id="btnRestart">' + escapeHtml(t('startOver')) + '</button></div></div></div>';
    }
    ctx.body.innerHTML = body;
    bind();
  }

  function bind() {
    const drop = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    if (drop && fileInput) {
      drop.addEventListener('click', function () { fileInput.click(); });
      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', function () { drop.classList.remove('dragover'); });
      drop.addEventListener('drop', function (e) {
        e.preventDefault();
        drop.classList.remove('dragover');
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', function () {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
      });
    }
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    if (btnPrev) btnPrev.addEventListener('click', function () { state.step--; render(); });
    if (btnNext) btnNext.addEventListener('click', function () { goNext(); });
    document.querySelectorAll('.map-sel').forEach(function (sel) {
      sel.addEventListener('change', function () {
        const field = sel.getAttribute('data-field');
        if (sel.value === '__skip__') delete state.mapping[field];
        else state.mapping[field] = sel.value;
      });
    });
    document.querySelectorAll('.preview-qty').forEach(function (inp) {
      inp.addEventListener('change', function () {
        const i = Number(inp.getAttribute('data-i'));
        state.mapped[i].quantity = inp.value;
      });
    });
    document.querySelectorAll('.manual-match').forEach(function (sel) {
      sel.addEventListener('change', function () {
        const i = Number(sel.getAttribute('data-i'));
        const p = ProductService.get(sel.value);
        state.matched[i].product = p || null;
        state.matched[i].confidence = p ? 'manual' : 'none';
        state.matched[i].warnings = [];
      });
    });
    const btnConfirm = document.getElementById('btnConfirm');
    if (btnConfirm) btnConfirm.addEventListener('click', confirmImport);
    const btnRestart = document.getElementById('btnRestart');
    if (btnRestart) btnRestart.addEventListener('click', function () {
      state.step = 1; state.wb = null; state.matched = []; render();
    });
  }

  async function handleFile(file) {
    try {
      state.file = file;
      state.wb = await ExcelHelper.readFile(file);
      state.sheet = ExcelHelper.sheetNames(state.wb)[0];
      state.step = 2;
      render();
      UI.toast(t('success'));
    } catch (err) {
      UI.toast(t(err.message) || t('error'), 'error');
    }
  }

  function goNext() {
    if (state.step === 2) {
      state.sheet = document.getElementById('sheetSelect').value;
      state.headers = ExcelHelper.sheetHeaders(state.wb, state.sheet);
      state.rows = ExcelHelper.sheetToJson(state.wb, state.sheet);
      state.mapping = ProductService.suggestColumnMapping(state.headers);
      state.step = 3;
    } else if (state.step === 3) {
      if (!state.mapping.productName && !state.mapping.barcode && !state.mapping.productCode) {
        UI.toast(t('mappingRequired'), 'warning');
        return;
      }
      if (!state.mapping.quantity) {
        UI.toast(t('mappingRequired'), 'warning');
        return;
      }
      state.mapped = ExcelHelper.applyMapping(state.rows, state.mapping);
      state.step = 4;
    } else if (state.step === 4) {
      state.matched = state.mapped.map(function (row) {
        const m = ProductService.matchProduct({
          name: row.productName,
          code: row.productCode,
          barcode: row.barcode,
          strength: row.strength,
          form: row.form
        });
        return { row: row, product: m.product, confidence: m.confidence, warnings: m.warnings || [], alternatives: m.alternatives || [] };
      });
      state.step = 5;
    } else if (state.step === 5) {
      state.step = 6;
    }
    render();
  }

  function confirmImport() {
    const items = state.matched.filter(function (m) { return m.product && Number(m.row.quantity) > 0; }).map(function (m) {
      return {
        productId: m.product.id,
        requestedQty: Number(m.row.quantity),
        source: 'excel',
        urgency: 'high',
        notes: m.row.notes || ''
      };
    });
    if (!items.length) {
      UI.toast(t('noMatchingProducts'), 'warning');
      return;
    }
    ShortageService.addMany(items);
    UI.alert({ title: t('importSuccess'), text: items.length + ' ' + t('items'), icon: 'success' }).then(function () {
      location.href = 'shortages.html';
    });
  }

  render();
})();
