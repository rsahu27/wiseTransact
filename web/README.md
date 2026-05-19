# WiseTransact Web App

Desktop / browser layout of WiseTransact. Reuses tokens (`colors_and_type.css`), icons (`ui_kits/mobile_app/components/Icon.jsx`), and the shared transactions / accounts store (`ui_kits/mobile_app/store.jsx`).

## Run
Open `web/index.html` in a browser. State persists to `localStorage` under the same keys as the mobile click-thru, so data is shared between the two builds.

## Layout
- **Sidebar (248px)** — brand lockup, nav (Dashboard, Transactions, Reports, Settings), user chip at bottom.
- **Topbar (64px)** — breadcrumb, period picker, "+ Add Transaction" CTA.
- **Main canvas** — page-specific.

## Pages
| Page | What it shows |
|---|---|
| Dashboard | 3 KPI cards · Recent Transactions table · Monthly trend mini-chart |
| Transactions | Full table · filter chips · click row → detail modal |
| Reports | Bigger KPIs · monthly trend · category breakdown · disabled PDF CTA (FY-only per PRD §6.9) |
| Settings | Profile · Accounts (CRUD) · Privacy toggles · Legal |

## Files
- `index.html` — entry
- `web.css` — desktop layout (reuses `colors_and_type.css` tokens)
- `components.jsx` — Sidebar, Topbar, KPI, Table, ConfirmDialog, AccountSheet
- `screens.jsx` — Dashboard, TransactionsPage, ReportsPage, SettingsPage, AddTxModal, DetailModal
- `App.jsx` — router + state lift

## Behavior carried over from mobile
- Live totals — Income / Expenses / Net update when you add or delete a transaction.
- Delete from detail modal → confirmation dialog → live total update.
- Add Transaction modal mirrors the mobile form: SMS textarea, account/date/category/mode pickers, purpose chips, notes.
- Accounts CRUD on Settings — same store as onboarding in the mobile build.
