/**
 * PHARMA LINK — SheetJS Excel Import / Export helpers
 */
window.ExcelHelper = (function () {
  function readFile(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return reject(new Error('fileRequired'));
      const name = (file.name || '').toLowerCase();
      if (!/\.(xlsx|xls|csv)$/.test(name)) return reject(new Error('unsupportedFile'));
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          resolve(wb);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = function () { reject(new Error('fileRequired')); };
      reader.readAsArrayBuffer(file);
    });
  }

  function sheetNames(wb) {
    return wb.SheetNames || [];
  }

  function sheetToJson(wb, sheetName) {
    const sheet = wb.Sheets[sheetName || wb.SheetNames[0]];
    if (!sheet) return [];
    return XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  }

  function sheetHeaders(wb, sheetName) {
    const sheet = wb.Sheets[sheetName || wb.SheetNames[0]];
    if (!sheet) return [];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    return (rows[0] || []).map(function (h) { return String(h).trim(); }).filter(Boolean);
  }

  function applyMapping(rows, mapping) {
    // mapping: { systemField: headerName }
    return rows.map(function (row, idx) {
      const out = { _row: idx + 2 };
      Object.keys(mapping).forEach(function (field) {
        const col = mapping[field];
        if (col && col !== '__skip__') out[field] = row[col];
      });
      return out;
    });
  }

  function exportAoA(filename, headers, rows) {
    const aoa = [headers].concat(rows);
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, filename);
  }

  function exportObjects(filename, objects, columns) {
    // columns: [{ key, header }]
    const headers = columns.map(function (c) { return c.header; });
    const rows = objects.map(function (obj) {
      return columns.map(function (c) { return obj[c.key] != null ? obj[c.key] : ''; });
    });
    exportAoA(filename, headers, rows);
  }

  function downloadShortageTemplate() {
    exportAoA('pharma-link-shortage-template.xlsx',
      ['اسم الصنف', 'كود الصنف', 'الباركود', 'الكمية', 'الوحدة', 'ملاحظات'],
      [
        ['أوجمنتين 1 جم', 'AUG-1G-14', '6224000123001', 100, 'علبة', 'عاجل'],
        ['بلاتكس 75 مجم', 'PLA-75-28', '6224000123005', 50, 'علبة', ''],
        ['أوميبرازول 20 مجم', 'OME-20-14', '6224000123014', 80, 'علبة', ''],
        ['Unknown Product XYZ', '', '', 20, 'علبة', 'للمطابقة اليدوية']
      ]
    );
  }

  function downloadOfferTemplate() {
    exportAoA('pharma-link-offer-template.xlsx',
      ['اسم الصنف', 'كود الصنف', 'الباركود', 'سعر الوحدة', 'الخصم', 'الكمية المتاحة', 'الكمية الملتزم بها', 'مدة التوريد', 'صلاحية العرض'],
      [
        ['أوجمنتين 1 جم', 'AUG-1G-14', '6224000123001', 140, 5, 80, 80, 3, ''],
        ['بلاتكس 75 مجم', 'PLA-75-28', '6224000123005', 310, 3, 40, 40, 5, '']
      ]
    );
  }

  function downloadCatalogTemplate() {
    exportAoA('pharma-link-catalog-template.xlsx',
      ['اسم الصنف', 'الاسم العلمي', 'المادة الفعالة', 'التركيز', 'الشكل الصيدلاني', 'العبوة', 'الباركود', 'كود الصنف', 'الشركة المنتجة', 'التصنيف'],
      [
        ['منتج تجريبي', 'Demo Scientific', 'مادة', '500mg', 'أقراص', '20 قرص', '6224999999999', 'DEMO-001', 'شركة تجريبية', 'مسكنات']
      ]
    );
  }

  return {
    readFile, sheetNames, sheetToJson, sheetHeaders, applyMapping,
    exportAoA, exportObjects,
    downloadShortageTemplate, downloadOfferTemplate, downloadCatalogTemplate
  };
})();
