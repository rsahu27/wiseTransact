// WiseTransact — Web App root
const { useState: useSA } = React;

// Demo mode: if ?demo=<page> is in the URL, pre-seed localStorage so the
// onboarding gate is skipped and the right page is shown instantly.
(() => {
  const p = new URLSearchParams(window.location.search).get("demo");
  if (!p) return;
  const profile = loadProfile();
  if (!profile.onboarded) {
    saveProfile({ name: "Alex", onboarded: true, crash: false, analytics: false });
    const DEMO_TX = [
      { id: 1, type: "income",   label: "Salary — TechCorp",     amount: "₹1,20,000", rawAmount: 120000, category: "Salary",       account: "HDFC Savings",  date: "1 May 2026",  mode: "NEFT" },
      { id: 2, type: "expense",  label: "Swiggy",                amount: "₹648",      rawAmount: 648,    category: "Food",          account: "HDFC Savings",  date: "3 May 2026",  mode: "UPI"  },
      { id: 3, type: "expense",  label: "AWS",                   amount: "₹2,340",    rawAmount: 2340,   category: "Software",      account: "HDFC Savings",  date: "5 May 2026",  mode: "Card" },
      { id: 4, type: "income",   label: "Freelance — UI Design", amount: "₹18,000",   rawAmount: 18000,  category: "Freelance",     account: "HDFC Savings",  date: "7 May 2026",  mode: "IMPS" },
      { id: 5, type: "expense",  label: "Airtel Broadband",      amount: "₹999",      rawAmount: 999,    category: "Utilities",     account: "HDFC Savings",  date: "9 May 2026",  mode: "UPI"  },
      { id: 6, type: "transfer", label: "HDFC → ICICI",          amount: "₹10,000",   rawAmount: 10000,  category: "Transfer",      account: "HDFC Savings",  date: "10 May 2026", mode: "NEFT" },
      { id: 7, type: "expense",  label: "Zomato",                amount: "₹420",      rawAmount: 420,    category: "Food",          account: "SBI Credit",    date: "12 May 2026", mode: "Card" },
      { id: 8, type: "expense",  label: "Reliance Smart",        amount: "₹3,210",    rawAmount: 3210,   category: "Groceries",     account: "SBI Credit",    date: "14 May 2026", mode: "Card" },
      { id: 9, type: "income",   label: "GST Refund",            amount: "₹4,500",    rawAmount: 4500,   category: "Refund",        account: "HDFC Savings",  date: "16 May 2026", mode: "NEFT" },
      { id:10, type: "expense",  label: "Netflix",               amount: "₹649",      rawAmount: 649,    category: "Entertainment", account: "SBI Credit",    date: "18 May 2026", mode: "Card" },
    ];
    if (!loadTx().length) saveTx(DEMO_TX);
    const accs = loadAccounts();
    if (!accs.length) saveAccounts([{ id: 1, name: "HDFC Savings", type: "Savings" }, { id: 2, name: "SBI Credit", type: "Credit Card" }]);
  }
})();

const DEMO_PAGE = new URLSearchParams(window.location.search).get("demo");

const PAGE_TITLES = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  reports: "Reports",
  settings: "Settings",
};

const App = () => {
  const [profile, setProfile] = useSA(loadProfile);
  const validPages = ["dashboard","transactions","reports","settings"];
  const initPage = validPages.includes(DEMO_PAGE) ? DEMO_PAGE : "dashboard";
  const [page, setPage] = useSA(initPage);
  const [period, setPeriod] = useSA("This Month");
  const [transactions, setTransactions] = useTx();
  const [editing, setEditing] = useSA(null);
  const [showAdd, setShowAdd] = useSA(DEMO_PAGE === "add");
  const [detail, setDetail] = useSA(null);
  const [confirm, setConfirm] = useSA(null);
  const [toast, setToast] = useSA(null);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  const handleOnboardingComplete = (data) => {
    const p = { ...data, onboarded: true };
    saveProfile(p);
    setProfile(p);
  };

  if (!profile.onboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete}/>;
  }

  const userName = profile.name || "there";

  const handleSaveTx = (tx, isEdit) => {
    if (isEdit) {
      setTransactions(prev => prev.map(x => x.id === tx.id ? tx : x));
      flash(`${tx.type[0].toUpperCase() + tx.type.slice(1)} updated`);
    } else {
      setTransactions(prev => [tx, ...prev]);
      flash(`${tx.type[0].toUpperCase() + tx.type.slice(1)} added`);
    }
    setShowAdd(false);
    setEditing(null);
  };
  const handleDelete = (tx) => {
    setTransactions(prev => prev.filter(x => x.id !== tx.id));
    setConfirm(null);
    setDetail(null);
    flash(`${tx.type[0].toUpperCase() + tx.type.slice(1)} deleted · totals updated`);
  };
  const handleEdit = (tx) => {
    setDetail(null);
    setEditing(tx);
  };

  const page_el =
    page === "dashboard"    ? <Dashboard       transactions={transactions} openDetail={setDetail} openAdd={() => setShowAdd(true)} goPage={setPage} userName={userName} period={period}/> :
    page === "transactions" ? <TransactionsPage transactions={transactions} openDetail={setDetail} period={period}/> :
    page === "reports"      ? <ReportsPage     transactions={transactions} userName={userName}/> :
                              <SettingsPage    transactions={transactions} profile={profile} onProfileSave={p => { const np = {...profile, ...p}; saveProfile(np); setProfile(np); }}/>;

  return (
    <div className="app-shell">
      <Sidebar active={page} onNav={setPage} userName={userName}/>
      <main className="main">
        <Topbar
          crumb={<><span style={{color: "var(--fg-muted)"}}>WiseTransact</span><span className="sep">/</span>{PAGE_TITLES[page]}</>}
          period={period}
          onPeriodChange={setPeriod}
          showPeriodPicker={page === "dashboard" || page === "transactions"}
          onAdd={() => setShowAdd(true)}
        />
        <div className="content">{page_el}</div>
      </main>

      {showAdd && <AddTxModal onCancel={() => setShowAdd(false)} onSave={handleSaveTx}/>}
      {editing && <AddTxModal initial={editing} onCancel={() => setEditing(null)} onSave={handleSaveTx}/>}
      {detail && <DetailModal tx={detail} onClose={() => setDetail(null)} onDelete={(tx) => setConfirm({ tx })} onEdit={handleEdit}/>}
      {confirm && <ConfirmDialog
        title="Delete this transaction?"
        body={`This will remove "${confirm.tx.label}" and update your monthly totals. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(confirm.tx)}
        onCancel={() => setConfirm(null)}
      />}
      {toast && <div className="toast"><Icon name="check" size={16}/>{toast}</div>}
    </div>
  );
};

window.App = App;
