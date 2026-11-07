# PharmaLink — Design System

## Brand identity

Official mark: `assets/brand/pharmalink-mark.png` (do not redraw/recolor).  
Wordmark: **PharmaLink** paired with the mark in sidebar/header where space allows.  
Standalone mark: favicon, collapsed sidebar, mobile header.

## Official colors (`design-tokens.css`)

| Token | Value | Role |
|-------|-------|------|
| `--pl-brand-navy` | `#073C78` | Dominant — sidebar, dark surfaces |
| `--pl-brand-blue` | `#0879D8` | Dominant — primary CTAs, links, charts |
| `--pl-brand-teal` | `#12BFC0` | Accent only |
| `--pl-brand-bg` | `#F4F8FD` | App background |
| `--pl-brand-text` | `#172B4D` | Main text |
| `--pl-brand-success` | `#16A36A` | Success semantic |

Semantic green/orange/purple may appear in charts and status only — they must not compete with navy/blue.

## Typography

- **Arabic:** IBM Plex Sans Arabic + Cairo  
- **English:** Inter + IBM Plex Sans Arabic  
- Scale: xs 12 → sm 13 → md 14 → base 15 → lg 17 → xl 20 → 2xl 24  
- Arabic line-height: **1.7**

## Spacing / radii / shadows

Defined as `--pl-space-*`, `--pl-radius-*`, `--pl-shadow-*` in tokens. Never scatter brand hex in page CSS.

## Components

- **Buttons:** Primary blue · Accent teal · Outline · Ghost  
- **Inputs:** height 40px · blue focus ring  
- **Logo:** `object-fit: contain`, fixed square box, clear space via padding — never stretch

## Layout

- Sidebar **256px** (collapsed 72) — mark only when collapsed  
- Header **60px** — compact mark on ≤991px  
- Content max **1400px**
