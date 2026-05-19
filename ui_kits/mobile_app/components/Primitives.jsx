// Shared primitives for the WiseTransact mobile UI kit
const { useState } = React;

const StatusBar = ({ variant = "light" }) => (
  <div className={`statusbar ${variant}`}>
    <div>9:41</div>
    <div className="ind"><span className="dot"/><span className="dot"/><span className="dot"/><span className="bars"/></div>
  </div>
);

const BackHeader = ({ title, onBack, right }) => (
  <div className="back-header">
    <button className="back" onClick={onBack}><Icon name="chevronLeft" size={18}/> Back</button>
    <div className="title">{title}</div>
    {right && <div className="right">{right}</div>}
  </div>
);

const TabBar = ({ active, onChange }) => {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "txns", label: "Transactions", icon: "list" },
    { id: "reports", label: "Reports", icon: "chart" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.id} className={`tab ${active === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>
          <span className="ic-wrap"><Icon name={t.icon} size={18}/></span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

const ProgressDots = ({ index, total = 5 }) => (
  <div className="progress-dots">
    {Array.from({length: total}).map((_, i) => (
      <span key={i} className={`dot ${i === index ? "active" : ""}`}/>
    ))}
  </div>
);

const Toggle = ({ on, onChange }) => (
  <div className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)}/>
);

const Field = ({ label, children }) => (
  <div className="field-group">
    {label && <div className="lbl">{label}</div>}
    {children}
  </div>
);

const ConfirmDialog = ({ title, body, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive, onConfirm, onCancel }) => (
  <>
    <div className="sheet-dim" onClick={onCancel}/>
    <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", zIndex: 22}}>
      <div style={{background: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 320, boxShadow: "0 20px 40px rgba(0,0,0,.25)", animation: "fade var(--dur-base) var(--ease-standard)"}}>
        <div style={{display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12}}>
          {destructive && (
            <div style={{width: 36, height: 36, borderRadius: "50%", background: "var(--expense-bg)", color: "var(--expense-fg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
              <Icon name="trash" size={18}/>
            </div>
          )}
          <div style={{flex: 1, minWidth: 0}}>
            <h4 style={{fontSize: 16, margin: 0, lineHeight: 1.3}}>{title}</h4>
            {body && <div style={{fontSize: 13, color: "var(--fg-secondary)", marginTop: 8, lineHeight: 1.5}}>{body}</div>}
          </div>
        </div>
        <div style={{display: "flex", gap: 10, marginTop: 16}}>
          <button className="btn ghost" style={{flex: 1, height: 44}} onClick={onCancel}>{cancelLabel}</button>
          <button className={destructive ? "btn destructive" : "btn primary"} style={{flex: 1, height: 44}} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  </>
);

const TxRow = ({ label, sub, amount, type, onClick }) => {
  const colors = {
    income: { bg: "var(--income-bg)", fg: "var(--income-fg)", icon: "arrDownLeft" },
    expense: { bg: "var(--expense-bg)", fg: "var(--expense-fg)", icon: "arrUpRight" },
    transfer: { bg: "var(--transfer-bg)", fg: "var(--transfer-fg)", icon: "arrLR" },
  };
  const c = colors[type];
  return (
    <div className="tx-row" onClick={onClick}>
      <div className="tx-dot" style={{background: c.bg, color: c.fg}}><Icon name={c.icon} size={18}/></div>
      <div className="tx-body">
        <div className="t">{label}</div>
        <div className="s">{sub}</div>
      </div>
      <div className="tx-amt" style={{color: c.fg}}>{amount}</div>
    </div>
  );
};

Object.assign(window, { StatusBar, BackHeader, TabBar, ProgressDots, Toggle, Field, TxRow, ConfirmDialog });
