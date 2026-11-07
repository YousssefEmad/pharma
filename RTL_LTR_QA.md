# PHARMA LINK — RTL / LTR QA

## Default

- Document `dir="rtl"` + Arabic (`lang="ar"`) via `I18n` / Layout.
- Cairo + Inter loaded; Cairo preferred for Arabic.

## Mechanisms

| Concern | Implementation |
|---------|----------------|
| Sidebar edge | Logical start (`inset-inline-start`) |
| Chevrons / arrows | `.rtl-flip` + `[dir="rtl"]` overrides in `rtl.css` |
| Demo chip | Start-edge placement under header |
| Forms | Labels/inputs inherit direction; Bootstrap RTL-friendly spacing via logical properties in tokens |
| Tables | Header/body align with `text-start` / logical CSS |

## Checks completed

| Check | Result |
|-------|--------|
| Arabic buyer dashboard labels (KPI, charts, allocation policy) | ✅ Fixed via i18n keys (no raw English policy strings) |
| Allocation result banner + totals | ✅ Arabic copy present |
| Sidebar brand + nav | ✅ RTL aligned |
| EN toggle click in browser | Skipped per request — LTR CSS rules present in `rtl.css` / tokens |

## LTR readiness (without live click)

- `[dir="ltr"]` rules flip sidebar, chevrons, and demo chip.
- Inter becomes primary when `lang` is English.
- Re-verify by clicking **EN** in header when needed; no code blocker expected.
