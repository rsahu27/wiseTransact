// ============================================================
// WiseTransact — Figma Screen Generator  v1.0  |  May 2026
// Generates 13 screens across 3 rows on the canvas
// Design system: Emerald primary · Inter + JetBrains Mono
// ============================================================

//figma.showUI(__html__, { width: 0, height: 0, visible: false });
//figma.showUI("", { visible: false });
figma.ui.onmessage = (msg) => { if (msg === 'run') main(); };

// ---- Palette (RGB 0–255 → 0–1) ----
const RAW = {
  e900:[6,78,59],   e700:[4,120,87],   e500:[16,185,129],
  e300:[110,231,183], e50:[236,253,245],
  white:[255,255,255], black:[0,0,0],
  g900:[17,24,39],   g700:[55,65,81],   g600:[75,85,99],
  g500:[107,114,128],g400:[156,163,175],g300:[209,213,219],
  g200:[229,231,235],g100:[243,244,246],g50:[249,250,251],
  rose:[244,63,94],  roseL:[255,228,230],
  sky:[14,165,233],  skyL:[224,242,254],
  amber:[245,158,11],amberL:[255,251,235],
  violet:[139,92,246],violetL:[237,233,254],
};
const C = {};
Object.keys(RAW).forEach(k => {
  C[k] = { r: RAW[k][0]/255, g: RAW[k][1]/255, b: RAW[k][2]/255 };
});

const W  = 390;   // screen width
const H  = 844;   // screen height
const CG = 80;    // column gap
const RG = 100;   // row gap

// ---- Primitives ----

function solid(c) { return [{ type: 'SOLID', color: c }]; }

function mkRect(parent, x, y, w, h, fill, radius, stroke, sw) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, h);
  r.fills = fill ? solid(fill) : [];
  if (radius !== undefined) r.cornerRadius = radius;
  if (stroke) { r.strokes = solid(stroke); r.strokeWeight = sw || 1; r.strokeAlign = 'INSIDE'; }
  parent.appendChild(r);
  return r;
}

function mkEllipse(parent, x, y, w, h, fill) {
  const e = figma.createEllipse();
  e.x = x; e.y = y; e.resize(w, h);
  e.fills = fill ? solid(fill) : [];
  parent.appendChild(e);
  return e;
}

async function mkText(parent, str, x, y, size, style, fill, opts = {}) {
  //const t = figma.createText();
  const font = { family: opts.family || 'Inter', style: style || 'Regular' };
  
  await figma.loadFontAsync(font);
  const t = figma.createText();
  
  //t.fontName = { family: opts.family || 'Inter', style: style || 'Regular' };
  t.fontName = font;
  t.fontSize = size;
  t.fills = solid(fill || C.g900);
  t.x = x; t.y = y;
  if (opts.width) { t.textAutoResize = 'HEIGHT'; t.resize(opts.width, 40); }
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.lineH) t.lineHeight = { value: opts.lineH, unit: 'PIXELS' };
  if (opts.tracking) t.letterSpacing = { value: opts.tracking, unit: 'POINTS' };
  if (opts.opacity !== undefined) t.opacity = opts.opacity;
  t.characters = str;
  parent.appendChild(t);
  return t;
}

function mkScreen(name) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(W, H);
  f.fills = solid(C.white);
  f.clipsContent = true;
  figma.currentPage.appendChild(f);
  return f;
}

// ---- Shared Components ----

async function statusBar(p) {
  mkRect(p, 0, 0, W, 44, C.white);
  await mkText(p, '9:41', 20, 14, 15, 'SemiBold', C.g900);
  await mkText(p, '●●● WiFi ▮', W - 100, 14, 11, 'Regular', C.g700);
}

async function bottomNav(p, active) {
  const nav = figma.createFrame();
  nav.name = 'Bottom Nav';
  nav.x = 0; nav.y = H - 83;
  nav.resize(W, 83);
  nav.fills = solid(C.white);
  nav.clipsContent = true;
  mkRect(nav, 0, 0, W, 1, C.g200);

  const tabs = ['Home','Transactions','Reports','Settings'];
  const tabW = W / 4;

  for (let i = 0; i < tabs.length; i++) {
    const tx = tabW * i;
    const isActive = tabs[i] === active;
    const col = isActive ? C.e700 : C.g400;
    // Active indicator bar
    if (isActive) mkRect(nav, tx + tabW/2 - 20, 0, 40, 3, C.e700, 1.5);
    // Icon placeholder
    mkEllipse(nav, tx + tabW/2 - 12, 10, 24, 24, isActive ? C.e50 : C.g100);
    mkRect(nav, tx + tabW/2 - 6, 18, 12, 8, col, 2);
    // Label
    await mkText(nav, tabs[i], tx, 40, 10, isActive ? 'SemiBold' : 'Regular', col,
      { width: tabW, align: 'CENTER' });
  }
  p.appendChild(nav);
}

async function backHeader(p, title) {
  mkRect(p, 0, 44, W, 52, C.white, 0, C.g100, 1);
  await mkText(p, '← Back', 16, 58, 14, 'Medium', C.e700);
  await mkText(p, title, 0, 56, 17, 'SemiBold', C.g900, { width: W, align: 'CENTER' });
}

// ---- Progress dots helper (onboarding) ----
function progressDots(p, active) {
  for (let i = 0; i < 5; i++) {
    const isA = i === active;
    mkRect(p, 163 + i * 16, 60, isA ? 24 : 8, 6, isA ? C.e700 : C.g200, 3);
  }
}

// ---- Transaction row helper ----
async function txRow(p, y, label, sub, amount, type) {
  const dotCol  = type === 'income' ? C.e500 : type === 'transfer' ? C.sky : C.rose;
  const dotBg   = type === 'income' ? C.e50  : type === 'transfer' ? C.skyL : C.roseL;
  const amtCol  = type === 'income' ? C.e700 : type === 'transfer' ? C.sky  : C.rose;

  mkRect(p, 0, y, W, 64, C.white);
  mkRect(p, 0, y + 63, W, 1, C.g100);
  mkEllipse(p, 16, y + 12, 40, 40, dotBg);
  mkEllipse(p, 30, y + 26, 12, 12, dotCol);
  await mkText(p, label,  68, y + 10, 14, 'Medium', C.g900);
  await mkText(p, sub,    68, y + 31, 12, 'Regular', C.g500);
  await mkText(p, amount, W - 100, y + 18, 15, 'SemiBold', amtCol,
    { family: 'Inter', width: 84, align: 'RIGHT' });
}

// ==================================================
//  SCREEN BUILDERS
// ==================================================

// 01 · Splash
async function buildSplash(x, y) {
  const s = mkScreen('01 · Splash');
  s.x = x; s.y = y;
  s.fills = solid(C.e900);

  // Hero gradient overlay strip
  mkRect(s, 0, 0, W, H/2, C.e700, 0);
  mkRect(s, 0, H/2, W, H/2, C.e500, 0);
  // Blend them with a white tinted rect at 0 opacity (visual only)

  // Logo mark
  mkEllipse(s, W/2 - 44, 280, 88, 88, C.white);
  mkEllipse(s, W/2 - 34, 290, 68, 68, C.e500);
  // W letterform
  mkRect(s, W/2 - 22, 308, 8, 32, C.white, 2);
  mkRect(s, W/2 - 6,  318, 8, 22, C.white, 2);
  mkRect(s, W/2 + 10, 308, 8, 32, C.white, 2);

  await mkText(s, 'WiseTransact', 0, 398, 32, 'Bold', C.white,
    { width: W, align: 'CENTER', tracking: -0.5 });
  await mkText(s, 'Your year-end CA report, built daily.', 0, 444, 14, 'Regular', C.e300,
    { width: W, align: 'CENTER', lineH: 22, opacity: 0.85 });

  // Loading dot
  mkEllipse(s, W/2 - 5, 768, 10, 10, C.e300);
}

// 02 · Onboarding — Name
async function buildOnboardingName(x, y) {
  const s = mkScreen('02 · Onboarding — Name');
  s.x = x; s.y = y;
  progressDots(s, 0);

  await mkText(s, 'What should we\ncall you?', 24, 112, 28, 'Bold', C.g900,
    { width: 342, tracking: -0.3, lineH: 38 });
  await mkText(s, "We'll use this to personalise\nyour experience.", 24, 202, 14, 'Regular', C.g600,
    { width: 342, lineH: 22 });

  // Input — active state
  mkRect(s, 24, 268, 342, 56, C.g50, 12, C.e500, 1.5);
  await mkText(s, 'Your preferred name', 40, 284, 16, 'Regular', C.g400);

  // CTA
  mkRect(s, 24, 752, 342, 52, C.e700, 12);
  await mkText(s, 'Continue', 0, 768, 16, 'SemiBold', C.white, { width: W, align: 'CENTER' });
}

// 03 · Onboarding — Account Setup
async function buildOnboardingAccounts(x, y) {
  const s = mkScreen('03 · Onboarding — Accounts');
  s.x = x; s.y = y;
  progressDots(s, 1);

  await mkText(s, 'Set up your\naccounts', 24, 112, 28, 'Bold', C.g900,
    { width: 342, tracking: -0.3, lineH: 38 });
  await mkText(s, 'Add the accounts you want to track.\nYou can change these in Settings later.', 24, 202, 14, 'Regular', C.g600,
    { width: 342, lineH: 22 });

  // Default Cash account
  mkRect(s, 24, 272, 342, 64, C.g50, 12, C.g200, 1);
  mkEllipse(s, 40, 288, 32, 32, C.e50);
  mkEllipse(s, 52, 300, 8, 8, C.e500);
  await mkText(s, 'Cash', 84, 282, 15, 'SemiBold', C.g900);
  await mkText(s, 'Default  ·  Savings', 84, 304, 12, 'Regular', C.g500);
  // Edit chip
  mkRect(s, 326, 290, 28, 28, C.g200, 6);
  await mkText(s, '✎', 326, 294, 14, 'Regular', C.g500, { width: 28, align: 'CENTER' });

  // Add account button
  mkRect(s, 24, 352, 342, 48, null, 10, C.g200, 1);
  await mkText(s, '+ Add Account', 0, 364, 14, 'Medium', C.e700, { width: W, align: 'CENTER' });

  mkRect(s, 24, 752, 342, 52, C.e700, 12);
  await mkText(s, 'Continue', 0, 768, 16, 'SemiBold', C.white, { width: W, align: 'CENTER' });
}

// 04 · Onboarding — Data Loss Warning
async function buildOnboardingDataWarning(x, y) {
  const s = mkScreen('04 · Onboarding — Data Warning');
  s.x = x; s.y = y;
  progressDots(s, 2);

  // Warning icon ring
  mkEllipse(s, W/2 - 44, 148, 88, 88, C.amberL);
  mkRect(s, W/2 - 5, 172, 10, 36, C.amber, 3);
  mkEllipse(s, W/2 - 5, 215, 10, 10, C.amber);

  await mkText(s, 'Your data stays\non this device', 24, 264, 28, 'Bold', C.g900,
    { width: 342, tracking: -0.3, lineH: 38 });
  await mkText(s,
    'WiseTransact stores all data locally. Uninstalling the app or switching phones will permanently delete everything. There is no cloud backup.',
    24, 352, 14, 'Regular', C.g600, { width: 342, lineH: 22 });

  // Alert box
  mkRect(s, 24, 468, 342, 64, C.amberL, 10);
  mkRect(s, 24, 468, 4, 64, C.amber, 0);
  await mkText(s, 'Your data cannot be recovered if you uninstall the app or switch devices.',
    40, 482, 12, 'Medium', C.g700, { width: 306, lineH: 18 });

  mkRect(s, 24, 752, 342, 52, C.e700, 12);
  await mkText(s, 'I understand, Continue', 0, 768, 16, 'SemiBold', C.white, { width: W, align: 'CENTER' });
}

// 05 · Onboarding — Disclaimer
async function buildOnboardingDisclaimer(x, y) {
  const s = mkScreen('05 · Onboarding — Disclaimer');
  s.x = x; s.y = y;
  progressDots(s, 3);

  // Scale icon
  mkEllipse(s, W/2 - 44, 148, 88, 88, C.skyL);
  mkRect(s, W/2 - 20, 174, 40, 4, C.sky, 2);
  mkRect(s, W/2 - 2, 178, 4, 30, C.sky, 2);
  mkRect(s, W/2 - 18, 208, 36, 4, C.sky, 2);

  await mkText(s, 'Not financial\nadvice', 24, 264, 28, 'Bold', C.g900,
    { width: 342, tracking: -0.3, lineH: 38 });
  await mkText(s,
    'WiseTransact helps you keep a record of your transactions. It does not file taxes, calculate tax liability, or provide financial advice.\n\nAlways consult a qualified Chartered Accountant for ITR filing.',
    24, 352, 14, 'Regular', C.g600, { width: 342, lineH: 22 });

  mkRect(s, 24, 752, 342, 52, C.e700, 12);
  await mkText(s, 'Got it, Continue', 0, 768, 16, 'SemiBold', C.white, { width: W, align: 'CENTER' });
}

// 06 · Onboarding — Privacy
async function buildOnboardingPrivacy(x, y) {
  const s = mkScreen('06 · Onboarding — Privacy');
  s.x = x; s.y = y;
  progressDots(s, 4);

  await mkText(s, 'A word on privacy', 24, 112, 24, 'Bold', C.g900, { width: 342 });
  await mkText(s,
    'WiseTransact sends two anonymous data streams to improve reliability. Your transactions, amounts, and names are never sent anywhere.',
    24, 152, 14, 'Regular', C.g600, { width: 342, lineH: 22 });

  async function toggle(label, sub, yPos) {
    mkRect(s, 24, yPos, 342, 76, C.g50, 12, C.g200, 1);
    await mkText(s, label, 40, yPos + 14, 14, 'SemiBold', C.g900);
    await mkText(s, sub, 40, yPos + 36, 12, 'Regular', C.g500, { width: 270, lineH: 18 });
    // Toggle ON
    mkRect(s, 318, yPos + 24, 44, 26, C.e500, 13);
    mkEllipse(s, 340, yPos + 27, 20, 20, C.white);
  }

  await toggle('Crash reporting', 'Anonymous crash traces · default on', 232);
  await toggle('Usage analytics', 'Anonymous event counts · no PII · default on', 324);

  await mkText(s, 'Both can be turned off anytime in Settings → Privacy.',
    24, 416, 12, 'Regular', C.g400, { width: 342, lineH: 18 });

  mkRect(s, 24, 752, 342, 52, C.e700, 12);
  await mkText(s, 'Get Started', 0, 768, 16, 'SemiBold', C.white, { width: W, align: 'CENTER' });
}

// 07 · Home
async function buildHome(x, y) {
  const s = mkScreen('07 · Home');
  s.x = x; s.y = y;

  // Status bar area
  mkRect(s, 0, 0, W, 44, C.e900);
  await mkText(s, '9:41', 20, 14, 15, 'SemiBold', C.e300);
  await mkText(s, '●●● WiFi ▮', W - 100, 14, 11, 'Regular', C.e300);

  // Header gradient band
  mkRect(s, 0, 44, W, 172, C.e900);
  mkRect(s, 0, 44, W, 86, C.e700, 0); // middle tone
  await mkText(s, 'Good morning, Rishi', 20, 56, 14, 'Regular', C.e300, { lineH: 22 });
  await mkText(s, 'May 2026', 20, 80, 22, 'SemiBold', C.white, { lineH: 28 });

  // 3-column summary
  async function sumCol(label, amount, col, px) {
    await mkText(s, label, px, 126, 11, 'Medium', C.e300, { width: 130, align: 'CENTER' });
    await mkText(s, amount, px, 146, 18, 'SemiBold', col, { family: 'Inter', width: 130, align: 'CENTER' });
  }
  await sumCol('Income',   '₹62,400', C.white, 0);
  await sumCol('Expenses', '₹18,320', C.roseL, 130);
  await sumCol('Net',      '₹44,080', C.e300, 260);
  mkRect(s, 130, 126, 1, 44, C.e700);
  mkRect(s, 260, 126, 1, 44, C.e700);

  // White content area
  mkRect(s, 0, 216, W, H - 216, C.g50);

  // Quick add
  mkRect(s, 16, 228, W - 32, 52, C.e700, 12);
  await mkText(s, '+ Add Transaction', 0, 244, 15, 'SemiBold', C.white, { width: W, align: 'CENTER' });

  // Section header
  await mkText(s, 'Recent Transactions', 16, 298, 16, 'SemiBold', C.g900);
  await mkText(s, 'See all →', W - 76, 300, 13, 'Medium', C.e700);

  // Transaction list
  const txns = [
    { label:'Swiggy',           sub:'Food & Dining · UPI',  amount:'-₹340',    type:'expense' },
    { label:'Salary — Acme',    sub:'Salary · HDFC Savings', amount:'+₹62,400', type:'income' },
    { label:'Netflix',          sub:'Entertainment · Card',  amount:'-₹649',    type:'expense' },
    { label:'HDFC → ICICI',     sub:'Transfer · Bank',       amount:'₹5,000',   type:'transfer' },
    { label:'Uber',             sub:'Transport · UPI',       amount:'-₹180',    type:'expense' },
  ];
  for (let i = 0; i < txns.length; i++) {
    const ty = 326 + i * 65;
    if (ty + 65 > H - 83) break;
    await txRow(s, ty, txns[i].label, txns[i].sub, txns[i].amount, txns[i].type);
  }

  // FAB
  mkEllipse(s, W - 72, H - 152, 56, 56, C.e700);
  await mkText(s, '+', W - 72, H - 138, 28, 'Regular', C.white, { width: 56, align: 'CENTER' });

  await bottomNav(s, 'Home');
}

// 08 · Add Transaction
async function buildAddTransaction(x, y) {
  const s = mkScreen('08 · Add Transaction');
  s.x = x; s.y = y;

  await statusBar(s);
  await backHeader(s, 'Add Transaction');

  // Paste SMS banner
  mkRect(s, 16, 104, W - 32, 52, C.e50, 10, C.e300, 1);
  await mkText(s, '📋', 30, 118, 18, 'Regular', C.e700);
  await mkText(s, 'Paste SMS to auto-fill', 58, 114, 13, 'SemiBold', C.e700);
  await mkText(s, 'Tap to paste from clipboard', 58, 132, 11, 'Regular', C.e500);

  // Type toggle
  mkRect(s, 16, 168, W - 32, 44, C.g100, 10);
  mkRect(s, 20, 172, 116, 36, C.white, 8); // Expense selected
  await mkText(s, 'Expense',  20, 182, 13, 'SemiBold', C.g900, { width: 116, align: 'CENTER' });
  await mkText(s, 'Income',  136, 182, 13, 'Regular',  C.g400, { width: 116, align: 'CENTER' });
  await mkText(s, 'Transfer',252, 182, 13, 'Regular',  C.g400, { width: 116, align: 'CENTER' });

  // Fields
  let fy = 228;
  async function field(label, hint, h) {
    await mkText(s, label, 16, fy, 12, 'Medium', C.g500);
    fy += 18;
    mkRect(s, 16, fy, W - 32, h || 48, C.white, 10, C.g200, 1);
    await mkText(s, hint, 28, fy + (h ? Math.floor(h/2) - 10 : 12), 14, 'Regular', C.g400);
    fy += (h || 48) + 14;
  }

  // Amount (special — active with emerald border)
  await mkText(s, 'Amount', 16, fy, 12, 'Medium', C.g500);
  fy += 18;
  mkRect(s, 16, fy, W - 32, 56, C.white, 10, C.e500, 1.5);
  await mkText(s, '₹', 28, fy + 14, 22, 'Regular', C.g300);
  await mkText(s, '0.00', 54, fy + 12, 24, 'SemiBold', C.g200, { family: 'Inter' });
  fy += 56 + 14;

  await field('Account', 'Select account  ▾');
  await field('Date',    'Today, 5 May 2026  ▾');
  await field('Category','Select category  ▾');

  // Purpose tags
  await mkText(s, 'Purpose', 16, fy, 12, 'Medium', C.g500);
  fy += 18;
  const purposes = ['Personal','Professional','Investment','Tax-saving'];
  let px = 16;
  for (const p of purposes) {
    const pw = p.length * 7 + 24;
    const isFirst = p === 'Personal';
    mkRect(s, px, fy, pw, 32, isFirst ? C.e50 : C.g100, 16,
      isFirst ? C.e500 : undefined, isFirst ? 1 : 0);
    await mkText(s, p, px, fy + 9, 12, isFirst ? 'SemiBold' : 'Regular',
      isFirst ? C.e700 : C.g600, { width: pw, align: 'CENTER' });
    px += pw + 8;
  }
  fy += 32 + 14;

  await field('Mode', 'UPI / Card / Cash / Bank Transfer  ▾');
  await field('Notes (optional)', '', 64);

  // Submit — disabled
  mkRect(s, 16, H - 100, W - 32, 52, C.g200, 12);
  await mkText(s, 'Submit', 0, H - 84, 16, 'SemiBold', C.g400, { width: W, align: 'CENTER' });
}

// 09 · Transactions List
async function buildTransactionsList(x, y) {
  const s = mkScreen('09 · Transactions');
  s.x = x; s.y = y;

  await statusBar(s);

  // Header
  mkRect(s, 0, 44, W, 52, C.white, 0, C.g100, 1);
  await mkText(s, 'Transactions', 16, 56, 20, 'SemiBold', C.g900);
  mkRect(s, W - 56, 52, 40, 40, C.g100, 10);
  await mkText(s, '⌕', W - 44, 60, 18, 'Regular', C.g500);
  mkRect(s, W - 100, 52, 40, 40, C.g100, 10);
  await mkText(s, '⊞', W - 90, 60, 16, 'Regular', C.g500);

  // Period picker
  mkRect(s, 0, 96, W, 44, C.g50);
  mkRect(s, 16, 104, W - 32, 28, C.white, 8, C.g200, 1);
  await mkText(s, 'May 2026  ▾', 28, 112, 13, 'Medium', C.g700);

  // Summary strip
  mkRect(s, 0, 140, W, 52, C.e50);
  async function sumStrip(label, amount, col, px) {
    await mkText(s, label, px, 148, 11, 'Regular', C.g500, { width: 130, align: 'CENTER' });
    await mkText(s, amount, px, 164, 14, 'SemiBold', col, { family: 'Inter', width: 130, align: 'CENTER' });
  }
  await sumStrip('Income',   '₹62,400', C.e700,  0);
  await sumStrip('Expenses', '₹18,320', C.rose, 130);
  await sumStrip('Net',      '₹44,080', C.e700, 260);

  // Filter chips
  let chipX = 16;
  const chips = [
    { label:'All', active: true },
    { label:'Income',   active: false },
    { label:'Expense',  active: false },
    { label:'Transfer', active: false },
  ];
  for (const chip of chips) {
    const cw = chip.label.length * 7.5 + 24;
    mkRect(s, chipX, 204, cw, 28, chip.active ? C.e700 : C.white, 14,
      chip.active ? undefined : C.g200, 1);
    await mkText(s, chip.label, chipX, 212, 12, 'Medium',
      chip.active ? C.white : C.g600, { width: cw, align: 'CENTER' });
    chipX += cw + 8;
  }

  // Grouped tx list
  const groups = [
    { label: 'Today · 5 May 2026', items: [
      { label:'Swiggy',          sub:'Food & Dining', amount:'-₹340',    type:'expense' },
      { label:'Ola',             sub:'Transport',     amount:'-₹120',    type:'expense' },
    ]},
    { label: 'Yesterday · 4 May 2026', items: [
      { label:'Salary — Acme Corp', sub:'Salary',     amount:'+₹62,400', type:'income' },
      { label:'Netflix',            sub:'Entertainment',amount:'-₹649',  type:'expense' },
    ]},
    { label: '3 May 2026', items: [
      { label:'HDFC → ICICI', sub:'Transfer', amount:'₹5,000', type:'transfer' },
    ]},
  ];

  let gy = 244;
  for (const g of groups) {
    if (gy > H - 100) break;
    mkRect(s, 0, gy, W, 28, C.g50);
    await mkText(s, g.label, 16, gy + 8, 11, 'SemiBold', C.g500);
    gy += 28;
    for (const t of g.items) {
      if (gy > H - 100) break;
      await txRow(s, gy, t.label, t.sub, t.amount, t.type);
      gy += 64;
    }
  }

  await bottomNav(s, 'Transactions');
}

// 10 · Transaction Detail
async function buildTransactionDetail(x, y) {
  const s = mkScreen('10 · Transaction Detail');
  s.x = x; s.y = y;

  await statusBar(s);
  await backHeader(s, 'Transaction Detail');

  // Amount hero
  mkRect(s, 0, 96, W, 100, C.roseL);
  await mkText(s, '-₹340.00', 0, 116, 38, 'SemiBold', C.rose,
    { family: 'Inter', width: W, align: 'CENTER', tracking: -0.5 });
  await mkText(s, 'Expense  ·  5 May 2026', 0, 164, 13, 'Regular', C.g500,
    { width: W, align: 'CENTER' });

  // Detail rows
  const rows = [
    { label:'Merchant',  value:'Swiggy' },
    { label:'Category',  value:'Food & Dining' },
    { label:'Account',   value:'HDFC Savings' },
    { label:'Date',      value:'5 May 2026' },
    { label:'Purpose',   value:'Personal' },
    { label:'Mode',      value:'UPI' },
    { label:'Notes',     value:'—' },
    { label:'Source',    value:'SMS Paste' },
  ];

  for (let i = 0; i < rows.length; i++) {
    const ry = 216 + i * 52;
    mkRect(s, 0, ry, W, 52, i % 2 === 0 ? C.white : C.g50);
    mkRect(s, 16, ry + 51, W - 16, 1, C.g100);
    await mkText(s, rows[i].label, 16, ry + 8, 11, 'Regular', C.g400);
    await mkText(s, rows[i].value, 16, ry + 28, 14, 'Medium', C.g900);
  }

  // Actions
  const btnW = (W - 48) / 2;
  mkRect(s, 16,        H - 100, btnW, 48, C.roseL, 10);
  mkRect(s, 32 + btnW, H - 100, btnW, 48, C.e700,  10);
  await mkText(s, 'Delete', 16,        H - 82, 15, 'SemiBold', C.rose,  { width: btnW, align: 'CENTER' });
  await mkText(s, 'Edit',   32 + btnW, H - 82, 15, 'SemiBold', C.white, { width: btnW, align: 'CENTER' });
}

// 11 · Reports
async function buildReports(x, y) {
  const s = mkScreen('11 · Reports');
  s.x = x; s.y = y;

  await statusBar(s);
  mkRect(s, 0, 44, W, 52, C.white, 0, C.g100, 1);
  await mkText(s, 'Reports', 16, 56, 20, 'SemiBold', C.g900);

  // Period picker
  mkRect(s, 16, 110, W - 32, 36, C.white, 8, C.g200, 1);
  await mkText(s, 'This Month  ▾', 28, 120, 13, 'Medium', C.g700, { width: W - 64 });

  // Summary cards
  async function sumCard(label, amount, col, bg, cx) {
    mkRect(s, cx, 160, 112, 72, bg, 12);
    await mkText(s, label,  cx, 172, 11, 'Regular', C.g500, { width: 112, align: 'CENTER' });
    await mkText(s, amount, cx, 192, 15, 'SemiBold', col,   { family: 'Inter', width: 112, align: 'CENTER' });
  }
  await sumCard('Income',   '₹62,400', C.e700,  C.e50,   16);
  await sumCard('Expenses', '₹18,320', C.rose,  C.roseL, 140);
  await sumCard('Net',      '₹44,080', C.e700,  C.e50,   264);

  // Monthly bar chart
  mkRect(s, 16, 248, W - 32, 196, C.white, 12, C.g200, 1);
  await mkText(s, 'Monthly Trend', 28, 262, 13, 'SemiBold', C.g900);

  const months = ['Jan','Feb','Mar','Apr','May'];
  const inc  = [0.35, 0.60, 0.45, 0.80, 0.55];
  const exp  = [0.25, 0.40, 0.30, 0.55, 0.38];
  const barH = 110; const barW = 16; const gW = 50;
  const csx = 36; const csy = 286;

  for (let i = 0; i < 5; i++) {
    const gx = csx + i * gW;
    mkRect(s, gx + 4,  csy + barH - Math.round(inc[i]*barH), barW, Math.round(inc[i]*barH), C.e500, 3);
    mkRect(s, gx + 24, csy + barH - Math.round(exp[i]*barH), barW, Math.round(exp[i]*barH), C.rose,  3);
    await mkText(s, months[i], gx, csy + barH + 6, 10, 'Regular', C.g400, { width: 44, align: 'CENTER' });
  }
  // Legend
  mkRect(s, 28, 416, 10, 10, C.e500, 2);
  await mkText(s, 'Income', 42, 415, 10, 'Regular', C.g600);
  mkRect(s, 100, 416, 10, 10, C.rose, 2);
  await mkText(s, 'Expenses', 114, 415, 10, 'Regular', C.g600);

  // Category breakdown
  await mkText(s, 'Expenses by Category', 16, 460, 14, 'SemiBold', C.g900);

  // Stacked bar
  const catData = [
    { col: C.amber,  w: 142, label: 'Food & Dining',   pct: '42%' },
    { col: C.sky,    w:  62, label: 'Transport',        pct: '18%' },
    { col: C.violet, w:  74, label: 'Entertainment',    pct: '22%' },
    { col: C.g300,   w:  60, label: 'Other',            pct: '18%' },
  ];
  let bx = 16;
  for (const c of catData) { mkRect(s, bx, 482, c.w, 12, c.col, 6); bx += c.w + 2; }

  for (let i = 0; i < catData.length; i++) {
    const c = catData[i];
    const lx = 16 + (i % 2) * 187;
    const ly = 506 + Math.floor(i / 2) * 26;
    mkEllipse(s, lx, ly + 2, 10, 10, c.col);
    await mkText(s, `${c.label}  ${c.pct}`, lx + 14, ly, 11, 'Regular', C.g700);
  }

  // PDF download — disabled (non-FY period)
  mkRect(s, 16, H - 144, W - 32, 52, C.g100, 12, C.g200, 1);
  await mkText(s, '⬇  Download PDF — available for Financial Year only', 0, H - 128, 12, 'Medium', C.g400,
    { width: W, align: 'CENTER' });

  await bottomNav(s, 'Reports');
}

// 12 · Settings
async function buildSettings(x, y) {
  const s = mkScreen('12 · Settings');
  s.x = x; s.y = y;

  await statusBar(s);
  mkRect(s, 0, 44, W, 52, C.white, 0, C.g100, 1);
  await mkText(s, 'Settings', 16, 56, 20, 'SemiBold', C.g900);

  let sy = 108;

  async function sectionLabel(title) {
    mkRect(s, 0, sy, W, 32, C.g50);
    await mkText(s, title, 16, sy + 9, 11, 'SemiBold', C.g400);
    sy += 32;
  }

  async function row(label, sub, badge, destructive) {
    mkRect(s, 0, sy, W, sub ? 60 : 52, C.white);
    mkRect(s, 16, sy + (sub ? 59 : 51), W - 16, 1, C.g100);
    await mkText(s, label, 16, sy + (sub ? 10 : 16), 14,
      destructive ? 'Medium' : 'Regular',
      destructive ? C.rose : C.g900);
    if (sub) await mkText(s, sub, 16, sy + 34, 11, 'Regular', C.g400);
    if (badge) {
      mkRect(s, W - 60, sy + (sub ? 18 : 14), 44, 22, C.g100, 11);
      await mkText(s, badge, W - 60, sy + (sub ? 20 : 16), 11, 'Medium', C.g500,
        { width: 44, align: 'CENTER' });
    } else {
      await mkText(s, '›', W - 28, sy + (sub ? 18 : 14), 20, 'Regular', C.g300);
    }
    sy += (sub ? 60 : 52);
  }

  async function toggleRow(label, sub) {
    mkRect(s, 0, sy, W, 60, C.white);
    mkRect(s, 16, sy + 59, W - 16, 1, C.g100);
    await mkText(s, label, 16, sy + 10, 14, 'Regular', C.g900);
    await mkText(s, sub, 16, sy + 32, 11, 'Regular', C.g400);
    mkRect(s, W - 68, sy + 18, 44, 26, C.e500, 13);
    mkEllipse(s, W - 26 - 20, sy + 21, 20, 20, C.white);
    sy += 60;
  }

  await sectionLabel('PROFILE');
  await row('Rishi Raj Sahu', 'Tap to edit name');

  await sectionLabel('ACCOUNTS');
  await row('HDFC Savings',       'Savings account',  '24 txns');
  await row('ICICI Credit Card',  'Credit card',      '8 txns');
  await row('+ Add Account',      null, null);

  await sectionLabel('DATA');
  await row('Delete all data', 'This cannot be undone', null, true);

  await sectionLabel('PRIVACY');
  await toggleRow('Crash reporting',   'Anonymous · default on');
  await toggleRow('Usage analytics',   'No PII or transaction data · default on');

  await sectionLabel('LEGAL & HELP');
  await row('Privacy Policy');
  await row('Terms of Service');
  await row('About WiseTransact', 'Version 1.0.0');
  await row('Contact / Feedback');

  await bottomNav(s, 'Settings');
}

// 13 · Dedup Dialog
async function buildDedupDialog(x, y) {
  const s = mkScreen('13 · Dedup Dialog (Home)');
  s.x = x; s.y = y;

  // Dim overlay (simulate by drawing home bg with dark overlay)
  mkRect(s, 0, 0, W, H, C.g50);
  await mkText(s, 'Home (dimmed)', 0, H/2 - 20, 13, 'Regular', C.g400,
    { width: W, align: 'CENTER', opacity: 0.4 });

  // Overlay dim
  const dimRect = figma.createRectangle();
  dimRect.x = 0; dimRect.y = 0; dimRect.resize(W, H);
  dimRect.fills = [{ type: 'SOLID', color: C.g900 }];
  dimRect.opacity = 0.5;
  s.appendChild(dimRect);

  // Bottom sheet
  const shY = 360;
  mkRect(s, 0, shY, W, H - shY, C.white, 0);
  // Rounded top via corner trick
  mkRect(s, 0, shY, W, 24, C.white, 0);
  mkRect(s, W/2 - 20, shY + 10, 40, 4, C.g300, 2);

  await mkText(s, 'Possible Duplicate Found', 24, shY + 28, 17, 'SemiBold', C.g900, { width: W - 48 });
  await mkText(s, 'A similar transaction already exists.\nWhat would you like to do?',
    24, shY + 56, 13, 'Regular', C.g600, { width: W - 48, lineH: 20 });

  // Existing entry card
  mkRect(s, 16, shY + 100, W - 32, 72, C.g50, 10, C.g200, 1);
  await mkText(s, 'EXISTING', 28, shY + 110, 9, 'SemiBold', C.g400);
  await mkText(s, 'Swiggy  ·  Food & Dining', 28, shY + 126, 13, 'Medium', C.g900);
  await mkText(s, 'HDFC Savings  ·  5 May 2026  ·  UPI', 28, shY + 148, 11, 'Regular', C.g500);
  await mkText(s, '-₹340', W - 88, shY + 128, 15, 'SemiBold', C.rose, { family: 'Inter' });

  // Action buttons
  const btns = [
    { label:'Discard new entry',        col: C.g900, bg: C.g100 },
    { label:'Merge into existing',      col: C.e700, bg: C.e50  },
    { label:'Add anyway (keep both)',   col: C.rose, bg: C.roseL },
  ];
  for (let i = 0; i < btns.length; i++) {
    const b = btns[i];
    mkRect(s, 16, shY + 190 + i * 60, W - 32, 48, b.bg, 10);
    await mkText(s, b.label, 16, shY + 204 + i * 60, 14, 'Medium', b.col,
      { width: W - 32, align: 'CENTER' });
  }
}

// ==================================================
//  MAIN
// ==================================================

async function main() {
  // Load all required fonts
  const fonts = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Inter', style: 'SemiBold' },
    { family: 'Inter', style: 'Bold' },
  ];
  //await Promise.all(fonts.map(f => figma.loadFontAsync(f)));
  for (const f of fonts) {
    await figma.loadFontAsync(f);
  }

  const col = W + CG;
  const row = H + RG;

  // Row 1 — Onboarding flow (6 screens)
  await buildSplash(            0,       0);
  await buildOnboardingName(    col * 1, 0);
  await buildOnboardingAccounts(col * 2, 0);
  await buildOnboardingDataWarning(col * 3, 0);
  await buildOnboardingDisclaimer( col * 4, 0);
  await buildOnboardingPrivacy(    col * 5, 0);

  // Row 2 — Core flows (4 screens)
  await buildHome(              0,       row);
  await buildAddTransaction(    col * 1, row);
  await buildTransactionsList(  col * 2, row);
  await buildTransactionDetail( col * 3, row);

  // Row 3 — Reports, Settings, Dedup (3 screens)
  await buildReports(           0,       row * 2);
  await buildSettings(          col * 1, row * 2);
  await buildDedupDialog(       col * 2, row * 2);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  await new Promise(r => setTimeout(r, 100));
  figma.closePlugin('✅  All 13 WiseTransact screens created!');
}

//main().catch(err => figma.closePlugin('❌  Error: ' + err.message));
async function run() {
  try {
    await main();
  } catch (err) {
    figma.closePlugin('❌ Error: ' + err.message);
  }
}

run();