# PHARMA LINK — Responsive QA

## Breakpoints covered in CSS

| Range | Behavior |
|-------|----------|
| ≥1440 | Full sidebar 256px, content max 1400px |
| 1200–1439 | Slightly tighter content / search |
| ≤991 | Sidebar off-canvas drawer + backdrop; header compact |
| ≤767 | Search hidden; filters stack; charts shorter; auth visual hidden |
| ≤575 | Denser padding / KPI values |

## Manual checks performed

| Viewport intent | Pages | Result |
|-----------------|-------|--------|
| Desktop ~1440+ | Buyer dashboard, allocation | Shell + KPIs + charts render; no overflow |
| Tablet ≤991 | CSS drawer rules | Sidebar transforms off-canvas; main full width |
| Mobile ≤767 | CSS rules | Demo chip hidden; stacked filters; touch target bumps |

## Known limitations

- Dense ERP tables still use horizontal scroll on very small phones (card alternate class `.pl-table-responsive-cards` is available for future per-page opt-in).
- Full device-lab screenshot matrix (1920→360) not automated; visual verification was sample-based in browser + CSS review.

## How to re-test

1. `npm start` → DevTools device toolbar  
2. Login as buyer → dashboard / shortages / allocation / import  
3. Toggle 375 / 768 / 1366 / 1920  
4. Confirm no horizontal page scroll on body
