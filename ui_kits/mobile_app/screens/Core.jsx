// Home, Transactions, Add, Detail, Reports, Settings, Dedup
const { useState: useS } = React;

const SAMPLE_TX = [
  { id: 1, label: "Swiggy", sub: "Food & Dining · UPI", amount: "-₹340", type: "expense", category: "Food & Dining", account: "HDFC Savings", date: "5 May 2026", purpose: "Personal", mode: "UPI", source: "SMS Paste" },
  { id: 2, label: "Salary — Acme", sub: "Salary · HDFC Savings", amount: "+₹62,400", type: "income" },
  { id: 3, label: "Netflix", sub: "Entertainment · Card", amount: "-₹649", type: "expense" },
  { id: 4, label: "HDFC → ICICI", sub: "Transfer · Bank", amount: "₹5,000", type: "transfer" },
  { id: 5, label: "Uber", sub: "Transport · UPI", amount: "-₹180", type: "expense" },
];

const Home = ({ transactions, goTab, addTx, openDetail }) => {
  const totals = totalsFor(transactions);
  const recent = transactions.slice(0, 5);
  return (
  <div className="phone-screen">
    <div style={{background: "var(--emerald-900)", color: "#fff"}}>
      <StatusBar variant="dark"/>
      <div style={{padding: "12px 20px 0"}}>
        <div style={{color: "var(--emerald-300)", fontSize: 14}}>Good morning, Rishi</div>
        <h2 style={{color: "#fff", fontSize: 22, marginTop: 8}}>May 2026</h2>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "20px 0 24px", borderTop: "1px solid var(--emerald-700)", marginTop: 16}}>
        <div style={{textAlign: "center", borderRight: "1px solid var(--emerald-700)"}}>
          <div style={{fontSize: 11, color: "var(--emerald-300)", fontWeight: 500}}>Income</div>
          <div className="ws-amount" style={{fontSize: 18, color: "#fff", marginTop: 6}}>{fmtINR(totals.income)}</div>
        </div>
        <div style={{textAlign: "center", borderRight: "1px solid var(--emerald-700)"}}>
          <div style={{fontSize: 11, color: "var(--emerald-300)", fontWeight: 500}}>Expenses</div>
          <div className="ws-amount" style={{fontSize: 18, color: "var(--rose-100)", marginTop: 6}}>{fmtINR(totals.expense)}</div>
        </div>
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: 11, color: "var(--emerald-300)", fontWeight: 500}}>Net</div>
          <div className="ws-amount" style={{fontSize: 18, color: totals.net >= 0 ? "var(--emerald-300)" : "var(--rose-100)", marginTop: 6}}>{(totals.net < 0 ? "-" : "") + fmtINR(totals.net)}</div>
        </div>
      </div>
    </div>
    <div className="scroll surface-alt" style={{padding: "16px 0"}}>
      <div style={{padding: "0 16px"}}>
        <button className="btn primary" style={{width: "100%"}} onClick={addTx}><Icon name="plus" size={18}/> Add Transaction</button>
      </div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 16px 8px"}}>
        <div style={{fontSize: 16, fontWeight: 600}}>Recent Transactions</div>
        <button onClick={() => goTab("txns")} style={{background: "transparent", border: 0, color: "var(--fg-brand)", fontSize: 13, fontWeight: 500}}>See all →</button>
      </div>
      <div className="surface">
        {recent.length === 0
          ? <div style={{padding: 32, textAlign: "center", color: "var(--fg-secondary)", fontSize: 13}}>No transactions yet.</div>
          : recent.map(t => <TxRow key={t.id} {...t} onClick={() => openDetail(t)}/>)}
      </div>
    </div>
    <button className="fab" onClick={addTx}><Icon name="plus"/></button>
  </div>
  );
};

// Reusable bottom-sheet picker
const PickerSheet = ({ title, children, onCancel }) => (
  <>
    <div className="sheet-dim" onClick={onCancel}/>
    <div className="sheet" style={{maxHeight: "80%", display: "flex", flexDirection: "column"}}>
      <div className="grabber"/>
      <div style={{padding: "0 24px 8px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h4 style={{fontSize: 17, margin: 0}}>{title}</h4>
        <button onClick={onCancel} style={{width: 32, height: 32, border: 0, background: "var(--gray-100)", borderRadius: 8, color: "var(--fg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
          <Icon name="x" size={16}/>
        </button>
      </div>
      <div style={{padding: "8px 16px 16px", overflowY: "auto", flex: 1}}>{children}</div>
    </div>
  </>
);

const ListOption = ({ label, sub, icon, selected, onClick }) => (
  <button onClick={onClick}
    style={{width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 10, border: 0, background: selected ? "var(--emerald-50)" : "transparent", cursor: "pointer", textAlign: "left"}}>
    {icon && (
      <div style={{width: 36, height: 36, borderRadius: "50%", background: selected ? "var(--emerald-100)" : "var(--gray-100)", color: selected ? "var(--emerald-700)" : "var(--fg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
        <Icon name={icon} size={16}/>
      </div>
    )}
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontSize: 14, fontWeight: 500, color: "var(--fg-primary)"}}>{label}</div>
      {sub && <div style={{fontSize: 12, color: "var(--fg-secondary)", marginTop: 2}}>{sub}</div>}
    </div>
    {selected && <div style={{color: "var(--emerald-700)"}}><Icon name="check" size={18}/></div>}
  </button>
);

// Compact month-grid calendar
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const Calendar = ({ value, onChange }) => {
  const today = new Date();
  const sel = value || today;
  const [view, setView] = useS(new Date(sel.getFullYear(), sel.getMonth(), 1));
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1).getDay(); // 0 Sun
  const lead = (first + 6) % 7; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const same = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const shiftMonth = (delta) => setView(new Date(year, month + delta, 1));

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 12px"}}>
        <button onClick={() => shiftMonth(-1)} style={{width: 32, height: 32, borderRadius: 8, background: "var(--gray-100)", border: 0, color: "var(--fg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
          <Icon name="chevronLeft" size={16}/>
        </button>
        <div style={{fontSize: 15, fontWeight: 600}}>{MONTH_NAMES[month]} {year}</div>
        <button onClick={() => shiftMonth(1)} style={{width: 32, height: 32, borderRadius: 8, background: "var(--gray-100)", border: 0, color: "var(--fg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
          <Icon name="chevronRight" size={16}/>
        </button>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: "0 4px 8px"}}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{textAlign: "center", fontSize: 11, color: "var(--fg-secondary)", fontWeight: 500, padding: "4px 0"}}>{d}</div>
        ))}
      </div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: "0 4px"}}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i}/>;
          const date = new Date(year, month, d);
          const isSel = same(date, sel);
          const isToday = same(date, today);
          const isFuture = date > today;
          return (
            <button key={i} disabled={isFuture} onClick={() => onChange(date)}
              style={{
                height: 40, border: 0, borderRadius: 8, cursor: isFuture ? "not-allowed" : "pointer",
                background: isSel ? "var(--emerald-700)" : "transparent",
                color: isSel ? "#fff" : isFuture ? "var(--gray-300)" : isToday ? "var(--emerald-700)" : "var(--fg-primary)",
                fontWeight: isSel || isToday ? 600 : 400, fontSize: 13,
                outline: isToday && !isSel ? "1px solid var(--emerald-300)" : "none",
              }}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const fmtDate = (d) => {
  const today = new Date();
  const yest = new Date(); yest.setDate(today.getDate() - 1);
  const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const stem = `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
  if (same(d, today)) return `Today, ${stem}`;
  if (same(d, yest)) return `Yesterday, ${stem}`;
  return stem;
};

const AddTx = ({ back, onSubmit }) => {
  const accounts = loadAccounts();
  const defaultAcct = accounts.find(a => a.isDefault) || accounts[0];

  const [type, setType] = useS("Expense");
  const [amt, setAmt] = useS("");
  const [purpose, setPurpose] = useS("Personal");
  const [account, setAccount] = useS(defaultAcct);
  const [date, setDate] = useS(new Date());
  const [category, setCategory] = useS(null);
  const [mode, setMode] = useS(null);
  const [notes, setNotes] = useS("");

  const [smsOpen, setSmsOpen] = useS(false);
  const [smsText, setSmsText] = useS("");
  const [picker, setPicker] = useS(null); // 'account' | 'date' | 'category' | 'mode'

  const valid = parseFloat(amt) > 0 && account && category && mode;

  // Naive SMS parser: pulls amount, finds category keyword, infers mode
  const parseSms = () => {
    const text = smsText.trim();
    if (!text) return;
    const amtMatch = text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i) || text.match(/([\d,]+(?:\.\d+)?)\s*(?:rs|inr)/i);
    if (amtMatch) setAmt(amtMatch[1].replace(/,/g, ""));
    const lower = text.toLowerCase();
    if (/upi|gpay|phonepe|paytm/.test(lower)) setMode("UPI");
    else if (/credit card|debit card|card/.test(lower)) setMode("Card");
    else if (/imps|neft|rtgs|bank transfer/.test(lower)) setMode("Bank Transfer");
    const catHit = CATEGORIES.find(c => lower.includes(c.name.toLowerCase().split(" ")[0]));
    if (catHit) setCategory(catHit.name);
    else if (/swiggy|zomato|restaurant/.test(lower)) setCategory("Food & Dining");
    else if (/uber|ola|rapido|metro/.test(lower)) setCategory("Transport");
    else if (/amazon|flipkart|myntra/.test(lower)) setCategory("Shopping");
    if (/credited/.test(lower)) setType("Income");
    setSmsOpen(false);
    setSmsText("");
  };

  const tryClipboard = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setSmsText(t);
    } catch { /* permission denied — user types manually */ }
  };

  return (
    <div className="phone-screen surface-alt" style={{position: "relative"}}>
      <StatusBar/>
      <BackHeader title="Add Transaction" onBack={back}/>
      <div className="scroll" style={{padding: "16px"}}>
        {/* Paste SMS */}
        {!smsOpen ? (
          <div onClick={() => { setSmsOpen(true); tryClipboard(); }}
            style={{background: "var(--emerald-50)", border: "1px solid var(--emerald-300)", borderRadius: 10, padding: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer"}}>
            <div style={{color: "var(--emerald-700)"}}><Icon name="clipboard" size={20}/></div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 13, fontWeight: 600, color: "var(--emerald-700)"}}>📋 Paste SMS to auto-fill</div>
              <div style={{fontSize: 11, color: "var(--emerald-500)", marginTop: 2}}>Tap to paste from clipboard or type</div>
            </div>
          </div>
        ) : (
          <div style={{background: "var(--emerald-50)", border: "1px solid var(--emerald-300)", borderRadius: 10, padding: 12}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
              <div style={{fontSize: 13, fontWeight: 600, color: "var(--emerald-700)"}}>Paste SMS</div>
              <button onClick={() => { setSmsOpen(false); setSmsText(""); }} style={{border: 0, background: "transparent", color: "var(--emerald-700)", cursor: "pointer", display: "flex"}}>
                <Icon name="x" size={16}/>
              </button>
            </div>
            <textarea
              autoFocus
              value={smsText}
              onChange={e => setSmsText(e.target.value)}
              placeholder="e.g. Rs.340 spent on UPI at SWIGGY on 5-May-26. Avl bal Rs.42,310"
              style={{width: "100%", minHeight: 84, padding: 10, fontSize: 13, lineHeight: 1.4, fontFamily: "inherit", border: "1px solid var(--emerald-300)", borderRadius: 8, resize: "vertical", outline: "none", background: "#fff", color: "var(--fg-primary)", boxSizing: "border-box"}}
            />
            <div style={{display: "flex", gap: 8, marginTop: 8}}>
              <button className="btn ghost" style={{flex: 1, height: 40, fontSize: 13}} onClick={tryClipboard}>
                <Icon name="clipboard" size={14}/> Paste
              </button>
              <button className="btn primary" style={{flex: 1, height: 40, fontSize: 13}} disabled={!smsText.trim()} onClick={parseSms}>
                Auto-fill
              </button>
            </div>
          </div>
        )}

        <div className="type-toggle" style={{marginTop: 16}}>
          {["Expense","Income","Transfer"].map(t => (
            <button key={t} className={type===t?"active":""} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 14, marginTop: 20}}>
          <Field label="Amount">
            <div className="field amount">
              <span className="rupee">₹</span>
              <input placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} type="number" inputMode="decimal"/>
            </div>
          </Field>

          <Field label="Account">
            <div className={`field ${account ? "filled" : ""}`} onClick={() => setPicker("account")} style={{cursor: "pointer"}}>
              {account ? `${account.name} · ${account.type}` : "Select account"} <Icon name="chevronDown" size={16}/>
            </div>
          </Field>

          <Field label="Date">
            <div className="field filled" onClick={() => setPicker("date")} style={{cursor: "pointer"}}>
              <span style={{display: "flex", alignItems: "center", gap: 8}}><Icon name="calendar" size={14}/> {fmtDate(date)}</span>
              <Icon name="chevronDown" size={16}/>
            </div>
          </Field>

          <Field label="Category">
            <div className={`field ${category ? "filled" : ""}`} onClick={() => setPicker("category")} style={{cursor: "pointer"}}>
              {category || "Select category"} <Icon name="chevronDown" size={16}/>
            </div>
          </Field>

          {type === "Expense" && (
            <Field label="Purpose">
              <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
                {["Personal","Professional","Investment","Tax-saving"].map(p => (
                  <span key={p} className={`chip ${purpose===p?"tag-on":""}`} onClick={() => setPurpose(p)}>{p}</span>
                ))}
              </div>
            </Field>
          )}

          <Field label="Mode">
            <div className={`field ${mode ? "filled" : ""}`} onClick={() => setPicker("mode")} style={{cursor: "pointer"}}>
              {mode || "Select mode"} <Icon name="chevronDown" size={16}/>
            </div>
          </Field>

          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add a note for this transaction…"
              style={{width: "100%", minHeight: 72, padding: "12px 14px", fontSize: 14, lineHeight: 1.4, fontFamily: "inherit", border: "1px solid var(--border-default)", borderRadius: 10, resize: "vertical", outline: "none", background: "#fff", color: "var(--fg-primary)", boxSizing: "border-box"}}
            />
          </Field>
        </div>
      </div>
      <div style={{padding: "12px 16px", background: "#fff", borderTop: "1px solid var(--border-subtle)"}}>
        <button className="btn primary" style={{width: "100%"}} disabled={!valid} onClick={onSubmit}>Submit</button>
      </div>

      {picker === "account" && (
        <PickerSheet title="Select account" onCancel={() => setPicker(null)}>
          {accounts.length === 0 ? (
            <div style={{padding: 24, textAlign: "center", color: "var(--fg-secondary)", fontSize: 13}}>No accounts yet. Add one from Settings.</div>
          ) : accounts.map(a => (
            <ListOption key={a.id} label={a.name} sub={a.isDefault ? `Default · ${a.type}` : a.type} icon="wallet"
              selected={account?.id === a.id}
              onClick={() => { setAccount(a); setPicker(null); }}/>
          ))}
        </PickerSheet>
      )}
      {picker === "date" && (
        <PickerSheet title="Select date" onCancel={() => setPicker(null)}>
          <Calendar value={date} onChange={(d) => { setDate(d); setPicker(null); }}/>
          <div style={{display: "flex", gap: 8, marginTop: 12}}>
            <button className="btn ghost" style={{flex: 1, height: 40, fontSize: 13}} onClick={() => { setDate(new Date()); setPicker(null); }}>Today</button>
            <button className="btn ghost" style={{flex: 1, height: 40, fontSize: 13}} onClick={() => { const y = new Date(); y.setDate(y.getDate()-1); setDate(y); setPicker(null); }}>Yesterday</button>
          </div>
        </PickerSheet>
      )}
      {picker === "category" && (
        <PickerSheet title="Select category" onCancel={() => setPicker(null)}>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6}}>
            {CATEGORIES.map(c => (
              <ListOption key={c.name} label={c.name} icon={c.icon}
                selected={category === c.name}
                onClick={() => { setCategory(c.name); setPicker(null); }}/>
            ))}
          </div>
        </PickerSheet>
      )}
      {picker === "mode" && (
        <PickerSheet title="Payment mode" onCancel={() => setPicker(null)}>
          {MODES.map(m => (
            <ListOption key={m} label={m}
              selected={mode === m}
              onClick={() => { setMode(m); setPicker(null); }}/>
          ))}
        </PickerSheet>
      )}
    </div>
  );
};

const TxList = ({ transactions, openDetail }) => {
  const [filter, setFilter] = useS("All");
  const totals = totalsFor(transactions);

  const filtered = transactions.filter(t => filter === "All" ? true : t.type === filter.toLowerCase());
  // Group by date string
  const groupMap = new Map();
  for (const t of filtered) {
    const key = t.date || "Undated";
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key).push(t);
  }
  const groups = [...groupMap.entries()].map(([label, items]) => ({ label, items }));

  return (
    <div className="phone-screen surface-alt">
      <StatusBar/>
      <div className="back-header" style={{justifyContent: "space-between"}}>
        <h3 style={{fontSize: 20}}>Transactions</h3>
        <div style={{display: "flex", gap: 8}}>
          <button style={{width: 40, height: 40, borderRadius: 10, background: "var(--gray-100)", border: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-secondary)"}}><Icon name="filter" size={18}/></button>
          <button style={{width: 40, height: 40, borderRadius: 10, background: "var(--gray-100)", border: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-secondary)"}}><Icon name="search" size={18}/></button>
        </div>
      </div>
      <div style={{padding: "8px 16px", background: "var(--gray-50)"}}>
        <div className="field filled" style={{height: 36, justifyContent: "flex-start", gap: 6}}>May 2026 <Icon name="chevronDown" size={14}/></div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "12px 0", background: "var(--emerald-50)"}}>
        {[["Income", fmtINR(totals.income), "var(--income-fg)"], ["Expenses", fmtINR(totals.expense), "var(--expense-fg)"], ["Net", (totals.net < 0 ? "-" : "") + fmtINR(totals.net), totals.net >= 0 ? "var(--income-fg)" : "var(--expense-fg)"]].map(([l,a,c]) => (
          <div key={l} style={{textAlign: "center"}}>
            <div style={{fontSize: 11, color: "var(--fg-secondary)"}}>{l}</div>
            <div className="ws-amount" style={{fontSize: 14, color: c, marginTop: 4}}>{a}</div>
          </div>
        ))}
      </div>
      <div style={{display: "flex", gap: 8, padding: "12px 16px", background: "var(--gray-50)", overflow: "auto"}}>
        {["All","Income","Expense","Transfer"].map(c => (
          <span key={c} className={`chip ${filter===c?"active":""}`} onClick={() => setFilter(c)}>{c}</span>
        ))}
      </div>
      <div className="scroll">
        {groups.map(g => (
          <div key={g.label}>
            <div className="section-head">{g.label}</div>
            <div className="surface">
              {g.items.map(t => <TxRow key={t.id} {...t} onClick={() => openDetail(t)}/>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TxDetail = ({ tx, back, onDelete }) => {
  const t = tx;
  if (!t) return null;
  const rows = [
    ["Merchant", t.label],
    ["Category", t.category || "—"],
    ["Account", t.account || "—"],
    ["Date", t.date || "—"],
    ["Purpose", t.purpose || (t.type === "expense" ? "Personal" : "—")],
    ["Mode", t.mode || "—"],
    ["Notes", t.notes || "—"],
    ["Source", t.source || "Manual"],
  ];
  const isExpense = t.type === "expense";
  const isIncome = t.type === "income";
  const heroBg = isExpense ? "var(--expense-bg)" : isIncome ? "var(--income-bg)" : "var(--transfer-bg)";
  const heroFg = isExpense ? "var(--expense-fg)" : isIncome ? "var(--income-fg)" : "var(--transfer-fg)";
  const typeLabel = isExpense ? "Expense" : isIncome ? "Income" : "Transfer";
  return (
    <div className="phone-screen surface">
      <StatusBar/>
      <BackHeader title="Transaction Detail" onBack={back}/>
      <div style={{background: heroBg, padding: "24px 16px", textAlign: "center"}}>
        <div className="ws-amount" style={{fontSize: 38, color: heroFg}}>{t.amount}</div>
        <div style={{fontSize: 13, color: "var(--fg-secondary)", marginTop: 8}}>{typeLabel} · {t.date || "—"}</div>
      </div>
      <div className="scroll">
        {rows.map(([l, v], i) => (
          <div key={l} className="detail-row" style={{background: i%2 ? "var(--gray-50)" : "#fff"}}>
            <div className="lbl">{l}</div>
            <div className="val">{v}</div>
          </div>
        ))}
      </div>
      <div style={{display: "flex", gap: 16, padding: "12px 16px", background: "#fff", borderTop: "1px solid var(--border-subtle)"}}>
        <button className="btn destructive" style={{flex: 1}} onClick={() => onDelete && onDelete(t)}><Icon name="trash" size={16}/> Delete</button>
        <button className="btn primary" style={{flex: 1, height: 48}}><Icon name="pencil" size={16}/> Edit</button>
      </div>
    </div>
  );
};

const Reports = () => (
  <div className="phone-screen surface-alt">
    <StatusBar/>
    <div className="back-header"><h3 style={{fontSize: 20}}>Reports</h3></div>
    <div className="scroll" style={{padding: "16px"}}>
      <div className="field filled" style={{height: 40, justifyContent: "space-between"}}>This Month <Icon name="chevronDown" size={14}/></div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16}}>
        {[["Income","₹62,400","var(--income-fg)","var(--income-bg)"],["Expenses","₹18,320","var(--expense-fg)","var(--expense-bg)"],["Net","₹44,080","var(--income-fg)","var(--income-bg)"]].map(([l,a,c,b]) => (
          <div key={l} style={{background: b, borderRadius: 12, padding: "12px 8px", textAlign: "center"}}>
            <div style={{fontSize: 11, color: "var(--fg-secondary)"}}>{l}</div>
            <div className="ws-amount" style={{fontSize: 15, color: c, marginTop: 6}}>{a}</div>
          </div>
        ))}
      </div>
      <div style={{background: "#fff", border: "1px solid var(--border-default)", borderRadius: 12, padding: 16, marginTop: 16}}>
        <div style={{fontSize: 13, fontWeight: 600}}>Monthly Trend</div>
        <div style={{display: "flex", alignItems: "flex-end", gap: 18, height: 130, marginTop: 16, padding: "0 8px"}}>
          {[["Jan",.35,.25],["Feb",.6,.4],["Mar",.45,.3],["Apr",.8,.55],["May",.55,.38]].map(([m,i,e]) => (
            <div key={m} style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
              <div style={{display: "flex", alignItems: "flex-end", gap: 3, height: 110}}>
                <div style={{width: 14, height: `${i*100}%`, background: "var(--emerald-500)", borderRadius: 3}}/>
                <div style={{width: 14, height: `${e*100}%`, background: "var(--expense-fg)", borderRadius: 3}}/>
              </div>
              <div style={{fontSize: 10, color: "var(--fg-muted)"}}>{m}</div>
            </div>
          ))}
        </div>
        <div style={{display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "var(--fg-secondary)"}}>
          <span><span style={{display:"inline-block",width:10,height:10,background:"var(--emerald-500)",borderRadius:2,marginRight:6,verticalAlign:"middle"}}/>Income</span>
          <span><span style={{display:"inline-block",width:10,height:10,background:"var(--expense-fg)",borderRadius:2,marginRight:6,verticalAlign:"middle"}}/>Expenses</span>
        </div>
      </div>
      <div style={{marginTop: 20, fontSize: 14, fontWeight: 600}}>Expenses by Category</div>
      <div style={{display: "flex", marginTop: 12, height: 12, gap: 2}}>
        <div style={{flex: 42, background: "var(--amber-500)", borderRadius: 6}}/>
        <div style={{flex: 18, background: "var(--sky-500)", borderRadius: 6}}/>
        <div style={{flex: 22, background: "var(--violet-500)", borderRadius: 6}}/>
        <div style={{flex: 18, background: "var(--gray-300)", borderRadius: 6}}/>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, fontSize: 11, color: "var(--fg-secondary)"}}>
        {[["Food & Dining","42%","var(--amber-500)"],["Transport","18%","var(--sky-500)"],["Entertainment","22%","var(--violet-500)"],["Other","18%","var(--gray-300)"]].map(([l,p,c]) => (
          <div key={l}><span style={{display:"inline-block",width:10,height:10,background:c,borderRadius:"50%",marginRight:8,verticalAlign:"middle"}}/>{l} {p}</div>
        ))}
      </div>
      <button className="btn" style={{width: "100%", marginTop: 24, background: "var(--gray-100)", color: "var(--fg-muted)", border: "1px solid var(--border-default)", fontSize: 12, fontWeight: 500}} disabled>
        <Icon name="download" size={16}/> Download PDF — available for Financial Year only
      </button>
    </div>
  </div>
);

const Settings = () => {
  const [crash, setCrash] = useS(true);
  const [analytics, setAnalytics] = useS(true);
  const Row = ({ label, sub, badge, destructive, children }) => (
    <div className="settings-row">
      <div className="lbl-wrap">
        <div className={`lbl ${destructive?"destructive":""}`}>{label}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {badge && <div className="badge">{badge}</div>}
      {children || <span className="chev"><Icon name="chevronRight" size={16}/></span>}
    </div>
  );
  return (
    <div className="phone-screen surface-alt">
      <StatusBar/>
      <div className="back-header"><h3 style={{fontSize: 20}}>Settings</h3></div>
      <div className="scroll">
        <div className="section-head">PROFILE</div>
        <Row label="Rishi Raj Sahu" sub="Tap to edit name"/>
        <div className="section-head">ACCOUNTS</div>
        <Row label="HDFC Savings" sub="Savings account" badge="24 txns"/>
        <Row label="ICICI Credit Card" sub="Credit card" badge="8 txns"/>
        <Row label="+ Add Account"/>
        <div className="section-head">DATA</div>
        <Row label="Delete all data" sub="This cannot be undone" destructive/>
        <div className="section-head">PRIVACY</div>
        <Row label="Crash reporting" sub="Anonymous · default on"><Toggle on={crash} onChange={setCrash}/></Row>
        <Row label="Usage analytics" sub="No PII or transaction data · default on"><Toggle on={analytics} onChange={setAnalytics}/></Row>
        <div className="section-head">LEGAL & HELP</div>
        <Row label="Privacy Policy"/>
        <Row label="Terms of Service"/>
        <Row label="About WiseTransact" sub="Version 1.0.0"/>
        <Row label="Contact / Feedback"/>
      </div>
    </div>
  );
};

const DedupSheet = ({ onAction }) => (
  <>
    <div className="sheet-dim" onClick={() => onAction("cancel")}/>
    <div className="sheet">
      <div className="grabber"/>
      <div style={{padding: "0 24px"}}>
        <h4 style={{fontSize: 17}}>Possible Duplicate Found</h4>
        <p style={{fontSize: 13, color: "var(--fg-secondary)", marginTop: 8, lineHeight: 1.5}}>A similar transaction already exists.<br/>What would you like to do?</p>
        <div style={{background: "var(--gray-50)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 14, marginTop: 16, display: "flex", alignItems: "center"}}>
          <div style={{flex: 1}}>
            <div style={{fontSize: 9, fontWeight: 600, color: "var(--fg-muted)", letterSpacing: .5}}>EXISTING</div>
            <div style={{fontSize: 13, fontWeight: 500, marginTop: 4}}>Swiggy · Food &amp; Dining</div>
            <div style={{fontSize: 11, color: "var(--fg-secondary)", marginTop: 4}}>HDFC Savings · 5 May 2026 · UPI</div>
          </div>
          <div className="ws-amount" style={{fontSize: 15, color: "var(--expense-fg)"}}>-₹340</div>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 10, marginTop: 20}}>
          <button onClick={() => onAction("discard")} className="btn" style={{background: "var(--gray-100)", color: "var(--gray-900)", height: 48, fontWeight: 500}}>Discard new entry</button>
          <button onClick={() => onAction("merge")} className="btn" style={{background: "var(--emerald-50)", color: "var(--emerald-700)", height: 48, fontWeight: 500}}>Merge into existing</button>
          <button onClick={() => onAction("keep")} className="btn" style={{background: "var(--expense-bg)", color: "var(--expense-fg)", height: 48, fontWeight: 500}}>Add anyway (keep both)</button>
        </div>
      </div>
    </div>
  </>
);

Object.assign(window, { Home, AddTx, TxList, TxDetail, Reports, Settings, DedupSheet });
