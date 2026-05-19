# WiseTransact — Iconography

The PRD (§11.5) specifies: **outline / line icons via a standard library (e.g., Lucide, Phosphor), tinted with the primary brand color. Custom illustrations out of scope for MVP.**

## Library: Lucide (CDN)

Use [Lucide Icons](https://lucide.dev) via the official ESM CDN. No font, no sprite checked in — keeps install size lean (PRD §9.3 caps at 30 MB).

```html
<!-- in <head> -->
<script type="module" src="https://cdn.jsdelivr.net/npm/lucide@0.469.0/+esm"></script>
```

Or inline SVG by copy-paste from lucide.dev when a single screen only needs 2–3 icons (preferred for production Flutter — bundle the SVGs).

### Spec
- **Size**: 24×24 default. 20×20 for inline-row use. 16×16 for chips.
- **Stroke**: `1.5px` (Lucide default). Never change.
- **Color**: `currentColor`. Tint via CSS `color:` on parent.
- **Tap target**: always at least 44×44 (PRD §9.4) — pad the parent button, not the icon.

### Canonical icon mapping

| Surface | Icon name |
|---|---|
| Bottom nav — Home | `home` |
| Bottom nav — Transactions | `list` |
| Bottom nav — Reports | `bar-chart-3` |
| Bottom nav — Settings | `settings` |
| Add Transaction FAB | `plus` |
| Back button | `chevron-left` |
| Search | `search` |
| Filter / view toggle | `sliders-horizontal` |
| Period picker chevron | `chevron-down` |
| List-row affordance | `chevron-right` |
| Edit | `pencil` |
| Delete | `trash-2` |
| Share PDF | `share-2` |
| Download PDF | `download` |
| Paste SMS | `clipboard-paste` |
| Income marker | `arrow-down-left` (incoming) |
| Expense marker | `arrow-up-right` (outgoing) |
| Transfer marker | `arrow-left-right` |
| Warning / data-loss | `alert-triangle` |
| Disclaimer / "not advice" | `scale` |
| Privacy / opt-out | `shield-check` |
| Account chip | `wallet` |
| Category chip | `tag` |

## Emoji policy

Two intentional uses only:

1. **`📋` clipboard glyph** on the Paste-SMS banner (Add Transaction screen). It's there because users learn this affordance from messaging apps — the muscle memory matters more than the visual purity.
2. **No other emoji.** Specifically: no flag, no money-with-wings, no party popper, no thumbs-up, no fire, no sparkles. The app does not celebrate transactions.

## Unicode glyphs

A handful of typographic glyphs are used as **separators or affordances**, not as icons:
- `·` (middle dot, U+00B7) — soft separator in metadata strings.
- `→` `←` (arrows) — only inside button labels like "See all →" and "← Back". Real chevron icons replace these in production.
- `▾` (down-pointing small triangle) — picker affordance inside text fields. In production, replaced with `chevron-down` icon.
- `₹` (Indian rupee, U+20B9) — always before amounts, no space.

## Logos

- `logo.svg` — emerald-on-white W-mark, 88×88 viewBox, used on Splash and About.
- `logo-mono.svg` — single-color (currentColor) W-mark for tinting on dark backgrounds.

> If a richer mark is designed in the WiseTransact Brand Document (PRD §11.3 says it's owned by Rishi), drop the new SVG into `assets/` and update both this doc and the splash screen.

**Substitution flag:** Lucide is used as a stand-in because the PRD does not name a specific library. If WiseTransact ships with a different choice (e.g. Phosphor), replace the CDN reference and re-render preview/tab-bar.html.
