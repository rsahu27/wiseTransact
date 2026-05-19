# WiseTransact Mobile UI Kit

Click-through prototype of all 13 canonical screens from the Figma Make plugin.

## Run
Open `index.html`. Starts on Splash → Onboarding (5 steps) → Home with bottom tabs (Home / Transactions / Reports / Settings). The "+ Add Transaction" button + FAB lead to the form; submitting triggers the dedup bottom sheet.

## Files
- `tokens.css` — imports `../../colors_and_type.css` and adds component classes.
- `components/Icon.jsx` — Lucide-style inline SVG icon set.
- `components/Primitives.jsx` — `StatusBar`, `BackHeader`, `TabBar`, `ProgressDots`, `Toggle`, `Field`, `TxRow`.
- `screens/Onboarding.jsx` — Splash + 5 onboarding steps.
- `screens/Core.jsx` — Home, AddTx, TxList, TxDetail, Reports, Settings, DedupSheet.
- `App.jsx` — router.

## Coverage vs. PRD
| PRD section | Screen | Status |
|---|---|---|
| §6.1 Onboarding | Splash, Name, Accounts, Data warning, Disclaimer, Privacy | ✅ |
| §6.2 Home | Home | ✅ |
| §6.3 Add Transaction | AddTx | ✅ (paste-SMS banner, type toggle, all fields, purpose chips) |
| §6.6 Deduplication | DedupSheet | ✅ (all 3 actions) |
| §6.7 Transactions list | TxList | ✅ (filters, period picker stub, summary strip, grouped list) |
| §6.8 Transaction detail | TxDetail | ✅ |
| §6.9 Reports | Reports | ✅ (summary cards, monthly trend, category breakdown, disabled PDF CTA) |
| §6.10 Settings | Settings | ✅ (all sections) |

## Known cosmetic shortcuts
- Period picker is a non-functional stub (chevron only).
- Reports period dropdown does not switch data.
- Account, Date, Category fields on Add show empty pickers — no real picker.
- No real keyboard / SMS-paste parsing — the banner is decorative in the prototype.
- Status bar time is hard-coded `9:41`.
