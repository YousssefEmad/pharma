/**
 * PHARMA LINK — Deterministic Smart Allocation Engine
 */
window.AllocationService = (function () {
  function netPrice(item) {
    if (item.netUnitPrice != null) return Number(item.netUnitPrice);
    const price = Number(item.unitPrice) || 0;
    const disc = Number(item.discountPct) || 0;
    return Math.round(price * (1 - disc / 100) * 100) / 100;
  }

  function isOfferExpired(offerItem, offer) {
    const exp = offerItem.expiryDate || offer.offerExpiry;
    if (!exp) return false;
    return new Date(exp) < new Date(new Date().toDateString());
  }

  /**
   * Allocate requested quantities across eligible supplier offers.
   * Rules are deterministic — sort by effective cost ascending, fill greedily.
   */
  function allocate(request, offers, policies) {
    const pol = Object.assign({
      maxSuppliersPerProduct: 5,
      maxPriceDiffPct: 100,
      allowPartial: true,
      preferredSuppliers: [],
      maxPurchaseAmount: 0,
      minFulfillmentPct: 0,
      maxConcentrationPct: 100,
      shippingBySupplier: {}
    }, policies || {});

    const submitted = (offers || []).filter(function (o) { return o.status === 'submitted' && o.requestId === request.id; });
    const productResults = [];
    const allLines = [];
    const warnings = [];
    const excluded = [];

    (request.items || []).forEach(function (reqItem) {
      const productId = reqItem.productId;
      const requestedQty = Number(reqItem.qty) || 0;
      const candidates = [];

      submitted.forEach(function (offer) {
        (offer.items || []).forEach(function (oi) {
          if (oi.productId !== productId) return;
          const reason = [];
          if (!(Number(oi.unitPrice) > 0) && !(Number(oi.netUnitPrice) > 0)) reason.push('invalidOffers');
          if (isOfferExpired(oi, offer)) reason.push('expiredOffers');
          const avail = Number(oi.committedQty != null ? oi.committedQty : oi.availableQty) || 0;
          if (avail <= 0) reason.push('unavailableQty');

          const np = netPrice(oi);
          const ship = Number((pol.shippingBySupplier[offer.supplierOrgId] || 0));
          const effective = np + (ship / Math.max(avail, 1));

          if (reason.length) {
            excluded.push({
              productId: productId,
              supplierOrgId: offer.supplierOrgId,
              offerId: offer.id,
              reasons: reason,
              unitPrice: oi.unitPrice,
              netUnitPrice: np,
              availableQty: avail
            });
            return;
          }

          candidates.push({
            offerId: offer.id,
            supplierOrgId: offer.supplierOrgId,
            unitPrice: Number(oi.unitPrice) || np,
            discountPct: Number(oi.discountPct) || 0,
            netUnitPrice: np,
            availableQty: avail,
            deliveryDays: oi.deliveryDays || 0,
            effectiveCost: effective,
            preferred: pol.preferredSuppliers.indexOf(offer.supplierOrgId) !== -1
          });
        });
      });

      // Sort: effective cost ASC, preferred first on tie, then delivery days
      candidates.sort(function (a, b) {
        if (a.effectiveCost !== b.effectiveCost) return a.effectiveCost - b.effectiveCost;
        if (a.preferred !== b.preferred) return a.preferred ? -1 : 1;
        return (a.deliveryDays || 0) - (b.deliveryDays || 0);
      });

      // Max price difference filter vs best
      let eligible = candidates.slice();
      if (eligible.length && pol.maxPriceDiffPct < 100) {
        const best = eligible[0].netUnitPrice;
        eligible = eligible.filter(function (c) {
          const diff = best === 0 ? 0 : ((c.netUnitPrice - best) / best) * 100;
          if (diff > pol.maxPriceDiffPct) {
            excluded.push({
              productId: productId,
              supplierOrgId: c.supplierOrgId,
              offerId: c.offerId,
              reasons: ['maxPriceDiff'],
              unitPrice: c.unitPrice,
              netUnitPrice: c.netUnitPrice,
              availableQty: c.availableQty
            });
            return false;
          }
          return true;
        });
      }

      let remaining = requestedQty;
      const lines = [];
      let suppliersUsed = 0;

      for (let i = 0; i < eligible.length && remaining > 0; i++) {
        if (suppliersUsed >= pol.maxSuppliersPerProduct) break;
        const c = eligible[i];
        const take = Math.min(remaining, c.availableQty);
        if (take <= 0) continue;
        const lineCost = Math.round(take * c.netUnitPrice * 100) / 100;
        lines.push({
          productId: productId,
          supplierOrgId: c.supplierOrgId,
          offerId: c.offerId,
          qty: take,
          unitPrice: c.unitPrice,
          discountPct: c.discountPct,
          netUnitPrice: c.netUnitPrice,
          deliveryDays: c.deliveryDays,
          lineCost: lineCost,
          best: i === 0
        });
        remaining -= take;
        suppliersUsed += 1;
      }

      // Concentration check
      if (pol.maxConcentrationPct < 100 && requestedQty > 0) {
        lines.forEach(function (ln) {
          const pct = (ln.qty / requestedQty) * 100;
          if (pct > pol.maxConcentrationPct) {
            warnings.push({
              type: 'concentration',
              productId: productId,
              supplierOrgId: ln.supplierOrgId,
              value: pct
            });
          }
        });
      }

      const allocatedQty = requestedQty - remaining;
      const productCost = lines.reduce(function (s, l) { return s + l.lineCost; }, 0);
      const fulfillment = requestedQty ? Math.round((allocatedQty / requestedQty) * 1000) / 10 : 0;

      if (!pol.allowPartial && remaining > 0) {
        warnings.push({ type: 'partial_not_allowed', productId: productId, uncovered: remaining });
      }
      if (fulfillment < pol.minFulfillmentPct) {
        warnings.push({ type: 'min_fulfillment', productId: productId, fulfillment: fulfillment });
      }

      productResults.push({
        productId: productId,
        requestedQty: requestedQty,
        allocatedQty: allocatedQty,
        uncoveredQty: remaining,
        fulfillmentPct: fulfillment,
        totalCost: productCost,
        lines: lines,
        eligibleCount: eligible.length,
        candidateCount: candidates.length
      });

      lines.forEach(function (l) { allLines.push(l); });
    });

    const totalCost = allLines.reduce(function (s, l) { return s + l.lineCost; }, 0);
    if (pol.maxPurchaseAmount > 0 && totalCost > pol.maxPurchaseAmount) {
      warnings.push({ type: 'max_purchase_amount', totalCost: totalCost, limit: pol.maxPurchaseAmount });
    }

    // Reference savings: vs highest net among eligible per product (simple demo metric)
    let refCost = 0;
    productResults.forEach(function (pr) {
      const req = request.items.find(function (i) { return i.productId === pr.productId; });
      const related = submitted.flatMap(function (o) {
        return (o.items || []).filter(function (i) { return i.productId === pr.productId; }).map(function (i) { return netPrice(i); });
      });
      const maxP = related.length ? Math.max.apply(null, related) : 0;
      refCost += maxP * ((req && req.qty) || 0);
    });
    const savings = Math.max(0, Math.round((refCost - totalCost) * 100) / 100);

    const supplierDistribution = {};
    allLines.forEach(function (l) {
      supplierDistribution[l.supplierOrgId] = supplierDistribution[l.supplierOrgId] || { qty: 0, cost: 0 };
      supplierDistribution[l.supplierOrgId].qty += l.qty;
      supplierDistribution[l.supplierOrgId].cost += l.lineCost;
    });

    const totalRequested = (request.items || []).reduce(function (s, i) { return s + (Number(i.qty) || 0); }, 0);
    const totalAllocated = allLines.reduce(function (s, l) { return s + l.qty; }, 0);

    return {
      requestId: request.id,
      lines: allLines,
      byProduct: productResults,
      excluded: excluded,
      warnings: warnings,
      totals: {
        totalCost: Math.round(totalCost * 100) / 100,
        referenceCost: Math.round(refCost * 100) / 100,
        savings: savings,
        totalRequested: totalRequested,
        totalAllocated: totalAllocated,
        fulfillmentPct: totalRequested ? Math.round((totalAllocated / totalRequested) * 1000) / 10 : 0
      },
      supplierDistribution: supplierDistribution,
      policies: pol
    };
  }

  function saveAllocation(result, status) {
    let id = null;
    DataAPI.save(function (d) {
      const existing = d.allocations.findIndex(function (a) { return a.requestId === result.requestId && a.status === 'draft'; });
      const record = {
        id: existing >= 0 ? d.allocations[existing].id : 'ALC-' + String((d.counters.allocation = (d.counters.allocation || 0) + 1)).padStart(3, '0'),
        requestId: result.requestId,
        status: status || 'draft',
        createdAt: new Date().toISOString(),
        policies: result.policies,
        lines: result.lines,
        totals: result.totals,
        byProduct: result.byProduct,
        warnings: result.warnings
      };
      if (existing >= 0) d.allocations[existing] = record;
      else d.allocations.push(record);
      id = record.id;
      return d;
    });
    return id;
  }

  function recalculateFromLines(request, lines) {
    const byProduct = {};
    (request.items || []).forEach(function (it) {
      byProduct[it.productId] = {
        productId: it.productId,
        requestedQty: Number(it.qty) || 0,
        allocatedQty: 0,
        uncoveredQty: 0,
        totalCost: 0,
        lines: []
      };
    });
    (lines || []).forEach(function (l) {
      const np = Number(l.netUnitPrice);
      const qty = Number(l.qty) || 0;
      const lineCost = Math.round(np * qty * 100) / 100;
      l.lineCost = lineCost;
      if (!byProduct[l.productId]) {
        byProduct[l.productId] = { productId: l.productId, requestedQty: 0, allocatedQty: 0, uncoveredQty: 0, totalCost: 0, lines: [] };
      }
      byProduct[l.productId].allocatedQty += qty;
      byProduct[l.productId].totalCost += lineCost;
      byProduct[l.productId].lines.push(l);
    });
    Object.keys(byProduct).forEach(function (pid) {
      const p = byProduct[pid];
      p.uncoveredQty = Math.max(0, p.requestedQty - p.allocatedQty);
      p.fulfillmentPct = p.requestedQty ? Math.round((p.allocatedQty / p.requestedQty) * 1000) / 10 : 0;
    });
    const allLines = lines || [];
    const totalCost = allLines.reduce(function (s, l) { return s + (l.lineCost || 0); }, 0);
    const totalRequested = (request.items || []).reduce(function (s, i) { return s + (Number(i.qty) || 0); }, 0);
    const totalAllocated = allLines.reduce(function (s, l) { return s + (Number(l.qty) || 0); }, 0);
    const supplierDistribution = {};
    allLines.forEach(function (l) {
      supplierDistribution[l.supplierOrgId] = supplierDistribution[l.supplierOrgId] || { qty: 0, cost: 0 };
      supplierDistribution[l.supplierOrgId].qty += Number(l.qty) || 0;
      supplierDistribution[l.supplierOrgId].cost += l.lineCost || 0;
    });
    return {
      requestId: request.id,
      lines: allLines,
      byProduct: Object.keys(byProduct).map(function (k) { return byProduct[k]; }),
      totals: {
        totalCost: Math.round(totalCost * 100) / 100,
        totalRequested: totalRequested,
        totalAllocated: totalAllocated,
        fulfillmentPct: totalRequested ? Math.round((totalAllocated / totalRequested) * 1000) / 10 : 0,
        savings: 0
      },
      supplierDistribution: supplierDistribution
    };
  }

  return { allocate, saveAllocation, recalculateFromLines, netPrice };
})();
