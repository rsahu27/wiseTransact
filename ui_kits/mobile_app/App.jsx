// Top-level router for the click-thru
const { useState: useSt } = React;

const App = () => {
  const [route, setRoute] = useSt({ name: "splash" });
  const [tab, setTab] = useSt("home");
  const [showToast, setToast] = useSt(false);
  const [toastMsg, setToastMsg] = useSt("Transaction saved");
  const [showDedup, setDedup] = useSt(false);
  const [transactions, setTransactions] = useTx();
  const [confirmDelete, setConfirmDelete] = useSt(null); // tx | null

  const go = (name, data) => setRoute({ name, ...data });

  const flashToast = (msg) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const handleDelete = (tx) => {
    setTransactions(prev => prev.filter(x => x.id !== tx.id));
    setConfirmDelete(null);
    go("app");
    flashToast(`${tx.type === "expense" ? "Expense" : tx.type === "income" ? "Income" : "Transfer"} deleted`);
  };

  const tabContent = {
    home: <Home transactions={transactions} goTab={setTab} addTx={() => go("add")} openDetail={(t) => go("detail", { tx: t })}/>,
    txns: <TxList transactions={transactions} openDetail={(t) => go("detail", { tx: t })}/>,
    reports: <Reports transactions={transactions}/>,
    settings: <Settings/>,
  };

  let body;
  let withTabs = false;
  if (route.name === "splash") body = <Splash go={() => go("onb-name")}/>;
  else if (route.name === "onb-name") body = <OnbName go={() => go("onb-accounts")}/>;
  else if (route.name === "onb-accounts") body = <OnbAccounts go={() => go("onb-data")}/>;
  else if (route.name === "onb-data") body = <OnbDataWarning go={() => go("onb-disclaimer")}/>;
  else if (route.name === "onb-disclaimer") body = <OnbDisclaimer go={() => go("onb-privacy")}/>;
  else if (route.name === "onb-privacy") body = <OnbPrivacy go={() => { setTab("home"); go("app"); }}/>;
  else if (route.name === "app") { body = tabContent[tab]; withTabs = true; }
  else if (route.name === "add") body = <AddTx back={() => go("app")} onSubmit={() => { setDedup(true); }}/>;
  else if (route.name === "detail") body = <TxDetail tx={route.tx} back={() => go("app")} onDelete={(tx) => setConfirmDelete(tx)}/>;

  return (
    <div className="phone">
      {body}
      {withTabs && <TabBar active={tab} onChange={setTab}/>}
      {showDedup && <DedupSheet onAction={(a) => {
        setDedup(false);
        if (a !== "cancel") { go("app"); flashToast("Transaction saved"); }
      }}/>}
      {confirmDelete && <ConfirmDialog
        title="Delete this transaction?"
        body={`This will remove "${confirmDelete.label}" and update your monthly totals. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />}
      {showToast && <div className="toast"><Icon name="check"/>{toastMsg}</div>}
    </div>
  );
};

window.App = App;
