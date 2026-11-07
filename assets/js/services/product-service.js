/**
 * PHARMA LINK — Product & Catalog Service + Matching
 */
window.ProductService = (function () {
  function list(filters) {
    const f = filters || {};
    let items = DataAPI.data().products.filter(function (p) { return !p.archived || f.includeArchived; });
    if (f.q) {
      const q = String(f.q).toLowerCase().trim();
      items = items.filter(function (p) {
        return [p.nameAr, p.nameEn, p.scientific, p.ingredient, p.barcode, p.code, p.manufacturer, p.category]
          .join(' ').toLowerCase().indexOf(q) !== -1;
      });
    }
    if (f.category) items = items.filter(function (p) { return p.category === f.category; });
    if (f.manufacturer) items = items.filter(function (p) { return p.manufacturer === f.manufacturer; });
    return items;
  }

  function get(id) { return DataAPI.findProduct(id); }

  function saveProduct(payload) {
    const isNew = !payload.id;
    DataAPI.save(function (d) {
      if (isNew) {
        d.counters.product = (d.counters.product || d.products.length) + 1;
        payload.id = 'PRD-' + String(d.counters.product).padStart(3, '0');
        payload.active = true;
        payload.archived = false;
        d.products.push(payload);
      } else {
        const idx = d.products.findIndex(function (p) { return p.id === payload.id; });
        if (idx >= 0) d.products[idx] = Object.assign({}, d.products[idx], payload);
      }
      return d;
    });
    return get(payload.id);
  }

  function archive(id) {
    DataAPI.save(function (d) {
      const p = d.products.find(function (x) { return x.id === id; });
      if (p) p.archived = true;
      return d;
    });
  }

  /**
   * Product matching — barcode > code > exact name > fuzzy name with strength/form/pack checks
   */
  function matchProduct(row) {
    const products = DataAPI.data().products.filter(function (p) { return !p.archived; });
    const barcode = (row.barcode || '').toString().trim();
    const code = (row.code || row.productCode || '').toString().trim().toLowerCase();
    const name = (row.name || row.productName || '').toString().trim().toLowerCase();

    if (barcode) {
      const byBc = products.find(function (p) { return p.barcode === barcode; });
      if (byBc) return { product: byBc, confidence: 'exact', matchType: 'barcode', warnings: [] };
    }
    if (code) {
      const byCode = products.find(function (p) { return (p.code || '').toLowerCase() === code; });
      if (byCode) return { product: byCode, confidence: 'exact', matchType: 'code', warnings: [] };
    }

    if (name) {
      const exact = products.find(function (p) {
        return p.nameAr.toLowerCase() === name || (p.nameEn || '').toLowerCase() === name;
      });
      if (exact) {
        return { product: exact, confidence: 'high', matchType: 'name', warnings: strengthWarnings(row, exact) };
      }

      // Partial name candidates
      const candidates = products.filter(function (p) {
        const na = p.nameAr.toLowerCase();
        const ne = (p.nameEn || '').toLowerCase();
        return na.indexOf(name) !== -1 || name.indexOf(na) !== -1 || ne.indexOf(name) !== -1 || name.indexOf(ne) !== -1
          || (p.scientific || '').toLowerCase().indexOf(name) !== -1;
      }).slice(0, 5);

      if (candidates.length === 1) {
        return { product: candidates[0], confidence: 'medium', matchType: 'fuzzy', warnings: strengthWarnings(row, candidates[0]), alternatives: [] };
      }
      if (candidates.length > 1) {
        return { product: null, confidence: 'ambiguous', matchType: 'fuzzy', warnings: [], alternatives: candidates };
      }
    }

    return { product: null, confidence: 'none', matchType: 'none', warnings: [], alternatives: [] };
  }

  function strengthWarnings(row, product) {
    const warnings = [];
    const rs = (row.strength || '').toString().toLowerCase().replace(/\s/g, '');
    const ps = (product.strength || '').toString().toLowerCase().replace(/\s/g, '');
    if (rs && ps && rs !== ps && rs !== '—' && ps !== '—') {
      warnings.push({ type: 'strength', message: 'mismatchWarning' });
    }
    const rf = (row.form || row.dosageForm || '').toString().toLowerCase();
    const pf = (product.form || '').toString().toLowerCase();
    if (rf && pf && rf !== pf && (product.formEn || '').toLowerCase() !== rf) {
      warnings.push({ type: 'form', message: 'mismatchWarning' });
    }
    const rp = (row.pack || row.packageSize || '').toString().toLowerCase().replace(/\s/g, '');
    const pp = (product.pack || '').toString().toLowerCase().replace(/\s/g, '');
    if (rp && pp && rp !== pp) {
      warnings.push({ type: 'pack', message: 'mismatchWarning' });
    }
    return warnings;
  }

  /**
   * Map common Excel column headers (AR/EN) to system fields
   */
  const COLUMN_ALIASES = {
    productName: ['اسم الصنف', 'الصنف', 'اسم المنتج', 'product name', 'item name', 'product', 'item', 'name', 'الصنف الدوائي'],
    productCode: ['كود الصنف', 'الكود', 'product code', 'item code', 'code', 'sku'],
    barcode: ['الباركود', 'باركود', 'barcode', 'ean', 'gtin'],
    quantity: ['الكمية', 'العدد', 'qty', 'quantity', 'requested qty', 'الكمية المطلوبة'],
    unit: ['الوحدة', 'unit', 'uom'],
    notes: ['ملاحظات', 'notes', 'note', 'remarks'],
    unitPrice: ['سعر الوحدة', 'السعر', 'unit price', 'price', 'سعر'],
    discount: ['الخصم', 'نسبة الخصم', 'discount', 'discount %', 'خصم %'],
    availableQty: ['الكمية المتاحة', 'متاح', 'available', 'available qty', 'available quantity'],
    committedQty: ['الكمية الملتزم بها', 'ملتزم', 'committed', 'committed qty'],
    deliveryTime: ['مدة التوريد', 'التوريد', 'delivery', 'delivery time', 'delivery days', 'أيام التوريد'],
    expiryDate: ['صلاحية العرض', 'تاريخ الصلاحية', 'expiry', 'expiration', 'offer expiry'],
    strength: ['التركيز', 'strength', 'dose'],
    form: ['الشكل', 'الشكل الصيدلاني', 'form', 'dosage form'],
    manufacturer: ['الشركة', 'الشركة المنتجة', 'manufacturer', 'company']
  };

  function suggestColumnMapping(headers) {
    const mapping = {};
    const used = {};
    Object.keys(COLUMN_ALIASES).forEach(function (field) {
      const aliases = COLUMN_ALIASES[field];
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').trim().toLowerCase();
        if (used[i]) continue;
        for (let a = 0; a < aliases.length; a++) {
          if (h === aliases[a].toLowerCase() || h.indexOf(aliases[a].toLowerCase()) !== -1) {
            mapping[field] = headers[i];
            used[i] = true;
            return;
          }
        }
      }
    });
    return mapping;
  }

  function categories() {
    return DataAPI.data().categories.slice();
  }

  return { list, get, saveProduct, archive, matchProduct, suggestColumnMapping, COLUMN_ALIASES, categories, strengthWarnings };
})();
