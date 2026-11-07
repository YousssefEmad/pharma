# PHARMA LINK — UI/UX Audit

**Date:** 2026-11-07  
**Scope:** Full existing frontend prototype (`pharma-link/`)  
**Goal:** Transform generic Bootstrap ERP look into a premium pharmaceutical SaaS identity.

---

## 1. Executive summary

The prototype is **functionally rich** but visually reads as a **standard Bootstrap admin template**: heavy navy sidebar, uniform cards, default Chart.js styling, dense tables with strong borders, and a persistent demo banner that competes with content. Hierarchy is flat; spacing is inconsistent; Arabic RTL works but feels like LTR mirrored rather than designed for Arabic.

**Verdict:** Preserve all JS/business logic. Replace the visual system (tokens, shell, components, dashboards, tables, forms, wizards) and refine responsive/RTL behavior.

---

## 2. Problems found

### Colors & identity
1. Primary navy used everywhere (sidebar, buttons, titles) → monotonous.
2. Accent teal appears inconsistently; soft tints feel “Tailwind default.”
3. Status badges overuse saturated colors; ordinary states look like alerts.
4. Logo uses a loud gradient that clashes with “trust/precision” brand.

### Typography
5. Single Cairo stack for AR/EN; English lacks Inter-like clarity.
6. Page titles (`1.45rem`) compete with KPIs; weak scale system.
7. Table headers muted gray but not uppercase/tracking for scanability.
8. Arabic line-height (~1.5) slightly tight for dense ERP content.

### Layout & shell
9. Sidebar 280px too wide on 1366px laptops; collapses abruptly.
10. Flat solid navy sidebar feels 2018 admin, not Linear/Stripe-grade.
11. Fixed demo banner steals 28px and pushes content oddly.
12. Header controls unevenly spaced; search pill looks generic.
13. No visual grouping depth between nav sections (flat list noise).
14. Active nav uses inset bar + teal wash — OK but not distinctive.

### Dashboards
15. KPI cards: icon-on-top Bootstrap cards; look interchangeable.
16. Too many KPIs (10) above the fold → cognitive overload.
17. Charts use default Chart.js colors/grids; legends bulky.
18. Widgets (tables + timeline) lack visual rhythm; equal weight everywhere.
19. No welcome/context strip tying user + org + date.

### Tables
20. Strong row borders create “grid paper” look.
21. Row height inconsistent; actions crowded.
22. Numeric columns not consistently end-aligned.
23. DataTables default chrome fights custom styles.
24. Mobile: only horizontal scroll — no card/list alternate for key flows.

### Forms & wizards
25. Inputs use Bootstrap defaults with light token overrides.
26. Select2 theme not fully aligned with design tokens.
27. Excel wizard steps are colored chips, not a clear progress stepper.
28. File drop zone is basic dashed box.

### Procurement UX
29. Offer comparison tables are long; best-offer highlight is only a green wash.
30. Allocation page is usable but policy labels show raw keys occasionally.
31. PO document layout is thin; not presentation-grade for print.

### Auth
32. Login split panel is decent but still template-like; right panel sparse.
33. Demo account cards rely on hover lift (decorative noise).

### RTL / LTR
34. Custom `me-*` / `ms-*` flips in `rtl.css` are incomplete vs Bootstrap utilities.
35. Dropdowns/end alignment need more explicit RTL testing.
36. Breadcrumb separators and chevrons not direction-aware everywhere.

### Responsive
37. Sidebar mobile drawer works; filter bars stack poorly.
38. KPI grids jump from 4→2→1 without intermediate density tuning.
39. Charts fixed heights can overflow small phones.
40. Proto banner + sticky header reduce usable height on mobile.

### Motion & polish
41. Few intentional transitions; hover lift on stats feels arbitrary.
42. Empty states are minimal text + icon — not guided.
43. Loading states are spinner-only.
44. No `prefers-reduced-motion` respect.

### Consistency
45. Mixed button classes (`btn-pl-primary`, outline, ghost) without clear hierarchy rules.
46. Page headers vary between modules (some miss descriptions).
47. Cards sometimes nested without purpose.

---

## 3. Proposed improvements (implementation plan)

| Area | Change |
|------|--------|
| Design tokens | New refined palette, spacing scale, radii, shadows, z-index |
| Typography | IBM Plex Sans Arabic + Inter; type scale; AR line-height 1.65 |
| Shell | Narrower sidebar, refined light/dark nav surface, compact header, quieter demo chip |
| KPIs | Compact metric rows with sparkline-ready structure, fewer above fold |
| Charts | Shared Chart.js defaults (palette, grid, tooltip, font) |
| Tables | Hairline separators, sticky headers, numeric end-align, quieter badges |
| Forms | Unified control height 40px, focus rings, sectioned forms |
| Import wizard | Horizontal stepper with progress track |
| Comparison/allocation | Stronger hierarchy, allocation bars, soft best-offer marker |
| Responsive | Drawer nav, KPI stacks, table→card patterns for key pages |
| RTL | Direction-aware shell, icons, breadcrumbs; full LTR parity |
| Docs | Audit, changelog, responsive QA, RTL QA, implementation report |

---

## 4. Non-goals (preserve)

- All LocalStorage services and seeded data
- Excel parse/export logic
- Allocation algorithm math
- Role permissions and routes
- Page inventory (no page removal)

---

## 5. Success criteria

Opening the app should feel like a **premium pharmaceutical SaaS**, not a Bootstrap demo: calm surfaces, sharp hierarchy, dense but readable tables, bilingual polish, and usable mobile workflows — with zero regression on core journeys.
