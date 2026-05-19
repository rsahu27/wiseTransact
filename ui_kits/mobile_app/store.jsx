// Shared, persistent stores for accounts/categories/modes.
// Read by Onboarding (write/edit accounts) and AddTx (read for picker).
const WT_STORE_KEY = "wt_accounts_v1";

const DEFAULT_ACCOUNTS = [
  { id: 1, name: "Cash", type: "Cash", isDefault: true },
];

const loadAccounts = () => {
  try {
    const raw = localStorage.getItem(WT_STORE_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ACCOUNTS;
  } catch { return DEFAULT_ACCOUNTS; }
};
const saveAccounts = (accounts) => {
  try { localStorage.setItem(WT_STORE_KEY, JSON.stringify(accounts)); } catch {}
};

const useAccounts = () => {
  const [accounts, setAccounts] = React.useState(loadAccounts);
  React.useEffect(() => { saveAccounts(accounts); }, [accounts]);
  return [accounts, setAccounts];
};

// Static catalogs
const CATEGORIES = [
  { name: "Food & Dining", icon: "utensils" },
  { name: "Groceries",     icon: "shoppingBag" },
  { name: "Travel",        icon: "plane" },
  { name: "Transport",     icon: "car" },
  { name: "Shopping",      icon: "shoppingBag" },
  { name: "Bills & Utilities", icon: "zap" },
  { name: "Health",        icon: "heart" },
  { name: "Entertainment", icon: "tv" },
  { name: "Rent",          icon: "home" },
  { name: "Salary",        icon: "briefcase" },
  { name: "Investment",    icon: "trendingUp" },
  { name: "Other",         icon: "moreHorizontal" },
];

const MODES = ["UPI", "Card", "Cash", "Bank Transfer", "Wallet", "Cheque"];

// --- Transactions store ---
const WT_TX_KEY = "wt_transactions_v1";

// Numeric value (signed): positive for income, negative for expense, 0 for transfer
const txValue = (t) => {
  if (t.type === "income") return Math.abs(t.amountNum ?? 0);
  if (t.type === "expense") return -Math.abs(t.amountNum ?? 0);
  return 0; // transfer is net-zero across accounts
};

const fmtINR = (n) => {
  const abs = Math.abs(n);
  return "₹" + abs.toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

const loadTx = () => {
  try {
    const raw = localStorage.getItem(WT_TX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};
const saveTx = (tx) => { try { localStorage.setItem(WT_TX_KEY, JSON.stringify(tx)); } catch {} };

const useTx = () => {
  const [tx, setTx] = React.useState(loadTx);
  React.useEffect(() => { saveTx(tx); }, [tx]);
  return [tx, setTx];
};

const totalsFor = (txs) => {
  let income = 0, expense = 0;
  for (const t of txs) {
    if (t.type === "income") income += Math.abs(t.amountNum || 0);
    else if (t.type === "expense") expense += Math.abs(t.amountNum || 0);
  }
  return { income, expense, net: income - expense };
};

Object.assign(window, { useAccounts, loadAccounts, saveAccounts, CATEGORIES, MODES, DEFAULT_ACCOUNTS, useTx, loadTx, saveTx, totalsFor, fmtINR, txValue });
