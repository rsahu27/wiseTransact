// WiseTransact — Web App screens
const { useState: useS, useRef: useR, useEffect: useE } = React;

// ---------- Dashboard ----------
const Dashboard = ({ transactions, openDetail, openAdd, goPage }) => {
  const totals = totalsFor(transactions);
  const recent = transactions.slice(0, 6);
  const months = [["Jan",.35,.25],["Feb",.6,.4],["Mar",.45,.3],["Apr",.8,.55],["May",.55,.38]];
  return (
    <>
      <h1 className="page-title">Good morning, Rishi</h1>
      <p className="page-sub">Here's how May 2026 is shaping up.</p>

      <div className="kpis">
        <KPI kind="income"  label="Income"   amount={fmtINR(totals.income)}  delta="↑ across 3 sources"/>
        <KPI kind="expense" label="Expenses" amount={fmtINR(totals.expense)} delta={`${transactions.filter(t=>t.type==="expense").length} transactions`}/>
        <KPI kind="net"     label="Net"      amount={(totals.net < 0 ? "-" : "") + fmtINR(totals.net)} delta="Income − Expenses"/>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head">
            <h3>Recent Transactions</h3>
            <button className="link" onClick={() => goPage("transactions")}>View all →</button>
          </div>
          <TxTable rows={recent} compact onRowClick={openDetail}/>
        </div>

        <div className="card">
          <div className="card-head"><h3>Monthly Trend</h3></div>
          <div className="card-body">
            <div className="trend">
              {months.map(([m, i, e]) => (
                <div key={m} className="col">
                  <div className="bars">
                    <div className="bar income" style={{height: `${i*100}%`}}/>
                    <div className="bar expense" style={{height: `${e*100}%`}}/>
                  </div>
                  <div className="month">{m}</div>
                </div>
              ))}
            </div>
            <div className="legend">
              <span><span className="sw" style={{background: "var(--emerald-500)"}}/>Income</span>
              <span><span className="sw" style={{background: "var(--expense-fg)"}}/>Expenses</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------- Transactions ----------
const TransactionsPage = ({ transactions, openDetail }) => {
  const [filter, setFilter] = useS("All");
  const [search, setSearch] = useS("");
  const totals = totalsFor(transactions);
  const rows = transactions.filter(t => {
    if (filter !== "All" && t.type !== filter.toLowerCase()) return false;
    if (search && !(t.label + " " + (t.category||"") + " " + (t.account||"")).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <>
      <h1 className="page-title">Transactions</h1>
      <p className="page-sub">All entries for May 2026 · {rows.length} {rows.length === 1 ? "record" : "records"}</p>

      <div className="kpis">
        <KPI kind="income"  label="Income"   amount={fmtINR(totals.income)}/>
        <KPI kind="expense" label="Expenses" amount={fmtINR(totals.expense)}/>
        <KPI kind="net"     label="Net"      amount={(totals.net < 0 ? "-" : "") + fmtINR(totals.net)}/>
      </div>

      <div className="card">
        <div className="card-head" style={{gap: 12, flexWrap: "wrap"}}>
          <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
            {["All","Income","Expense","Transfer"].map(c => (
              <span key={c} className={`chip ${filter===c?"active":""}`} onClick={() => setFilter(c)}>{c}</span>
            ))}
          </div>
          <div style={{position: "relative", flex: 1, maxWidth: 280, marginLeft: "auto"}}>
            <input className="input" placeholder="Search merchant, category…" value={search} onChange={e => setSearch(e.target.value)} style={{paddingLeft: 36}}/>
            <span style={{position: "absolute", left: 12, top: 11, color: "var(--fg-muted)"}}><Icon name="search" size={16}/></span>
          </div>
        </div>
        <TxTable rows={rows} onRowClick={openDetail} emptyText="No transactions match this filter."/>
      </div>
    </>
  );
};

// ---------- Reports ----------
const PERIOD_OPTIONS = ["This Month", "Last Month", "This Quarter", "This Financial Year", "Last Financial Year"];

const ReportsPage = ({ transactions }) => {
  const [period, setPeriod] = useS("This Month");
  const totals = totalsFor(transactions);
  const months = [["Jan",.35,.25],["Feb",.6,.4],["Mar",.45,.3],["Apr",.8,.55],["May",.55,.38]];
  const cats = [
    { name: "Food & Dining",   pct: 42, color: "var(--amber-500)" },
    { name: "Entertainment",   pct: 22, color: "var(--violet-500)" },
    { name: "Transport",       pct: 18, color: "var(--sky-500)" },
    { name: "Other",           pct: 18, color: "var(--gray-300)" },
  ];

  const isFY = period.includes("Financial Year");
  const handleDownload = () => {
    const accounts = loadAccounts();
    generateReportPdf({
      transactions,
      periodLabel: period === "This Financial Year" ? "FY 2025-26" : "FY 2024-25",
      userName: "Rishi Raj Sahu",
      accounts,
    });
  };

  return (
    <>
      <h1 className="page-title">Reports</h1>
      <p className="page-sub">In-app dashboard mirrors the year-end PDF report.</p>

      <div style={{display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap"}}>
        <div className="field-group" style={{minWidth: 240}}>
          <div className="lbl">Period</div>
          <select className="select" value={period} onChange={e => setPeriod(e.target.value)}>
            {PERIOD_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="kpis">
        <KPI kind="income"  label="Income"   amount={fmtINR(totals.income)}/>
        <KPI kind="expense" label="Expenses" amount={fmtINR(totals.expense)}/>
        <KPI kind="net"     label="Net"      amount={(totals.net < 0 ? "-" : "") + fmtINR(totals.net)}/>
      </div>

      <div className="dash-grid" style={{gridTemplateColumns: "3fr 2fr"}}>
        <div className="card">
          <div className="card-head"><h3>Monthly Trend</h3></div>
          <div className="card-body">
            <div className="trend" style={{height: 240}}>
              {months.map(([m, i, e]) => (
                <div key={m} className="col">
                  <div className="bars" style={{height: 200}}>
                    <div className="bar income" style={{height: `${i*100}%`, width: 20}}/>
                    <div className="bar expense" style={{height: `${e*100}%`, width: 20}}/>
                  </div>
                  <div className="month">{m}</div>
                </div>
              ))}
            </div>
            <div className="legend">
              <span><span className="sw" style={{background: "var(--emerald-500)"}}/>Income</span>
              <span><span className="sw" style={{background: "var(--expense-fg)"}}/>Expenses</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Expenses by Category</h3></div>
          <div className="card-body">
            <div style={{display: "flex", height: 12, gap: 2, marginBottom: 16}}>
              {cats.map(c => <div key={c.name} style={{flex: c.pct, background: c.color, borderRadius: 6}}/>)}
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
              {cats.map(c => (
                <div key={c.name} style={{display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13}}>
                  <span style={{display: "flex", alignItems: "center", gap: 10}}>
                    <span style={{width: 10, height: 10, borderRadius: "50%", background: c.color, display: "inline-block"}}/>
                    <span>{c.name}</span>
                  </span>
                  <span style={{fontVariantNumeric: "tabular-nums", color: "var(--fg-secondary)"}}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: 16, padding: 20, display: "flex", alignItems: "center", gap: 16, background: isFY ? "var(--emerald-50)" : "var(--gray-50)", borderColor: isFY ? "var(--emerald-300)" : "var(--border-subtle)"}}>
        <div style={{width: 40, height: 40, borderRadius: 10, background: "var(--white)", border: "1px solid var(--border-default)", color: isFY ? "var(--emerald-700)" : "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Icon name="download" size={18}/>
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 14, fontWeight: 600}}>Download Year-End PDF</div>
          <div style={{fontSize: 12, color: "var(--fg-muted)", marginTop: 2}}>
            {isFY
              ? `Comprehensive report for ${period === "This Financial Year" ? "FY 2025–26" : "FY 2024–25"} — ready to share with your CA.`
              : "Switch the period to \u201CThis Financial Year\u201D or \u201CLast Financial Year\u201D to download (PRD \u00a76.9)."}
          </div>
        </div>
        <button className={isFY ? "btn primary" : "btn ghost"} disabled={!isFY} onClick={handleDownload}>
          <Icon name="download" size={14}/> Download PDF
        </button>
      </div>
    </>
  );
};

// ---------- Settings ----------
const SettingsPage = ({ transactions }) => {
  const [accounts, setAccounts] = useAccounts();
  const [editing, setEditing] = useS(null);
  const [crash, setCrash] = useS(true);
  const [analytics, setAnalytics] = useS(true);
  const txCountByAccount = (name) => transactions.filter(t => t.account === name).length;

  const editTarget = editing === "new" ? null : accounts.find(a => a.id === editing);
  const handleSave = (data) => {
    if (editing === "new") setAccounts(prev => [...prev, { id: Date.now(), ...data }]);
    else setAccounts(prev => prev.map(a => a.id === editing ? { ...a, ...data } : a));
    setEditing(null);
  };
  const handleDelete = () => {
    setAccounts(prev => prev.filter(a => a.id !== editing));
    setEditing(null);
  };

  return (
    <>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Manage profile, accounts, and privacy controls.</p>

      <div className="section-eyebrow">Profile</div>
      <div className="settings-list">
        <div className="settings-row">
          <div className="avatar">R</div>
          <div className="body">
            <div className="lbl">Rishi Raj Sahu</div>
            <div className="sub">Preferred name · tap to edit</div>
          </div>
          <Icon name="chevronRight" size={16}/>
        </div>
      </div>

      <div className="section-eyebrow" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <span>Accounts</span>
        <button className="btn ghost sm" onClick={() => setEditing("new")}><Icon name="plus" size={14}/> Add Account</button>
      </div>
      <div className="settings-list">
        {accounts.map(a => (
          <div key={a.id} className="settings-row" onClick={() => setEditing(a.id)}>
            <div style={{width: 36, height: 36, borderRadius: "50%", background: "var(--emerald-50)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Icon name="wallet" size={16}/>
            </div>
            <div className="body">
              <div className="lbl">{a.name}</div>
              <div className="sub">{a.isDefault ? "Default · " : ""}{a.type}</div>
            </div>
            <div className="badge">{txCountByAccount(a.name)} txns</div>
            <Icon name="chevronRight" size={16}/>
          </div>
        ))}
      </div>

      <div className="section-eyebrow">Privacy</div>
      <div className="settings-list">
        <div className="settings-row">
          <div className="body">
            <div className="lbl">Crash reporting</div>
            <div className="sub">Anonymous crash traces · default on</div>
          </div>
          <div className={`toggle ${crash ? "on" : ""}`} onClick={() => setCrash(!crash)}/>
        </div>
        <div className="settings-row">
          <div className="body">
            <div className="lbl">Usage analytics</div>
            <div className="sub">No PII or transaction data · default on</div>
          </div>
          <div className={`toggle ${analytics ? "on" : ""}`} onClick={() => setAnalytics(!analytics)}/>
        </div>
      </div>

      <div className="section-eyebrow">Data</div>
      <div className="settings-list">
        <div className="settings-row">
          <div className="body">
            <div className="lbl destructive">Delete all data</div>
            <div className="sub">This cannot be undone</div>
          </div>
          <Icon name="chevronRight" size={16}/>
        </div>
      </div>

      <div className="section-eyebrow">Legal &amp; Help</div>
      <div className="settings-list">
        <div className="settings-row"><div className="body"><div className="lbl">Privacy Policy</div></div><Icon name="chevronRight" size={16}/></div>
        <div className="settings-row"><div className="body"><div className="lbl">Terms of Service</div></div><Icon name="chevronRight" size={16}/></div>
        <div className="settings-row"><div className="body"><div className="lbl">About WiseTransact</div><div className="sub">Version 1.0.0</div></div><Icon name="chevronRight" size={16}/></div>
        <div className="settings-row"><div className="body"><div className="lbl">Contact / Feedback</div></div><Icon name="chevronRight" size={16}/></div>
      </div>

      {editing !== null && (
        <AccountModal
          initial={editTarget}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          onDelete={editTarget && !editTarget.isDefault ? handleDelete : null}
        />
      )}
    </>
  );
};

// ---------- Add / Edit Transaction modal ----------
const parseDateStr = (s) => {
  if (!s) return new Date();
  // "5 May 2026" or "Today, 5 May 2026"
  const m = s.replace(/^.*?,\s*/, "").match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (!m) return new Date();
  const monthIdx = MONTH_NAMES.findIndex(n => n.toLowerCase().startsWith(m[2].toLowerCase()));
  return new Date(parseInt(m[3]), monthIdx >= 0 ? monthIdx : 0, parseInt(m[1]));
};

const AddTxModal = ({ onSave, onCancel, initial }) => {
  const accounts = loadAccounts();
  const isEdit = !!initial;
  const defaultAcct = initial
    ? accounts.find(a => a.name === initial.account) || accounts.find(a => a.isDefault) || accounts[0]
    : accounts.find(a => a.isDefault) || accounts[0];

  const [type, setType] = useS(initial ? (initial.type[0].toUpperCase() + initial.type.slice(1)) : "Expense");
  const [amt, setAmt] = useS(initial ? String(initial.amountNum ?? "") : "");
  const [purpose, setPurpose] = useS(initial?.purpose || "Personal");
  const [account, setAccount] = useS(defaultAcct);
  const [date, setDate] = useS(initial?.date ? parseDateStr(initial.date) : new Date());
  const [category, setCategory] = useS(initial?.category || "");
  const [mode, setMode] = useS(initial?.mode || "");
  const [notes, setNotes] = useS(initial?.notes || "");
  const [merchant, setMerchant] = useS(initial?.label || "");
  const [smsOpen, setSmsOpen] = useS(false);
  const [smsText, setSmsText] = useS("");
  const [calOpen, setCalOpen] = useS(false);
  const calRef = useR(null);

  useE(() => {
    const click = (e) => { if (calRef.current && !calRef.current.contains(e.target)) setCalOpen(false); };
    if (calOpen) document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [calOpen]);

  const valid = parseFloat(amt) > 0 && account && category && mode && merchant.trim();

  const tryClipboard = async () => {
    try { const t = await navigator.clipboard.readText(); if (t) setSmsText(t); } catch {}
  };
  const parseSms = () => {
    const text = smsText.trim();
    if (!text) return;
    const amtMatch = text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i) || text.match(/([\d,]+(?:\.\d+)?)\s*(?:rs|inr)/i);
    if (amtMatch) setAmt(amtMatch[1].replace(/,/g, ""));
    const lower = text.toLowerCase();
    if (/upi|gpay|phonepe|paytm/.test(lower)) setMode("UPI");
    else if (/credit card|debit card|card/.test(lower)) setMode("Card");
    else if (/imps|neft|rtgs|bank transfer/.test(lower)) setMode("Bank Transfer");
    if (/swiggy/.test(lower)) { setCategory("Food & Dining"); setMerchant("Swiggy"); }
    else if (/zomato/.test(lower)) { setCategory("Food & Dining"); setMerchant("Zomato"); }
    else if (/uber|ola/.test(lower)) { setCategory("Transport"); setMerchant(/uber/.test(lower) ? "Uber" : "Ola"); }
    else if (/amazon|flipkart|myntra/.test(lower)) { setCategory("Shopping"); setMerchant(/amazon/.test(lower) ? "Amazon" : /flipkart/.test(lower) ? "Flipkart" : "Myntra"); }
    if (/credited|received/.test(lower)) setType("Income");
    setSmsOpen(false);
    setSmsText("");
  };

  const submit = () => {
    const sign = type === "Expense" ? "-" : type === "Income" ? "+" : "";
    const tx = {
      id: initial?.id ?? Date.now(),
      label: merchant.trim(),
      sub: `${category} · ${mode}`,
      amount: `${sign}₹${parseFloat(amt).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
      amountNum: parseFloat(amt),
      type: type.toLowerCase(),
      category, account: account?.name, mode, purpose,
      date: fmtFullDate(date),
      notes: notes.trim(),
      source: initial?.source || "Manual",
    };
    onSave(tx, isEdit);
  };

  return (
    <Modal title={isEdit ? "Edit Transaction" : "Add Transaction"} onClose={onCancel} width={560}
      footer={<>
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
        <button className="btn primary" disabled={!valid} onClick={submit}>{isEdit ? "Save changes" : "Save Transaction"}</button>
      </>}
    >
      {/* Paste SMS */}
      {!smsOpen ? (
        <div onClick={() => { setSmsOpen(true); tryClipboard(); }}
          style={{background: "var(--emerald-50)", border: "1px solid var(--emerald-300)", borderRadius: 10, padding: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 20}}>
          <div style={{color: "var(--emerald-700)"}}><Icon name="clipboard" size={18}/></div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 13, fontWeight: 600, color: "var(--emerald-700)"}}>📋 Paste SMS to auto-fill</div>
            <div style={{fontSize: 11, color: "var(--emerald-500)", marginTop: 2}}>Tap to paste from clipboard or type</div>
          </div>
        </div>
      ) : (
        <div style={{background: "var(--emerald-50)", border: "1px solid var(--emerald-300)", borderRadius: 10, padding: 12, marginBottom: 20}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
            <div style={{fontSize: 13, fontWeight: 600, color: "var(--emerald-700)"}}>Paste SMS</div>
            <button onClick={() => { setSmsOpen(false); setSmsText(""); }} style={{border: 0, background: "transparent", color: "var(--emerald-700)", cursor: "pointer"}}>
              <Icon name="x" size={14}/>
            </button>
          </div>
          <textarea
            autoFocus value={smsText} onChange={e => setSmsText(e.target.value)}
            className="textarea"
            placeholder="e.g. Rs.340 spent on UPI at SWIGGY on 5-May-26. Avl bal Rs.42,310"
          />
          <div style={{display: "flex", gap: 8, marginTop: 8}}>
            <button className="btn ghost sm" onClick={tryClipboard}><Icon name="clipboard" size={14}/> Paste from clipboard</button>
            <button className="btn primary sm" disabled={!smsText.trim()} onClick={parseSms}>Auto-fill</button>
          </div>
        </div>
      )}

      <div className="field-group" style={{marginBottom: 16}}>
        <div className="lbl">Type</div>
        <div className="type-toggle">
          {["Expense","Income","Transfer"].map(t => (
            <button key={t} className={type===t?"active":""} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        <div className="field-group">
          <div className="lbl">Amount</div>
          <div style={{position: "relative"}}>
            <span style={{position: "absolute", left: 16, top: 14, fontSize: 22, color: "var(--gray-300)"}}>₹</span>
            <input className="input amount" type="number" inputMode="decimal" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} style={{paddingLeft: 36}}/>
          </div>
        </div>
        <div className="field-group">
          <div className="lbl">Merchant / Description</div>
          <input className="input" style={{marginTop: 8}} placeholder="e.g. Swiggy" value={merchant} onChange={e => setMerchant(e.target.value)}/>
        </div>

        <div className="field-group">
          <div className="lbl">Account</div>
          <select className="select" value={account?.id || ""} onChange={e => setAccount(accounts.find(a => String(a.id) === e.target.value))}>
            {accounts.length === 0 && <option value="">No accounts — add one in Settings</option>}
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} · {a.type}</option>)}
          </select>
        </div>

        <div className="field-group" style={{position: "relative"}} ref={calRef}>
          <div className="lbl">Date</div>
          <button className="select" onClick={() => setCalOpen(o => !o)} style={{textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"}}>
            <span style={{display: "flex", alignItems: "center", gap: 8}}><Icon name="calendar" size={14}/> {fmtFriendlyDate(date)}</span>
            <Icon name="chevronDown" size={14}/>
          </button>
          {calOpen && (
            <div className="picker-pop" style={{top: 70, left: 0, padding: 8}}>
              <Calendar value={date} onChange={(d) => { setDate(d); setCalOpen(false); }}/>
            </div>
          )}
        </div>

        <div className="field-group">
          <div className="lbl">Category</div>
          <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="field-group">
          <div className="lbl">Mode</div>
          <select className="select" value={mode} onChange={e => setMode(e.target.value)}>
            <option value="">Select payment mode</option>
            {MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {type === "Expense" && (
        <div className="field-group" style={{marginTop: 16}}>
          <div className="lbl">Purpose</div>
          <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
            {["Personal","Professional","Investment","Tax-saving"].map(p => (
              <span key={p} className={`chip ${purpose===p?"tag-on":""}`} onClick={() => setPurpose(p)}>{p}</span>
            ))}
          </div>
        </div>
      )}

      <div className="field-group" style={{marginTop: 16}}>
        <div className="lbl">Notes (optional)</div>
        <textarea className="textarea" placeholder="Add a note for this transaction…" value={notes} onChange={e => setNotes(e.target.value)}/>
      </div>
    </Modal>
  );
};

// ---------- Transaction Detail modal ----------
const DetailModal = ({ tx, onClose, onDelete, onEdit }) => {
  if (!tx) return null;
  const rows = [
    ["Merchant", tx.label],
    ["Type", tx.type[0].toUpperCase() + tx.type.slice(1)],
    ["Category", tx.category || "—"],
    ["Account", tx.account || "—"],
    ["Date", tx.date || "—"],
    ["Purpose", tx.purpose || (tx.type === "expense" ? "Personal" : "—")],
    ["Mode", tx.mode || "—"],
    ["Notes", tx.notes || "—"],
    ["Source", tx.source || "Manual"],
  ];
  const heroBg = tx.type === "expense" ? "var(--expense-bg)" : tx.type === "income" ? "var(--income-bg)" : "var(--transfer-bg)";
  const heroFg = tx.type === "expense" ? "var(--expense-fg)" : tx.type === "income" ? "var(--income-fg)" : "var(--transfer-fg)";
  return (
    <Modal title="Transaction Detail" onClose={onClose} width={460}
      footer={<>
        <button className="btn destructive" style={{marginRight: "auto"}} onClick={() => onDelete(tx)}><Icon name="trash" size={14}/> Delete</button>
        <button className="btn ghost" onClick={onClose}>Close</button>
        <button className="btn primary" onClick={() => onEdit(tx)}><Icon name="pencil" size={14}/> Edit</button>
      </>}
    >
      <div style={{background: heroBg, borderRadius: 10, padding: "20px", textAlign: "center", marginBottom: 16}}>
        <div className="ws-amount" style={{fontSize: 32, color: heroFg}}>{tx.amount}</div>
        <div style={{fontSize: 13, color: "var(--fg-secondary)", marginTop: 6}}><TypeTag type={tx.type}/> · {tx.date}</div>
      </div>
      <div style={{border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden"}}>
        {rows.map(([l, v], i) => (
          <div key={l} style={{display: "grid", gridTemplateColumns: "120px 1fr", padding: "10px 14px", background: i%2 ? "var(--gray-50)" : "#fff", borderBottom: i < rows.length-1 ? "1px solid var(--border-subtle)" : "0", fontSize: 13}}>
            <div style={{color: "var(--fg-muted)"}}>{l}</div>
            <div style={{color: "var(--fg-primary)", fontWeight: 500}}>{v}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

Object.assign(window, { Dashboard, TransactionsPage, ReportsPage, SettingsPage, AddTxModal, DetailModal });
