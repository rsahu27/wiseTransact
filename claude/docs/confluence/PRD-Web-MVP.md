# WiseTransact — Product Requirements Document (Web MVP)

> **Document status:** DRAFT v2.0  |  **Last updated:** 6 May 2026  |  **Owner:** Rishi  |  **Author:** Drafted with AI Systems Analyst from elicitation transcript  |  **Supersedes:** WiseTransact PRD (Mobile, ARCHIVED)

> **How to read this document.** Sections marked **LOCKED** were explicitly decided during elicitation. Sections marked **PROPOSED** are sensible defaults filled in by the analyst and need explicit sign-off. The MVP+ Parking Lot lists everything explicitly deferred. The Decisions Log (§14) is the single source of truth for what's locked.

---

## 1. Executive Summary

WiseTransact is a **mobile-first responsive web application** that helps individuals build a clean, categorized record of their financial transactions through the year, so that at tax time they can hand a CA a comprehensive view of their inflows, outflows, and tax-relevant categorizations without manually building an Excel sheet from scratch.

Users access WiseTransact via a public URL shared across communities. They land directly inside a working app — no signup wall — with a Default Workspace auto-created on first visit. They can log transactions manually, or bulk-import CSV and PDF bank statements (including password-protected PDFs, unlocked client-side). The app categorizes transactions, deduplicates intelligently, and produces both an in-app dashboard and a downloadable year-end PDF report.

A user can have **multiple Workspaces** under a single user identity (Account) — for example, separating Personal and Business finances. They can optionally create an Account (username + password + recovery code; no PII) to organize and access their workspaces.

The MVP is scoped as a **free, privacy-first, public web app** deployed on Cloudflare Pages. The backend stores only an anonymous `accountID`, authentication credentials, and analytics events. **Transaction data, account names, preferred name, and any other user-typed content are stored only in the browser (IndexedDB) and never transmitted off the device.**

---

## 2. Product Vision & Positioning

### 2.1 Vision

WiseTransact is a quiet, reliable financial record-keeper that turns the year-end "go through every line of my bank statement" exercise into a problem you've already solved by April 1.

### 2.2 Problem Statement

Indian salaried professionals, freelancers, and self-employed individuals who file their ITR through a CA are typically asked for payslips and monthly bank statements. The CA expects a clean, categorized view of inflows and outflows. Today, the user either hands over raw statements (creating work for the CA) or builds an Excel sheet by manually going through each transaction line by line — a tedious, error-prone, once-a-year drudgery.

### 2.3 Target User

Adults in India who file ITR annually through a CA, have one or more bank accounts (savings + credit card is the typical floor), download bank statements as CSV or PDF from net banking portals, read English fluently, run modern browsers (Chrome, Edge, Safari, Firefox — latest 2 versions), and are organized enough to want better records but not so technical that they'd build their own spreadsheet system.

### 2.4 Positioning Statement

> WiseTransact helps you build a clean, categorized record of your expenses and income through the year, so when tax time comes you and your CA have full visibility — including expenses and income classifications that matter for ITR filing. Your financial data stays only on your device.

_Important framing note:_ WiseTransact is a **complement to ITR filing, not a replacement for it**. The app produces a categorized expense-and-income register; it does not file taxes, calculate liabilities, or provide financial advice.

### 2.5 Terminology

Three core entities have related but distinct meanings. The PRD uses these consistently throughout.

| Term | Meaning |
| --- | --- |
| **Account** (login) | The user's identity on WiseTransact: a username + password + recovery code. Used for authentication. No PII collected. _Optional in MVP — users can use the app fully anonymously._ |
| **Workspace** | An isolated ledger / book inside a user's session. Each Workspace has its own Accounts, transactions, categories, and reports. Users can have multiple Workspaces (e.g., Personal, Business). |
| **Account** (financial) | A bank account, credit card, cash bucket, or wallet — _inside_ a Workspace. Where context could confuse, the doc uses "financial account" or "bank account." |

---

## 3. Scope

### 3.1 MVP+ Parking Lot (Deferred)

| Item | Reason for deferral | Tentative priority |
| --- | --- | --- |
| Image-PDF / scanned-PDF parsing (OCR) | Tesseract.js client-side is slow and bundles 10+ MB. Falls back to manual / CSV in MVP. | High |
| Backend transaction storage / cross-device sync | Architectural shift. Login is decorative for data in MVP; this is the feature that makes login functional. | High |
| Desktop-optimized layouts (sidebar nav, multi-column dashboards, wide tables) | Mobile-first responsive in MVP; desktop is "stretched mobile." Real desktop polish comes later. | High |
| Dark mode | Theming infrastructure (semantic tokens) built into v1 so dark mode is purely additive. | Medium |
| Custom date range reports & PDFs for any period | Adds bucketing logic for short windows. | Medium |
| Mode breakdown & Tax-relevant summary report sections | Recoverable from other sections; lower-value visualizations. | Medium |
| Bulk multi-select on Transactions list | UX surface area. | Low |
| FAQ / in-app help content | Maintenance burden; contact email covers MVP. | Low |
| Notifications & email reminders | App is silent in MVP by deliberate design. (No email anyway.) | Low |
| Multi-language UI (Hindi, regional languages) | Translation effort. | Medium |
| Account Aggregator integration (RBI framework) | Significant compliance overhead. | Long-term |
| Cross-Workspace aggregated views | "Total income across all Workspaces." Low-frequency need. | Low |
| Advanced PostHog features: session replay, heatmaps | Phase 2 of analytics maturity. | Medium |

### 3.2 Explicitly Out of Roadmap

* **SMS auto-reading or SMS paste.** Web has no equivalent of mobile SMS access. Removed entirely.
* **Native iOS / Android apps.** Replaced by mobile-first responsive web + PWA install option. Not coming back.
* **Tax filing functionality.** WiseTransact does not file taxes or compute tax liability.
* **Financial advice.**

---

## 4. Personas

### Primary: "Anika the Salaried Professional"

30-year-old salaried product manager in Bangalore. Files ITR every year through her family CA. Has an HDFC savings account, an ICICI credit card, and a Paytm wallet. Downloads monthly statements as PDF from net banking. Wants to stop dreading the annual "send me your statements" email from her CA and instead hand him a tidy categorized PDF.

### Secondary: "Rohan the Freelance Designer"

34-year-old freelance designer in Pune. Income is irregular and comes from multiple clients via UPI. Has both personal and "professional" expenses he wants to track separately for deduction purposes. **Power-user of the multi-Workspace feature** — keeps "Personal" and "Freelance" as separate Workspaces, generates separate PDFs for each at year-end. The Personal/Professional purpose tag is meaningful within his Freelance Workspace.

---

## 5. Core User Journeys

### 5.1 First visit (community-shared link)

1. User clicks the WiseTransact URL shared in a WhatsApp / Telegram / forum community.
2. Browser loads the app (PWA-ready). Splash screen with WiseTransact logo briefly.
3. App silently generates an anonymous `accountID` (stored in IndexedDB as a long-lived token).
4. App auto-creates a Default Workspace named "Personal."
5. App shows a one-time "Welcome" modal that combines three required acknowledgments — privacy notice (anonymized analytics + crash reporting disclosed), data-loss warning (browser-local data), and "not financial advice" disclaimer. User checks one box and taps Continue.
6. User lands on the Home screen of the Default Workspace, ready to log a transaction.

### 5.2 Daily logging (manual)

1. User opens the app (URL or PWA shortcut). Sticky session keeps them logged in / continuous if they previously had data.
2. Taps "+ Add Transaction".
3. Fills the form (Type, Amount, Account, Date, Category, Purpose, Mode, Notes). Form interaction events fire to PostHog.
4. Taps Submit. Dedup check runs. If no duplicate, transaction saves to IndexedDB. User returns to Home with confirmation.

### 5.3 Bulk import (CSV)

1. User downloads their bank statement as CSV from their net-banking portal on their laptop.
2. Opens WiseTransact, taps "Import" CTA on Home or Transactions tab.
3. Drags-and-drops the CSV file (or clicks to upload).
4. App parses the CSV client-side. Shows a review queue: every row pre-populated with extracted Date / Amount / Mode / Notes; Account and Category empty for user to fill or accept rule-based suggestion.
5. User accepts, edits, or removes individual rows. Dedup runs against existing transactions; matches surface as Discard / Merge / Add Anyway prompts inline.
6. User taps Import. All confirmed transactions save to IndexedDB. Confirmation summarizes: "Imported X transactions, skipped Y duplicates."

### 5.4 Bulk import (PDF, including password-protected)

1. User has a monthly bank statement as a PDF (sometimes password-protected with PAN+DOB or customer ID).
2. Opens WiseTransact, taps "Import" CTA, drags-and-drops the PDF.
3. **If the PDF is password-protected:** App detects the lock, shows an inline prompt — "This PDF is password-protected. Enter password to continue." User types the password (held in memory only, never transmitted, never persisted). On wrong password: inline error, retry. On correct password: PDF unlocked in-memory.
4. **If the PDF is image-only (scanned):** App detects insufficient extractable text and shows: "This appears to be a scanned PDF. We can't read it automatically yet — please enter transactions manually, or upload a CSV instead."
5. **If the PDF is text-based:** App parses, applies rule-based categorization, and shows the same review queue as the CSV flow.
6. User reviews, dedupes, imports. The original PDF and the password are discarded from memory.

### 5.5 Multi-Workspace switching

1. User taps the Workspace switcher in the top bar.
2. Sees their list of Workspaces (e.g., "Personal," "Freelance"). Taps one to switch.
3. App reloads with the selected Workspace's data. URL updates so deep links to a specific Workspace are possible (e.g., `/w/freelance/transactions`).
4. User can also tap "+ New Workspace" from the switcher to create a new one.

### 5.6 Account creation (optional)

1. From Settings, user taps "Create Account" (or the Account switcher offers it).
2. Form: Username (3–30 chars, alphanumeric + underscore + hyphen, case-insensitive unique), Password (min 8 chars, must contain a letter and a number).
3. On submit: server generates a 16-character recovery code. App shows it ONCE in a modal: "Save this recovery code somewhere safe. You'll need it to reset your password if you forget it. We can't recover your account without it." User must tick "I've saved it" or click "Download as text" before continuing.
4. From this point, the existing anonymous `accountID` is now associated with the new Account credentials. The user stays in their existing Workspaces with all their data intact.

### 5.7 Year-end CA handoff

1. User opens app, taps Reports.
2. Switches the period picker to "This Financial Year" (within the current Workspace).
3. Reviews in-app charts and totals.
4. Taps "Download PDF". App generates the PDF client-side (≤5s, progress indicator). PDF is saved via the browser's native download flow (typically goes to Downloads folder).
5. User shares the PDF with their CA via email, WhatsApp, or Drive — using their OS / browser file-share tooling.

---

## 6. Functional Requirements

### 6.1 First-visit flow & anonymous accountID **\[LOCKED\]**

* On first visit, the app silently generates a random `accountID` (UUID v4) and stores it in IndexedDB.
* The same `accountID` is registered on the backend (Cloudflare D1) so analytics events can be attributed.
* A Default Workspace named "Personal" is auto-created and selected.
* A combined one-time Welcome modal is shown with three required acknowledgments:

    * **Privacy notice** — anonymized analytics + crash reporting disclosed; opt-out toggles available in Settings.
    * **Data-loss warning** — "Your data is stored only in this browser. Clearing browser data, switching browsers, or using incognito mode will lose your data."
    * **"Not financial advice"** disclaimer.

* User must tick one acknowledgment checkbox and tap Continue.
* Subsequent visits skip the Welcome modal (acknowledgment persisted to IndexedDB).

### 6.2 Sticky session **\[LOCKED\]**

* Auth token (long-lived JWT) stored in IndexedDB with a **1-year refresh window**.
* The session is persistent by default — there is no "Remember me" checkbox; sticky login is the only mode.
* Session ends only when the user explicitly taps Log out, or browser data is cleared.
* **Acknowledged consequence:** Anyone with physical access to the browser can access the app. Documented in the Privacy Policy.

### 6.3 Account creation, login, recovery **\[LOCKED\]**

* **Account creation** is **optional** in MVP. The app is fully functional without an Account.
* **Username constraints:** 3–30 characters, alphanumeric + underscore + hyphen, case-insensitive unique.
* **Password constraints:** Minimum 8 characters, must contain at least one letter and one number. No other complexity rules.
* **Recovery code:** Server-generated 16-character random string, shown ONCE on signup, must be acknowledged ("I've saved it") or downloaded before continuing. Hashed on the backend (the cleartext is not stored).
* **Login flow:** Username + Password. On success, the existing `accountID` (if any) is reconciled with the credentialed account. If a different `accountID` is currently active in this browser, the user is asked: "Replace the current data in this browser with your saved account?" with options to _Keep current data_ (and not log in) or _Switch_ (the current anonymous data is preserved as a Workspace inside the logged-in account if it makes sense, or otherwise shown to be replaced).
* **Password reset:** Username + Recovery Code. On success, user is prompted to set a new password and is given a _new_ recovery code (the old one is invalidated).
* **No email-based password reset.** No email is ever collected.
* **Logout behavior:** Auth token is invalidated server-side and removed from IndexedDB. **Local IndexedDB transaction data is NOT deleted** — re-login restores access to it. (User can explicitly Delete All Data from Settings if they want a clean wipe.)

### 6.4 Workspace management **\[LOCKED\]**

* Every transaction, financial account, category, and report belongs to exactly one Workspace.
* Each Workspace has an independent set of categories, financial accounts, and transaction records.
* A **Workspace switcher** in the top bar shows the active Workspace name and a dropdown of all Workspaces; tapping a Workspace switches to it.
* "+ New Workspace" option in the switcher and in Settings.
* Workspace fields: name (required, 1–40 chars), optional emoji icon (e.g., 🏠 Personal, 💼 Business).
* **Deletion:** When a Workspace contains transactions, the user is prompted with two options — **Reassign** (move all data to another Workspace; only available if at least one other Workspace exists) or **Delete with** (permanently delete the Workspace and all its data, with strong typed confirmation showing the transaction count).
* **No hard limit on Workspaces** in MVP. Soft suggestion at 10+ ("Many Workspaces may slow your browser").
* **Cross-Workspace data:** Fully isolated in MVP. No aggregated "all Workspaces" view.

### 6.5 Home Screen **\[LOCKED\]**

Mobile-first hybrid layout: minimal dashboard + prominent quick-add.

* **Top bar:** Workspace switcher (left), Settings icon (right).
* **"This month so far" header:** three numbers — Income, Expense, Net.
* **Recent transactions list:** latest 5–10 entries.
* **Persistent "+ Add Transaction"** button (FAB on mobile).
* **"Import"** CTA visible on Home (and again on Transactions tab).
* **Bottom tab bar (mobile):** Home, Transactions, Reports, Settings (4 tabs).
* **Desktop (MVP+):** sidebar navigation + workspace switcher in top bar. In MVP, desktop simply renders the mobile layout in a constrained width (max ~640px content column) — readable but not optimized.

### 6.6 Add Transaction (manual) **\[LOCKED\]**

**Layout:** Empty form, all fields visible. (No SMS-paste path on web.)

**Field order:**

1. **Type** — three-button toggle: Income / Expense / Transfer. Default: Expense.
2. **Amount** — numeric input. Required. Must be > 0.
3. **Account** — picker. For Income/Expense: single financial Account from the current Workspace. For Transfer: From-Account + To-Account. Required. Defaults to the user's most-used account in the current Workspace.
4. **Date** — picker. Defaults to today. Allows today and any past date within the current FY; future dates not allowed in MVP.
5. **Category** — dropdown. Income → Salary / Interest / Freelance / Rental / Other. Expense → Food / Transport / Healthcare / etc. (or custom). Transfer → not applicable.
6. **Purpose** — Expense only: Personal / Professional / Investment / Tax-saving. Default: Personal.
7. **Mode** — UPI / Card / Cash / Bank Transfer / Other.
8. **Notes** — optional free-text.
9. **Submit** — disabled until all required fields are populated. Form interaction events fire to PostHog throughout.

**Large-amount soft warning:** Amount ≥ ₹10,00,000 (₹10 lakh) → non-blocking confirmation prompt: "This is a large amount (₹X). Are you sure?" with \[Yes\] / \[Edit\].

**Zero or negative amount:** Inline error on the Amount field; Submit blocked.

### 6.7 Bulk Import — CSV **\[LOCKED\]**

* Trigger: "Import" CTA → choose CSV.
* File constraints: extension `.csv`, size ≤ 10 MB.
* Parsing: client-side via Papa Parse. Auto-detects delimiter (comma, semicolon, tab) and header row.
* Column mapping: app attempts to auto-map columns by header name (Date, Description, Amount, Type/Dr-Cr, etc.). User confirms mapping in a screen _before_ the review queue. Manual override available.
* Output: a review queue showing every parsed row, pre-populated with extracted data, with rule-based category suggestions where a known merchant keyword is detected.
* User can accept rows individually, in bulk, or remove rows that aren't real transactions.
* Dedup runs inline on each row before commit.
* On commit: rows save to IndexedDB. Summary: "Imported X, skipped Y duplicates, removed Z."

### 6.8 Bulk Import — PDF **\[LOCKED\]**

* Trigger: "Import" CTA → choose PDF.
* File constraints: extension `.pdf`, size ≤ 25 MB.
* **Client-side parsing only.** PDF.js handles text extraction and password unlocking entirely in the browser. The PDF and any password are never transmitted to the backend, never persisted to IndexedDB, and discarded from memory after parsing.
* **Password-protected PDFs:** detected automatically. Inline prompt asks for password. On wrong password: inline retry, no max-attempts lockout.
* **Image-only PDFs (scanned):** detected by checking that the document has fewer than ~20 characters of extractable text per page. App shows the fallback message and offers to switch to manual entry or CSV upload. OCR moves to MVP+.
* **Text-based PDFs:** parsed, fed into the same review queue as CSV import.
* Per-bank parsers: a per-bank rule library identifies common Indian bank statement layouts (HDFC, ICICI, SBI, Axis, Kotak) for higher-quality extraction. Falls back to a generic table-extraction heuristic for unrecognized layouts.

### 6.9 Categorization & Auto-suggest **\[LOCKED\]**

Rule-based auto-categorization. The app maintains a library of merchant-keyword → category mappings. For imported transactions where a merchant is detected in the description, the app suggests a Category. The user can always accept, override, or pick a custom category.

| Type | Predefined Categories |
| --- | --- |
| Income | Salary, Interest, Freelance / Professional Income, Rental, Other |
| Expense | Food & Dining, Transport, Shopping, Bills & Utilities, Healthcare, Rent, Education, Entertainment, Travel, Insurance, Other |
| Transfer | Not applicable |

* **Categories are per-Workspace.** Each Workspace has its own set of predefined and custom categories.
* **Custom categories:** user-created, per-Workspace, do not participate in the merchant rule library. When a user types a custom category name, the UI suggests the closest predefined match to discourage accidental fragmentation.
* **Purpose tags (Expense only):** Personal / Professional / Investment / Tax-saving. Default Personal.

### 6.10 Deduplication **\[LOCKED\]**

**Approach:** Conservative — always prompt; never silently merge.

**When dedup runs:** On every transaction commit (manual save, CSV import row, PDF import row), within the current Workspace.

**Match criteria (all must be true within the same Workspace):** Same financial Account, same Type, Amount within ±1% or ±₹1 (whichever is larger), Date within ±1 day.

| Choice | Behavior |
| --- | --- |
| Discard | Throw away the new entry. Existing transaction is unchanged. |
| Merge | Keep the existing transaction; enrich any empty fields with values from the new entry. On conflicts, the existing transaction's values win. Merge history preserved internally but not shown. |
| Add Anyway | Both records save independently. |

### 6.11 Transactions List **\[LOCKED\]**

* Scoped to the current Workspace.
* Default time window: current month (period picker switches).
* Default sort: most recent first; grouped by date with date headers (Today, Yesterday, then explicit dates).
* Sort toggle: Date ascending / descending.
* Per-row info: amount (color-coded — red Expense, green Income, neutral Transfer), category, account, date, notes preview.
* Filters: Type, Account, Category, Date range.
* Search: free-text across notes, category, merchant, account name.
* Header summary: Income / Expense / Net for the selected period.
* Tap row → full-screen Transaction Detail with Edit / Delete.

### 6.12 Transaction Detail **\[LOCKED\]**

* Full-screen view of all transaction fields.
* Edit: all fields editable. Saving an edit re-runs dedup against other transactions in the Workspace.
* Delete: confirmation dialog. On confirm, transaction is permanently removed.
* Editing a previously merged transaction behaves like editing any other transaction. Merge history preserved internally only.

### 6.13 Reports **\[LOCKED\]**

**Content:** Mirrors the downloadable PDF. Scoped to the current Workspace.

**Default time window:** Current month.

**Period picker (predefined only in MVP):** This Week, This Month, This Quarter, This Financial Year, Last Month, Last Financial Year.

**MVP report sections (in-app and PDF):**

1. Header / metadata — Workspace name, FY/period, accounts covered, date range, generation date.
2. Summary — total income, total expense, net, broken down by month.
3. Category & Purpose breakdown — Expense by category, Expense by Purpose, Income by source.
4. Monthly trend — line/bar chart, income and expense across the period.
5. Account-level breakdown — for each financial account, total inflow and outflow.
6. Transaction register — full ledger sorted by date.
7. Anomalies / quality flags — uncategorized, "Add Anyway" duplicates, large outliers (≥ ₹10 lakh).

**PDF generation (MVP):** Available _only_ when period picker is set to "This Financial Year". For other periods, the in-app view is available but the Download PDF button is disabled.

**PDF download flow:** Tap → app generates PDF client-side using a library like `jsPDF` or `pdf-lib` (≤5s with progress indicator) → triggers browser native download (typically goes to Downloads folder). User shares via OS / browser file-share tooling. **No re-share screen** in the web version (the OS already provides one once the file is downloaded).

**Transfers are excluded from Income and Expense totals in all reports.**

### 6.14 Settings **\[LOCKED\]**

| Section | Items in MVP |
| --- | --- |
| Account (login) | If not logged in: "Create Account" CTA. If logged in: username displayed, "Sign Out" CTA, "Reset Password" CTA. |
| Profile | Edit preferred name (per-Account, used in PDF report headers when an Account exists). |
| Workspaces | List of all Workspaces with active indicator; create / rename / delete. Delete uses Reassign-or-Delete-with prompt. |
| Accounts (financial) | View, Add, Edit, Delete with reassign-or-delete-with prompt — _scoped to current Workspace_. |
| Categories | View predefined + custom; Add custom; Edit custom (predefined read-only); Delete custom with reassign-or-delete-with — _scoped to current Workspace_. |
| Data | Delete all data in current Workspace. Delete all data across all Workspaces (typed confirmation). |
| Privacy controls | Crash reporting opt-out toggle (default on). Behavior analytics opt-out toggle (default on). |
| Legal | Privacy Policy, Terms of Service, Disclaimer (data-loss reminder), About / version. |
| Help | Contact / feedback email. |

---

## 7. Data Model

### 7.1 Backend (Cloudflare D1 — SQLite)

| Entity | Fields |
| --- | --- |
| AnonymousVisitor | accountId (uuid, PK), createdAt, lastSeenAt, environment (dev / prod) |
| Account (login) | accountId (uuid, FK to AnonymousVisitor — nullable until signup), username (unique, case-insensitive), passwordHash (Argon2id), recoveryCodeHash (Argon2id), createdAt, lastLoginAt |
| AnalyticsEvent | (sent to PostHog Cloud — not stored in D1) |

**Backend stores nothing else.** No transactions, accounts, categories, preferred name, or any user-typed content.

### 7.2 Browser (IndexedDB via Dexie.js)

| Entity | Fields |
| --- | --- |
| Session | authToken, accountId, lastSyncedAt, welcomeAcknowledgedAt |
| Workspace | id (uuid), name, icon (emoji, optional), createdAt, updatedAt |
| FinancialAccount | id, workspaceId (FK), name, type (Savings / Credit Card / Cash / Wallet / Other), createdAt |
| Category | id, workspaceId (FK), name, transactionType (Income / Expense), isPredefined, isActive |
| Transaction | id, workspaceId (FK), type (Income/Expense/Transfer), amount, accountId (FK for Income/Expense), fromAccountId & toAccountId (FK for Transfer), date, categoryId (nullable for Transfer), purpose (Expense only, nullable), mode, notes, source (Manual / CSVImport / PDFImport), rawSource (optional original CSV row or PDF text fragment, retained briefly for dedup transparency), mergeHistory (json, internal only), createdAt, updatedAt |
| MerchantRule | id, keyword, suggestedCategoryId, priority — bundled with the app, not user-editable in MVP |
| UserPrefs | preferredName, crashReportingEnabled (default true), behaviorAnalyticsEnabled (default true), activeWorkspaceId |

### 7.3 Schema migrations

* IndexedDB schema versioning via Dexie's built-in migrations. Required from v1 even with no migrations yet.
* D1 schema migrations via Cloudflare's standard migration tooling.

---

## 8. Edge Cases & Error Handling

| # | Scenario | Behavior |
| --- | --- | --- |
| 1 | User opens the URL in **incognito / private mode** | App detects that IndexedDB is ephemeral; shows a non-blocking warning: "This appears to be a private window. Your data will be lost when you close it." |
| 2 | User's browser doesn't support IndexedDB | Show a "Browser not supported" message with a list of supported browsers. |
| 3 | User clears browser data | All Workspaces and transactions lost. Disclosed at onboarding and in Settings. |
| 4 | Same user opens the app in **multiple tabs** | Tabs sync via `BroadcastChannel` API — adding a transaction in tab A reflects in tab B's UI without reload. Last-write-wins on conflicts. |
| 5 | User uploads a CSV with an unknown column layout | Auto-detection partially succeeds; user is shown a column-mapping screen and can manually map Date / Amount / Description / Mode columns. |
| 6 | User uploads a password-protected PDF | Inline password prompt. On wrong password: retry inline, no lockout. |
| 7 | User uploads an image-only / scanned PDF | Detection fires; friendly message + fallback to manual / CSV. OCR is MVP+. |
| 8 | User uploads a non-PDF / non-CSV file | "File type not supported. Please upload a CSV or PDF." |
| 9 | PDF import contains rows that look like balance lines, fees, or non-transactions | Heuristic filtering removes obvious non-transactions; ambiguous rows are still surfaced in the review queue with a "Likely not a transaction" flag and a default-to-skip toggle. |
| 10 | Amount ≥ ₹10,00,000 | Soft non-blocking confirmation prompt. |
| 11 | Amount = 0 or negative | Block submit; inline error. |
| 12 | Editing a previously merged transaction | Treated as editing a normal transaction. |
| 13 | April 1 FY rollover | App auto-shifts the "current FY" view; previous FY accessible via period picker. Reports for the previous FY remain generatable. |
| 14 | Backdating into a previous FY | Allowed. Transaction filed into whichever FY contains its date. |
| 15 | User tries to delete the only Workspace | Block with message: "You must have at least one Workspace. Create another before deleting this one." |
| 16 | Account creation: username already taken | Inline error on username field with suggestion ("rishi_27 is taken — try rishi_27_1 or rishi.27"). |
| 17 | User loses their Recovery Code | "Without your Recovery Code, we can't reset your password. Your local data is still accessible in this browser. You can create a new Account." This is harsh but is the honest tradeoff for not collecting email. |
| 18 | Browser tab killed mid-import | No partial commits. Either the entire import batch saves on the user's "Confirm Import" tap, or nothing saves. |
| 19 | PWA installed; user tries to open the same `accountID` in a regular browser tab | Both contexts share the same IndexedDB origin, so they see the same data and stay in sync via BroadcastChannel. |
| 20 | User logs out while in a non-default Workspace | After logout, app drops back to anonymous mode with the original anonymous `accountID`'s Workspaces (which may differ from the logged-out account's). |

---

## 9. Non-Functional Requirements

### 9.1 Platforms & Browser Support **\[LOCKED\]**

* **Modern evergreen browsers only:** latest 2 major versions of Chrome, Edge, Firefox, Safari (desktop + iOS/Android variants).
* IE 11 / older Edge / older Safari: not supported.
* Mobile-first design. Desktop renders the mobile layout in a constrained width (max ~640px content column) in MVP. Full desktop polish (sidebar nav, multi-column dashboards) is **MVP+**.

### 9.2 Tech Stack **\[LOCKED\]**

| Layer | Choice |
| --- | --- |
| Frontend framework | React + Vite, TypeScript |
| Styling | Tailwind CSS |
| Routing | TanStack Router |
| Local DB | IndexedDB via Dexie.js |
| PDF parsing & unlocking | PDF.js (client-side only) |
| CSV parsing | Papa Parse (client-side) |
| Client-side PDF report generation | `jsPDF` or `pdf-lib` (TBD by engineering) |
| Backend | Hono framework on Cloudflare Workers (TypeScript) |
| Backend DB | Cloudflare D1 (SQLite at the edge) — only for `accountID` + auth |
| Password hashing | Argon2id (in Workers) |
| Analytics | PostHog Cloud (EU region) — page views, CTA events, funnels, form interaction events |
| Crash reporting | Sentry (browser SDK; engineering's call between Sentry / Crashlytics-equivalent) |
| Hosting | Cloudflare Pages (frontend) + Cloudflare Workers (backend) |
| CI/CD | GitHub Actions deploying to Cloudflare |
| Source control | GitHub |
| Domain | TBD — `*.pages.dev` subdomain in MVP. Custom domain is MVP+. |
| **PWA** | Service worker + Web App Manifest from MVP. Installable to home screen on Chrome / Edge / Android Chrome. iOS Safari supports basic add-to-home-screen. |
| Theming | Semantic color tokens (`surface.primary`, `text.muted`, etc.) — built into v1 even though only Light mode ships in MVP. Dark mode (MVP+) becomes a token-set addition, not an app-wide rewrite. |

### 9.3 Performance Targets **\[LOCKED\]**

| Metric | Target |
| --- | --- |
| First Contentful Paint (mid-range Android, 4G) | < 1.5 s |
| Time to Interactive (mid-range Android, 4G) | < 3 s |
| Initial JS bundle (gzipped, post-tree-shake) | < 250 KB |
| Total app shell on first load (gzipped) | < 500 KB |
| Add Transaction screen open | < 200 ms |
| Save Transaction (incl. dedup) | < 500 ms |
| Transactions list scroll (~3,000 records, current Workspace) | 60 FPS, no jank (list virtualization required) |
| Reports screen load (default month) | < 1 s |
| CSV parse (1,000 rows) | < 1 s |
| PDF parse (text-based, 100 transactions) | < 5 s |
| PDF report generation (full FY, ~2,000 transactions) | < 5 s with progress indicator |
| Login round-trip | < 1 s p95 |

### 9.4 Accessibility **\[LOCKED\]**

Basic baseline:

* Readable contrast across all UI elements (WCAG AA contrast ratios)
* All tap targets ≥ 44pt
* Support for OS-level dynamic type (text-size scaling)
* Full keyboard navigation
* ARIA landmarks, labelled form controls
* Screen reader (VoiceOver / TalkBack / NVDA) navigation works for all core flows

Full WCAG 2.1 AA conformance is not a target for MVP but should be considered post-launch.

### 9.5 Language **\[LOCKED\]**

English only for MVP UI and parsing. All user-visible strings externalized to a localization file from day one.

### 9.6 Offline Behavior & PWA **\[LOCKED\]**

* App functions identically online and offline for all core flows. No network is ever required for transaction add / edit / delete / view / report / PDF generation.
* The only network egress is anonymized analytics events (PostHog), anonymized crash reports (Sentry), and authentication round-trips.
* **PWA:** App installable to home screen / dock via Web App Manifest. Service worker caches the app shell for offline launch. Updates rolled out via standard service-worker update flow.

### 9.7 Multi-tab behavior **\[LOCKED\]**

* Multiple tabs of the same browser, same `accountID`, share IndexedDB and stay in sync via the `BroadcastChannel` API.
* Adding a transaction in tab A reflects in tab B's UI without manual reload.
* Last-write-wins on rare race conditions (e.g., simultaneous deletes from two tabs).

---

## 10. Privacy, Legal & Disclaimers **\[LOCKED\]**

### 10.1 Privacy posture

**All transaction data, account names, preferred name, custom categories, notes, and any user-typed content is stored only in the user's browser** (IndexedDB) on their device. None of this is ever transmitted to or stored on any backend server.

The backend only sees:

* A randomly generated `accountID` (UUID v4)
* For users who choose to create an Account: username, password hash, recovery code hash
* Anonymized analytics events tied to the `accountID` (no PII, no transaction data, no user-typed content)
* Anonymized crash reports

### 10.2 What's stored where

| Data | Where | Why |
| --- | --- | --- |
| Anonymous accountID | Backend (D1) + Browser (IndexedDB) | Tie analytics events together across sessions |
| Username, password hash, recovery code hash | Backend (D1) | Authenticate users who create an Account |
| Transactions, financial accounts, categories, Workspaces, preferred name, notes | Browser (IndexedDB) only | Privacy-by-design |
| Analytics events (page views, CTAs, funnels, form interactions) | PostHog Cloud (EU) | Product improvement, drop-off analysis |
| Crash stack traces | Sentry | Bug diagnosis |

### 10.3 Required documents (live on the public URL)

* **Privacy Policy** — public web page, linked from Settings and the app footer. Discloses local-only data storage, anonymized analytics + crash reporting (with named processors PostHog and Sentry), the long-lived auth cookie / IndexedDB token, and all opt-out controls.
* **Terms of Service / EULA** — public web page, standard boilerplate, linked from Settings and footer.
* **DPDP Act compliance statement** — included in Privacy Policy. States that no transaction data, financial data, or PII is processed by WiseTransact's backend; the user is the sole data fiduciary of their financial data.

### 10.4 Disclaimers

* **"Not financial advice"** — first-launch acknowledgment + Settings access.
* **PDF report footer** — "Generated by WiseTransact based on user-entered data. This report is for personal record-keeping. Verify all entries with original bank statements and consult a qualified Chartered Accountant before tax filing."
* **Data-loss warning** — first-launch acknowledgment + Settings access. "Your data is stored only in this browser. Clearing browser data, switching browsers, or using incognito mode will permanently delete your data."
* **PDF password handling notice** — inline on the PDF upload UI: "Your PDF and password stay on your device. WiseTransact never uploads either to any server."

### 10.5 Crash reporting & behavior analytics

* **Crash reporting (Sentry)** — anonymized stack traces, browser, OS, app version. Never includes user-typed content. Opt-out toggle in Settings (default on).
* **Behavior analytics (PostHog Cloud, EU region)** — page views, CTA events, form interaction events, funnels. Tied to `accountID`. **Strict no-PII constraint:** no transaction amounts, merchant names, account names, preferred name, or any user-typed content. Events tagged with `environment` (dev / prod) so localhost dev data doesn't pollute production funnels. Opt-out toggle in Settings (default on).
* Both opt-outs are independent.

### 10.6 Cookie & local storage policy

The app uses:

* An **IndexedDB store** for all user data (transactions, Workspaces, preferred name, etc.) — first-party, no third-party sharing.
* An **auth token in IndexedDB** for the sticky 1-year session.
* A **PostHog cookie** for analytics session continuity (opt-out kills it).

A minimal one-line cookie banner is shown on first visit: _"WiseTransact stores your data only in this browser. We use anonymized analytics — see_ [_Privacy Policy_](./privacy)_."_ Acknowledgment is part of the Welcome modal, not a separate banner.

### 10.7 Monetization

MVP is fully free. No paid tier, no subscription, no in-app purchases. No ads. No advertising SDKs.

---

## 11. Branding & Visual Direction **\[LOCKED\]**

> A separate **WiseTransact Brand Document** (owned by Rishi) holds the full visual specification — color palette tokens, logo, illustrative style, typography, motion. This PRD section captures only the personality decisions and scope-level choices that affect engineering.

### 11.1 Visual personality **\[LOCKED\]**

| Axis | Position |
| --- | --- |
| Serious ↔ Friendly | **Serious / professional** |
| Minimal ↔ Rich | **Minimal / restrained** |
| Cool ↔ Warm palette | **Cool, restrained** |
| Conservative ↔ Modern | **Modern (with restraint)** |

Reference visual family: apps like Linear, Things 3, Apple Stocks (web equivalents: Linear, Vercel dashboard, Notion). Quiet, professional, modern, restrained. Not playful, not flashy.

### 11.2 Color palette

Specified in the WiseTransact Brand Document. Engineering implements all colors as **semantic tokens** in code (see §9.2). Standard finance-app semantic mapping: green for income/positive, red for expense/negative, neutral gray for transfers.

### 11.3 Logo & Naming **\[LOCKED\]**

* Product name: **WiseTransact** (one word).
* All public surfaces (URL, page title, social share, PWA manifest) use the one-word form.
* Logo to be designed as part of the WiseTransact Brand Document.

### 11.4 Dark mode **\[DEFERRED to MVP+\]**

Light mode only in MVP. Dark mode in MVP+. Theming infrastructure (semantic tokens) built into v1.

### 11.5 Iconography

Outline / line icons via Lucide (recommended for React + Tailwind). Custom illustrations out of scope for MVP.

---

## 12. Success Metrics **\[LOCKED\]**

### 12.1 North Star Metric

| Metric | Definition | Target |
| --- | --- | --- |
| **Activation** | % of unique visitors who add their **first transaction** within **7 days** of first visit | **≥ 50%** |

### 12.2 Primary Metric

| Metric | Definition | Target |
| --- | --- | --- |
| **WAU (headline)** | % of unique visitors active in the past 7 days | **≥ 30%** |
| **MAU (sanity check)** | % of unique visitors active in the past 30 days | **≥ 45%** |

### 12.3 Supplementary Metrics

| Metric | Definition | Target |
| --- | --- | --- |
| Drop-off — Add Transaction form | % of users who open the form but submit it | ≥ 70% |
| Drop-off — PDF Import flow | % of users who upload a PDF and reach the Import step | ≥ 60% |
| Categorization quality | % of transactions left in "Uncategorized" at end of period | < 10% |
| Tax-prep core action | % of users active 6+ months who generate at least one PDF report | ≥ 40% |
| Stability | Crash-free session rate | 99.5% |
| PWA install rate | % of mobile visitors who install the PWA | Track only (no target) |

### 12.4 Tracked but not targeted

| Metric | Definition | Note |
| --- | --- | --- |
| Account creation rate | % of unique visitors who create a logged-in Account | Diagnostic — informs whether MVP+ should add features that incentivize Account creation. |
| Workspace count per Account | Average # of Workspaces per active user | Informs whether multi-Workspace was the right call. |
| Performance | p95 of FCP, TTI, Save Transaction, PDF generation against §9.3 targets | Engineering quality bar. |
| Active financial accounts per Workspace | Average count | Informs multi-account UX value. |

### 12.5 Analytics event taxonomy (PostHog)

All events tagged with: `accountId` (anonymous), `workspaceId` (anonymous), `environment` (dev / prod), `app_version`.

**Page-level:** `page_viewed`

**Navigation:** `nav_clicked`

**Workspaces:** `workspace_created`, `workspace_switched`, `workspace_renamed`, `workspace_deleted`

**Account (login):** `signup_started`, `signup_completed`, `recovery_code_acknowledged`, `login_started`, `login_completed`, `login_failed`, `password_reset_started`, `password_reset_completed`, `logout`

**Transactions:** `transaction_form_opened`, `transaction_added` _(source: manual | csv_import | pdf_import)_, `transaction_edited`, `transaction_deleted`

**Bulk import:** `import_started` _(type: csv | pdf)_, `import_file_selected`, `pdf_password_required`, `pdf_password_failed`, `pdf_image_only_detected`, `import_parsed` _(count)_, `import_review_completed`, `import_committed` _(count)_, `import_abandoned`

**Dedup:** `duplicate_detected`, `duplicate_action` _(action: discard | merge | add_anyway)_

**Reports:** `report_viewed` _(period)_, `report_period_changed`, `pdf_report_generation_started`, `pdf_report_generated`, `pdf_report_generation_failed`

**Form interactions (drop-off analysis):** `form_field_focused`, `form_field_blurred` _(was_filled, was_valid)_, `form_field_error` _(error_type)_, `form_submitted`, `form_abandoned` _(last_field_touched, time_on_form_seconds)_

**Privacy controls:** `analytics_opted_out`, `analytics_opted_in`, `crash_reporting_opted_out`, `crash_reporting_opted_in`

**Funnels (defined in PostHog):**

1. **Activation:** `page_viewed` (landing) → `transaction_form_opened` → `transaction_added`
2. **Account creation:** `signup_started` → `signup_completed` → `recovery_code_acknowledged`
3. **PDF import:** `import_started` (pdf) → `import_file_selected` → `import_parsed` → `import_committed`
4. **CSV import:** `import_started` (csv) → `import_file_selected` → `import_parsed` → `import_committed`
5. **Year-end PDF report:** `report_viewed` → `pdf_report_generation_started` → `pdf_report_generated`

### 12.6 Measurement constraints

All metrics derive from anonymized event data. No metric depends on transaction amounts, merchant names, account names, preferred name, or any user-typed content.

---

## 13. Open Questions / TBD

- [ ] Naming, logo, color palette, full visual system → tracked in the WiseTransact Brand Document (owned by Rishi).
- [ ] Wireframes & screen mockups → separate design doc (owner TBD).
- [ ] Detailed acceptance criteria per user story → to be authored as Jira tickets in KAN (held until PRD approval).
- [ ] Privacy Policy & Terms of Service → final legal text to be drafted (templated and reviewed).
- [ ] Initial merchant rule library → concrete keywords + default category mappings, prioritized by frequency in Indian bank transactions.
- [ ] Bank PDF / CSV format library → sample statements from major Indian banks (HDFC, ICICI, SBI, Axis, Kotak) for parser test fixtures.
- [ ] Default Workspace name → "Personal" is proposed; confirm or change.
- [ ] Crash reporting tool — Sentry vs. Cloudflare's native error tracking — engineering call.
- [ ] PostHog cookie banner / consent UX final wording.
- [ ] PWA icon & screenshots required for Web App Manifest — depends on Brand Document.
- [ ] Domain decision: stay on `*.pages.dev` for the foreseeable future, or buy a custom domain after MVP launch?

---

## 14. Decisions Log (locked items)

* Product name: **WiseTransact** (one word).
* Platform: **web only** (mobile-first responsive). Native mobile apps explicitly out of roadmap.
* Min browsers: latest 2 versions of Chrome, Edge, Firefox, Safari (incl. iOS/Android variants).
* Tech stack: React + Vite + TypeScript + Tailwind on the frontend; Hono on Cloudflare Workers + Cloudflare D1 on the backend; IndexedDB via Dexie.js on the client; PDF.js + Papa Parse client-side; PostHog Cloud (EU) for analytics; Sentry for crash reporting; GitHub for source; GitHub Actions → Cloudflare for CI/CD.
* Hosting: Cloudflare Pages public URL (`*.pages.dev` subdomain in MVP). Custom domain MVP+.
* **Architecture (Interpretation 1):** Backend stores ONLY accountID + auth credentials + analytics events. Transactions, financial accounts, categories, Workspaces, preferred name all live in browser IndexedDB and never leave the device.
* Anonymous-by-default. `accountID` generated silently on first visit. Account creation (login) is optional.
* Account creation: username + password (≥ 8 chars, letter + number) + 16-char recovery code shown once. No email, no phone.
* Sticky session — 1-year refresh window, no auto-logout; ends only on explicit logout or browser-data clear.
* Multi-Workspace under one Account; each Workspace fully isolated.
* Default Workspace named "Personal" auto-created on first visit.
* Welcome modal on first visit combines privacy notice + data-loss warning + "not financial advice" disclaimer in one acknowledgment.
* Input methods (MVP): manual entry + CSV bulk upload + PDF bulk upload (text-based, including password-protected — unlocked client-side).
* Image-PDF / scanned-PDF: detected and falls back to manual or CSV; OCR is MVP+.
* Transaction model: Income / Expense / Transfer (not Credit/Debit).
* Categorization: rule-based auto-suggest + CA-friendly taxonomy + custom categories. Per-Workspace.
* Two-tag classification: Category + Purpose (Purpose for Expense only).
* Time horizon: financial year (April–March).
* Dedup: conservative; always prompt; Discard / Merge / Add Anyway. Scoped to current Workspace.
* Home: hybrid dashboard + quick-add. Mobile-first.
* Bottom tab bar (mobile): Home / Transactions / Reports / Settings.
* Reports default period: current month. PDF only for full FY in MVP.
* PDF generated client-side; saved via browser download.
* App is silent — no push notifications, no email reminders in MVP.
* Free for MVP, no monetization, no ads.
* Anonymized crash reporting + anonymized behavior analytics with form interaction events; both default-on, both opt-out from Settings, both disclosed in Welcome modal.
* Accessibility: basic baseline (contrast, tap targets, dynamic type, screen-reader, keyboard nav).
* Language: English only.
* Future dates not allowed in Add Transaction.
* Large-amount soft warning threshold: ₹10,00,000.
* Zero/negative amount blocked.
* Workspace, financial-Account, and custom-Category deletion: reassign-or-delete-with prompt.
* Visual personality: Serious / Minimal / Cool / Modern (with restraint). Reference family: Linear / Vercel / Notion / Apple Stocks.
* Light mode only in MVP. Dark mode → MVP+. Semantic color tokens built into v1.
* PWA support from MVP (Web App Manifest + Service Worker).
* Multi-tab sync via BroadcastChannel API.
* North Star: Activation (≥ 50% within 7 days). Primary: WAU ≥ 30%, MAU ≥ 45%.

---

## 15. Assumptions & Risks

| # | Type | Item | Mitigation |
| --- | --- | --- | --- |
| 1 | Assumption | Target users are English-fluent, India-based, and download bank statements as CSV/PDF. | Validate with early-user interviews; add Hindi to MVP+ if data shows demand. |
| 2 | Assumption | Major Indian bank PDF formats are stable enough to parse with rules. | Maintain a per-bank format library; treat parser regressions as P1 bugs. |
| 3 | Risk | Browser-local storage means clearing browser data, switching browsers, or using incognito → total data loss. | Disclosed prominently. Backend transaction storage is the highest-priority MVP+ item. |
| 4 | Risk | Multi-device login doesn't sync data in MVP — login is largely decorative. | Acknowledged. The user benefit is multi-Workspace organization in one browser. Cross-device sync is MVP+. |
| 5 | Risk | A user who loses their Recovery Code cannot recover their password (no email fallback). | Strongly worded onboarding ("save this somewhere safe"). MVP+ may add a passkey / WebAuthn alternative. |
| 6 | Risk | Image-only PDFs — common for scanned statements — fail in MVP. | Detection + friendly fallback. OCR is the highest-priority MVP+ for input quality. |
| 7 | Risk | Rule-based categorization will fail on long-tail merchants. | Track Categorization-quality metric. Consider LLM fallback in MVP+. |
| 8 | Risk | Behavior analytics (PostHog) softens the "no data leaves the device" story. | Be specific in Privacy Policy (what is sent, what isn't). Provide opt-out at onboarding and in Settings. Anonymized only. |
| 9 | Risk | Activation target of 50% may be too aggressive for a community-shared link with no marketing. | Re-baseline after 90 days. Target is a v1 ambition, not an SLA. |
| 10 | Risk | Cloudflare Pages free tier limits could be exceeded by viral growth. | Monitor and upgrade tier when needed. Free tier supports significant traffic before paid plans kick in. |
| 11 | Risk | Public URL means the app is accessible to anyone — including users outside India who may have different banking SMS / statement formats. | English + India-bank parsers prioritized. Out-of-scope inputs gracefully fall back to manual entry. |
| 12 | Risk | PostHog Cloud (EU) data sovereignty concerns for Indian users. | Disclosed in Privacy Policy. Self-hosted PostHog is a future option if needed. |

---

## 16. Document Change Log

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 2.0 (DRAFT) | 6 May 2026 | Rishi (with AI Systems Analyst) | **Initial web-app PRD.** Supersedes the mobile-app v1.1 PRD on page 458753 (now archived). Major changes from mobile version: platform pivot (mobile → web on Cloudflare Pages); SMS paste removed; CSV + PDF (incl. password-protected, client-side unlock) added as primary bulk input; multi-Workspace concept added (with renamed terminology Account / Workspace / Account); optional username + password + recovery code authentication with sticky 1-year session; tech stack changed to React + Vite + Hono on Cloudflare Workers + D1; PWA support; mobile-first responsive (desktop polish in MVP+); Light mode only (Dark mode in MVP+); modern evergreen browsers only; analytics expanded with form interaction / drop-off events; multi-tab sync via BroadcastChannel. Architecture decision: backend stores only accountID + auth + analytics; all transaction data is browser-local. |
