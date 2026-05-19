// WiseTransact — Web App root
const { useState: useSA } = React;

const PAGE_TITLES = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  reports: "Reports",
  settings: "Settings",
};

const App = () => {
  const [profile, setProfile] = useSA(loadProfile);
  const [page, setPage] = useSA("dashboard");
  const [period, setPeriod] = useSA("This Month");
  const [transactions, setTransactions] = useTx();
  const [editing, setEditing] = useSA(null);
  const [showAdd, setShowAdd] = useSA(false);
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
