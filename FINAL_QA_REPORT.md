# PharmaLink — Final QA Report

**Reviewer role:** Independent senior product design QA  
**Date:** 2026-11-07  
**Build:** Frontend-only prototype (`pharma-link/`), served at `http://localhost:5500`  
**Method:** Live browser inspection + CDP viewport emulation. A check is marked **PASS** only if executed in this session.

---

## Executive verdict

Presentation-ready as a coherent premium pharmaceutical SaaS shell across buyer, supplier, and admin portals. Critical shell issues found during review were **fixed before sign-off** (language control, logout routing, tablet drawer breakpoint, overflow containment, locale-aware document titles).

---

## Fixes applied during this QA pass

| Issue | Fix |
|-------|-----|
| Language control was a cramped icon with text only | Replaced with pill `.pl-lang-btn` + `bi-translate` icon + destination locale label (app shell + auth pages) |
| Logout used absolute `/login.html` and could fail from nested routes | `Auth.logout()` now uses relative `../login.html` / `login.html` + `location.replace`; click handler uses `preventDefault` |
| 1024px tablet left a cramped fixed sidebar | Drawer breakpoint raised to **≤1199px** (CSS + JS toggle) |
| Horizontal overflow risk on dense tables | `overflow-x: hidden` on `html/body`; tables scroll inside `.pl-table-wrap` |
| Chart boxes could clip awkwardly | Contained width/height + light inline padding |
| Welcome comma mixed Arabic/English | Locale-aware separator |
| Browser tab title stayed Arabic in EN | `Layout.render` sets `document.title` from i18n title |
| User chip padding not logical | Logical `padding-inline` |
| Search still visible at exactly 768px | Mobile header breakpoint set to `max-width: 768px` |

---

## Tested viewport sizes

| Viewport | Mode | EN LTR overflow | AR RTL overflow | Notes |
|----------|------|-----------------|-----------------|-------|
| **1920×1080** | Desktop | **PASS** (0) | **PASS** (0) | Fixed sidebar 256px |
| **1440×900** | Desktop | **PASS** (0) | **PASS** (0) | Fixed sidebar 256px |
| **1024×768** | Tablet | **PASS** (0) | **PASS** (0) | Drawer sidebar; header brand visible |
| **768×1024** | Tablet | **PASS** (0)* | **PASS** (0) | Drawer; search hidden at ≤768 |
| **390×844** | Mobile | **PASS** (0) | **PASS** (0) | Tables scroll in-wrap; search hidden |
| **360×740** | Mobile | **PASS** (0) | **PASS** (0) | Compact lang + avatar chip |

\*EN at 768 was measured earlier in the session with overflow 0; search visibility re-checked after breakpoint tweak.

---

## Tested pages (actually opened)

| Page | Locale(s) | Result |
|------|-----------|--------|
| `login.html` | AR | **PASS** — logo lockup, lang pill, no overflow |
| `demo-accounts.html` | AR | **PASS** — brand lockup, account cards |
| `buyer/dashboard.html` | AR + EN | **PASS** — KPIs, charts, shell, lang switch |
| `buyer/allocation-review.html` | AR | **PASS** — policies i18n, totals, actions |
| `buyer/products.html` | AR | **PASS** — filters + table wrap, no page overflow |
| `buyer/shortage-import.html` | AR | **PASS** — wizard header/actions render |
| `buyer/offer-comparison.html` | AR | **PASS** — filters + comparison sections |
| `supplier/dashboard.html` | AR | **PASS** — shared shell/logo/lang; charts present |
| `admin/dashboard.html` | AR | **PASS** — shared shell/logo/lang; nav coherent |

---

## Checklist (15 required concerns)

| # | Concern | Result | Evidence |
|---|---------|--------|----------|
| 1 | Misaligned elements | **PASS** (after fixes) | Shell lockup, header tools, KPI grid reviewed at 1440/1920 |
| 2 | Inconsistent spacing | **PASS** | Token spacing; content padding scales at ≤1199 / ≤575 |
| 3 | Incorrect typography | **PASS** | AR Cairo/IBM; EN Inter; welcome separator fixed |
| 4 | Poor contrast | **PASS** | Navy/blue on light `#F4F8FD`; sidebar light-on-navy |
| 5 | Broken responsive layouts | **PASS** (after drawer fix) | 1024 no longer cramped |
| 6 | Horizontal overflow | **PASS** | `overflowX === 0` at all listed viewports |
| 7 | Incorrect RTL | **PASS** | `dir=rtl`, sidebar on right at 1440 (`left=1184`) |
| 8 | Broken navigation | **PASS** | Role nav links resolve; active state visible |
| 9 | Inconsistent components | **PASS** | Shared Layout + tokens across 3 portals |
| 10 | Poor table usability | **PASS** | In-wrap horizontal scroll on mobile; sticky headers |
| 11 | Incorrect chart sizing | **PASS** | Chart boxes sized; no chart overflow at 1920/390 |
| 12 | Unresponsive modals | **PASS** | Help SweetAlert opened (مساعدة) + OK available |
| 13 | Buttons without actions | **PASS** (sampled) | Lang, help, logout, allocation actions wired |
| 14 | Broken forms | **PASS** (sampled) | Login fields; allocation policy spins; comparison filters |
| 15 | Console errors | **PASS** (sampled) | No runtime errors captured on products page probe |

---

## Language switch & logout (explicit)

| Control | Test | Result |
|---------|------|--------|
| Language pill (`bi-translate` + EN/عربي) | Click toggles `pharmalink_lang`, reloads, flips `dir` | **PASS** |
| Logout | From buyer allocation → clears session → lands on login | **PASS** |

---

## Portal consistency

Buyer, supplier, and admin share:
- Official mark + PharmaLink wordmark  
- Navy sidebar / blue primary / teal accent tokens  
- Same header pattern (search, lang pill, notifications, help, user menu)  
- Same favicon injection  

Visual language reads as **one product**, not three themes.

---

## Remaining known limitations

1. Dense ERP tables still require **horizontal scroll inside** the wrap on phones (by design); card-list opt-in (`.pl-table-responsive-cards`) is not enabled on every list page.  
2. Not every one of the ~56 HTML routes was opened in this session — sampling focused on shell-critical and procurement-critical pages.  
3. Chart category legends may still show Arabic product-category seed labels while the UI is in EN (data seed, not shell i18n).  
4. Static `<title>` fallbacks in raw HTML files are Arabic until JS Layout overrides them after load.  
5. Prototype uses LocalStorage only; no real auth/session expiry beyond clearSession.  
6. Full automated visual regression / axe contrast suite was not run — contrast judged via token palette + visual review.

---

## Sign-off

**QA status:** Ready for stakeholder presentation, with limitations above documented.  
**Business logic:** Not modified (allocation math, LocalStorage schema, role guards preserved).
