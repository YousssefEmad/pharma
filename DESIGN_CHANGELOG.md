# PHARMA LINK — Design Changelog

## Visual identity
- Replaced flat “Bootstrap admin” look with tokenized pharmaceutical SaaS system.
- New palette: midnight navy, cobalt blue, teal accent, soft neutrals.
- Softer shadows, tighter radii, quieter borders.

## Design system files
- **Added:** `design-tokens.css`, `typography.css`, `layout.css`
- **Rewrote:** `style.css`, `components.css`, `responsive.css`, `rtl.css`
- **Added:** `chart-theme.js` (Chart.js global defaults)

## Application shell
- Sidebar width 256px; refined dark gradient surface; teal active indicator.
- Sticky frosted header; compact demo chip replaces full-width banner.
- Improved brand mark, search, user chip, notification dropdown spacing.

## Dashboards
- Buyer dashboard: welcome strip → 4 primary KPIs → compact secondary metrics → charts → operational widgets.
- Chart theme: soft fills, rounded bars, doughnut cutout, quieter grids.
- Supplier/admin dashboards apply shared chart theme.

## Tables & forms
- Uppercase micro headers, hairline dividers, tabular numeric cells.
- Quieter badges with soft borders.
- Unified control height and focus rings.
- Excel wizard: border-bottom stepper (progress track style).
- File drop zone: elevated icon tile + soft gradient.

## Procurement polish
- Allocation policy labels mapped to i18n keys (no raw `maxPriceDiffPct`).
- Allocation UI inherits new card/table/stat styling.

## Auth
- Login / demo accounts inherit new tokens, surfaces, and demo card hover (border, not lift).

## Responsive & RTL
- Drawer sidebar under 992px; frosted backdrop.
- Mobile filter stacking; chart height tuning; optional table→card hooks.
- RTL utility flips + logical properties for numeric alignment.
- `prefers-reduced-motion` supported.

## Functionality
- **No business logic removed.** Services, LocalStorage, Excel, allocation math, roles preserved.
