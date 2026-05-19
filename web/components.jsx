// WiseTransact — Web App components
const { useState, useEffect, useRef } = React;

// ---------- Sidebar ----------
const Sidebar = ({ active, onNav, userName }) => {
  const items = [
    { id: "dashboard",    label: "Dashboard",    icon: "home" },
    { id: "transactions", label: "Transactions", icon: "list" },
    { id: "reports",      label: "Reports",      icon: "chart" },
    { id: "settings",     label: "Settings",     icon: "settings" },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="../assets/logo.svg" alt=""/>
        <div className="name">Wise<span className="em">Transact</span></div>
      </div>
      <nav className="nav">
        <div className="group-label">Workspace</div>
        {items.map(it => (
          <button key={it.id} className={`nav-item ${active === it.id ? "active" : ""}`} onClick={() => onNav(it.id)}>
            <Icon name={it.icon} size={18}/>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="avatar">{(userName || "?")[0].toUpperCase()}</div>
        <div className="body">
          <div className="name">{userName || "—"}</div>
          <div className="meta">FY 2025–26</div>
        </div>
      </div>
    </aside>
  );
};

// ---------- Topbar ----------
const Topbar = ({ crumb, period, onPeriod, onAdd }) => (
  <header className="topbar">
    <div className="crumb">{crumb}</div>
    <div className="spacer"/>
    <button className="period" onClick={onPeriod}>
      <Icon name="calendar" size={14}/> {period} <Icon name="chevronDown" size={14}/>
    </button>
    <button className="btn primary" onClick={onAdd}>
      <Icon name="plus" size={16}/> Add Transaction
    </button>
  </header>
);

// ---------- KPI cards ----------
const KPI = ({ label, amount, kind, delta }) => (
  <div className={`kpi ${kind}`}>
    <div className="lbl">{label}</div>
    <div className="amt">{amount}</div>
    {delta && <div className="delta">{delta}</div>}
  </div>
);

// ---------- Type tag ----------
const TypeTag = ({ type }) => {
  const map = { income: "Income", expense: "Expense", transfer: "Transfer" };
  return <span className={`tag ${type}`}>{map[type]}</span>;
};

// ---------- Transactions table ----------
const TxTable = ({ rows, compact, onRowClick, emptyText = "No transactions yet." }) => {
  const dots = {
    income: { bg: "var(--income-bg)", fg: "var(--income-fg)", icon: "arrDownLeft" },
    expense: { bg: "var(--expense-bg)", fg: "var(--expense-fg)", icon: "arrUpRight" },
    transfer: { bg: "var(--transfer-bg)", fg: "var(--transfer-fg)", icon: "arrLR" },
  };
  if (!rows.length) {
    return <div style={{padding: 40, textAlign: "center", color: "var(--fg-secondary)", fontSize: 13}}>{emptyText}</div>;
  }
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Merchant</th>
          {!compact && <th>Category</th>}
          {!compact && <th>Account</th>}
          <th>Date</th>
          {!compact && <th>Mode</th>}
          <th className="right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(t => {
          const d = dots[t.type];
          return (
            <tr key={t.id} onClick={() => onRowClick && onRowClick(t)}>
              <td>
                <div className="merchant">
                  <div className="dot" style={{background: d.bg, color: d.fg}}><Icon name={d.icon} size={16}/></div>
                  <span>{t.label}</span>
                </div>
              </td>
              {!compact && <td style={{color: "var(--fg-secondary)"}}>{t.category || "—"}</td>}
              {!compact && <td style={{color: "var(--fg-secondary)"}}>{t.account || "—"}</td>}
              <td style={{color: "var(--fg-secondary)"}}>{t.date || "—"}</td>
              {!compact && <td><TypeTag type={t.type}/> <span style={{marginLeft: 4, color: "var(--fg-secondary)", fontSize: 12}}>{t.mode || ""}</span></td>}
              <td className="amt" style={{color: d.fg}}>{t.amount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// ---------- Modal wrapper ----------
const Modal = ({ title, children, onClose, footer, width = 520 }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose && onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className="modal" style={{maxWidth: width}}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="close" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

// ---------- Confirm dialog ----------
const ConfirmDialog = ({ title, body, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive, onConfirm, onCancel }) => (
  <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="confirm">
      <div style={{display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 4}}>
        {destructive && (
          <div style={{width: 40, height: 40, borderRadius: "50%", background: "var(--expense-bg)", color: "var(--expense-fg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
            <Icon name="trash" size={18}/>
          </div>
        )}
        <div style={{flex: 1}}>
          <h3 style={{fontSize: 16, margin: 0, fontWeight: 600}}>{title}</h3>
          {body && <div style={{fontSize: 13, color: "var(--fg-secondary)", marginTop: 8, lineHeight: 1.5}}>{body}</div>}
        </div>
      </div>
      <div style={{display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end"}}>
        <button className="btn ghost" onClick={onCancel}>{cancelLabel}</button>
        <button className={destructive ? "btn destructive" : "btn primary"} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ---------- Compact calendar ----------
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const Calendar = ({ value, onChange }) => {
  const today = new Date();
  const sel = value || today;
  const [view, setView] = useState(new Date(sel.getFullYear(), sel.getMonth(), 1));
  const y = view.getFullYear(), m = view.getMonth();
  const first = new Date(y, m, 1).getDay();
  const lead = (first + 6) % 7;
  const total = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  const same = (a,b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  return (
    <div className="cal">
      <div className="cal-head">
        <button onClick={() => setView(new Date(y, m-1, 1))}><Icon name="chevronLeft" size={14}/></button>
        <div className="ym">{MONTH_NAMES[m]} {y}</div>
        <button onClick={() => setView(new Date(y, m+1, 1))}><Icon name="chevronRight" size={14}/></button>
      </div>
      <div className="cal-grid">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d,i) => <div key={i} className="dow">{d}</div>)}
        {cells.map((d,i) => {
          if (d === null) return <div key={i}/>;
          const dt = new Date(y, m, d);
          const isFuture = dt > today;
          const isToday = same(dt, today);
          const isSel = same(dt, sel);
          return (
            <button key={i} className={`day ${isToday ? "today" : ""} ${isSel ? "selected" : ""}`}
              disabled={isFuture} onClick={() => onChange(dt)}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const fmtFullDate = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
const fmtFriendlyDate = (d) => {
  const today = new Date();
  const yest = new Date(); yest.setDate(today.getDate() - 1);
  const same = (a,b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (same(d, today)) return `Today, ${fmtFullDate(d)}`;
  if (same(d, yest)) return `Yesterday, ${fmtFullDate(d)}`;
  return fmtFullDate(d);
};

// ---------- Account editor modal ----------
const ACCOUNT_TYPES = ["Savings", "Credit Card", "Cash", "Wallet", "Other"];
const AccountModal = ({ initial, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || "Savings");
  const isEdit = !!initial;
  return (
    <Modal title={isEdit ? "Edit account" : "Add account"} onClose={onCancel}
      footer={
        <>
          {isEdit && onDelete && <button className="btn destructive" style={{marginRight: "auto"}} onClick={onDelete}><Icon name="trash" size={14}/> Remove</button>}
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn primary" disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), type })}>{isEdit ? "Save changes" : "Add account"}</button>
        </>
      }>
      <div className="field-group" style={{marginBottom: 16}}>
        <div className="lbl">Account name</div>
        <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HDFC Savings"/>
      </div>
      <div className="field-group">
        <div className="lbl">Type</div>
        <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
          {ACCOUNT_TYPES.map(t => (
            <span key={t} className={`chip ${type === t ? "tag-on" : ""}`} onClick={() => setType(t)}>{t}</span>
          ))}
        </div>
      </div>
    </Modal>
  );
};

Object.assign(window, { Sidebar, Topbar, KPI, TypeTag, TxTable, Modal, ConfirmDialog, Calendar, AccountModal, fmtFullDate, fmtFriendlyDate, MONTH_NAMES, ACCOUNT_TYPES });
