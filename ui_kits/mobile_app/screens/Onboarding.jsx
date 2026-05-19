// All 13 screens, compact JSX
const { useState } = React;

// 01 Splash
const Splash = ({ go }) => (
  <div className="phone-screen" style={{background: "var(--emerald-900)", color: "#fff", alignItems: "center"}}>
    <StatusBar variant="dark"/>
    <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "0 32px"}}>
      <div style={{width: 88, height: 88, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32}}>
        <img src="../../assets/logo.svg" width="88" height="88" alt=""/>
      </div>
      <div className="ws-display" style={{color: "#fff", textAlign: "center"}}>WiseTransact</div>
      <div style={{color: "var(--emerald-300)", marginTop: 12, opacity: .85, textAlign: "center", fontSize: 14}}>Your year-end CA report, built daily.</div>
    </div>
    <button className="btn primary" style={{margin: "0 24px 40px", background: "var(--emerald-500)", width: "calc(100% - 48px)"}} onClick={go}>Get Started</button>
  </div>
);

// 02 Onboarding — Name
const OnbName = ({ go }) => {
  const [name, setName] = useState("");
  return (
    <div className="phone-screen surface">
      <StatusBar/>
      <ProgressDots index={0}/>
      <div style={{padding: "40px 24px 24px", flex: 1}}>
        <h1 style={{lineHeight: 1.15}}>What should we<br/>call you?</h1>
        <p style={{color: "var(--fg-secondary)", marginTop: 16, fontSize: 14, lineHeight: 1.5}}>We'll use this to personalise<br/>your experience.</p>
        <div className={`field ${name ? "filled focus" : "focus"}`} style={{marginTop: 32, height: 56}}>
          <input placeholder="Your preferred name" value={name} onChange={e => setName(e.target.value)} autoFocus/>
        </div>
      </div>
      <div style={{padding: "0 24px 32px"}}>
        <button className="btn primary" style={{width: "100%"}} disabled={!name} onClick={go}>Continue</button>
      </div>
    </div>
  );
};

// 03 Onboarding — Accounts (interactive: edit default, add new, delete)
const ACCOUNT_TYPES = ["Savings", "Credit Card", "Cash", "Wallet", "Other"];

const AccountSheet = ({ initial, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || "Savings");
  const isEdit = !!initial;
  return (
    <>
      <div className="sheet-dim" onClick={onCancel}/>
      <div className="sheet">
        <div className="grabber"/>
        <div style={{padding: "0 24px"}}>
          <h4 style={{fontSize: 17}}>{isEdit ? "Edit account" : "Add account"}</h4>
          <div style={{display: "flex", flexDirection: "column", gap: 14, marginTop: 20}}>
            <Field label="Account name">
              <div className={`field ${name ? "filled focus" : "focus"}`}>
                <input placeholder="e.g. HDFC Savings" value={name} onChange={e => setName(e.target.value)} autoFocus/>
              </div>
            </Field>
            <Field label="Type">
              <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
                {ACCOUNT_TYPES.map(t => (
                  <span key={t} className={`chip ${type === t ? "tag-on" : ""}`} onClick={() => setType(t)}>{t}</span>
                ))}
              </div>
            </Field>
          </div>
          <div style={{display: "flex", gap: 10, marginTop: 24}}>
            {isEdit && onDelete && (
              <button className="btn destructive" style={{flex: 1}} onClick={onDelete}><Icon name="trash" size={16}/> Remove</button>
            )}
            <button className="btn primary" style={{flex: 2, height: 48}} disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), type })}>
              {isEdit ? "Save" : "Add account"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const OnbAccounts = ({ go }) => {
  const [accounts, setAccounts] = useAccounts();
  const [editing, setEditing] = useState(null); // id | "new" | null

  const editTarget = editing === "new" ? null : accounts.find(a => a.id === editing);

  const handleSave = (data) => {
    if (editing === "new") {
      setAccounts(prev => [...prev, { id: Date.now(), ...data }]);
    } else {
      setAccounts(prev => prev.map(a => a.id === editing ? { ...a, ...data } : a));
    }
    setEditing(null);
  };
  const handleDelete = () => {
    setAccounts(prev => prev.filter(a => a.id !== editing));
    setEditing(null);
  };

  return (
    <div className="phone-screen surface" style={{position: "relative"}}>
      <StatusBar/>
      <ProgressDots index={1}/>
      <div style={{padding: "40px 24px 0", flexShrink: 0}}>
        <h1 style={{lineHeight: 1.15}}>Set up your<br/>accounts</h1>
        <p style={{color: "var(--fg-secondary)", marginTop: 16, fontSize: 14, lineHeight: 1.5}}>Add the accounts you want to track.<br/>You can change these in Settings later.</p>
      </div>
      <div className="scroll" style={{padding: "24px 24px 16px"}}>
        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
          {accounts.map(a => (
            <div key={a.id} onClick={() => setEditing(a.id)}
              style={{padding: "14px 16px", background: "var(--gray-50)", border: "1px solid var(--border-default)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer"}}>
              <div style={{width: 32, height: 32, borderRadius: "50%", background: "var(--emerald-50)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Icon name="wallet" size={16}/>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 15, fontWeight: 600}}>{a.name}</div>
                <div style={{fontSize: 12, color: "var(--fg-secondary)", marginTop: 2}}>
                  {a.isDefault ? "Default · " : ""}{a.type}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setEditing(a.id); }}
                style={{width: 28, height: 28, borderRadius: 6, background: "var(--gray-100)", border: 0, color: "var(--fg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
                <Icon name="pencil" size={14}/>
              </button>
            </div>
          ))}
        </div>
        <button className="btn ghost" style={{width: "100%", marginTop: 16}} onClick={() => setEditing("new")}>
          <Icon name="plus" size={16}/> Add Account
        </button>
      </div>
      <div style={{padding: "0 24px 32px"}}>
        <button className="btn primary" style={{width: "100%"}} disabled={accounts.length === 0} onClick={go}>Continue</button>
      </div>
      {editing !== null && (
        <AccountSheet
          initial={editTarget}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          onDelete={editTarget && !editTarget.isDefault ? handleDelete : null}
        />
      )}
    </div>
  );
};

// 04 Data warning
const OnbDataWarning = ({ go }) => (
  <div className="phone-screen surface">
    <StatusBar/>
    <ProgressDots index={2}/>
    <div style={{padding: "32px 24px", flex: 1}}>
      <div style={{width: 88, height: 88, borderRadius: "50%", background: "var(--warning-bg)", color: "var(--warning-fg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "16px auto 32px"}}>
        <Icon name="alert" size={40}/>
      </div>
      <h1 style={{lineHeight: 1.15}}>Your data stays<br/>on this device</h1>
      <p style={{color: "var(--fg-secondary)", marginTop: 16, fontSize: 14, lineHeight: 1.5}}>WiseTransact stores all data locally. Uninstalling the app or switching phones will permanently delete everything. There is no cloud backup.</p>
      <div style={{marginTop: 24, background: "var(--warning-bg)", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid var(--warning-fg)", fontSize: 12, fontWeight: 500, color: "var(--gray-700)", lineHeight: 1.5}}>
        Your data cannot be recovered if you uninstall the app or switch devices.
      </div>
    </div>
    <div style={{padding: "0 24px 32px"}}>
      <button className="btn primary" style={{width: "100%"}} onClick={go}>I understand, Continue</button>
    </div>
  </div>
);

// 05 Disclaimer
const OnbDisclaimer = ({ go }) => (
  <div className="phone-screen surface">
    <StatusBar/>
    <ProgressDots index={3}/>
    <div style={{padding: "32px 24px", flex: 1}}>
      <div style={{width: 88, height: 88, borderRadius: "50%", background: "var(--transfer-bg)", color: "var(--transfer-fg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "16px auto 32px"}}>
        <Icon name="scale" size={40}/>
      </div>
      <h1 style={{lineHeight: 1.15}}>Not financial<br/>advice</h1>
      <p style={{color: "var(--fg-secondary)", marginTop: 16, fontSize: 14, lineHeight: 1.5}}>WiseTransact helps you keep a record of your transactions. It does not file taxes, calculate tax liability, or provide financial advice.<br/><br/>Always consult a qualified Chartered Accountant for ITR filing.</p>
    </div>
    <div style={{padding: "0 24px 32px"}}>
      <button className="btn primary" style={{width: "100%"}} onClick={go}>Got it, Continue</button>
    </div>
  </div>
);

// 06 Privacy
const OnbPrivacy = ({ go }) => {
  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  const Card = ({ label, sub, on, set }) => (
    <div style={{background: "var(--gray-50)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12}}>
      <div style={{flex: 1}}>
        <div style={{fontSize: 14, fontWeight: 600}}>{label}</div>
        <div style={{fontSize: 12, color: "var(--fg-secondary)", marginTop: 4, lineHeight: 1.4}}>{sub}</div>
      </div>
      <Toggle on={on} onChange={set}/>
    </div>
  );
  return (
    <div className="phone-screen surface">
      <StatusBar/>
      <ProgressDots index={4}/>
      <div style={{padding: "40px 24px 24px", flex: 1}}>
        <h2 style={{fontSize: 24}}>A word on privacy</h2>
        <p style={{color: "var(--fg-secondary)", marginTop: 12, fontSize: 14, lineHeight: 1.5}}>WiseTransact sends two anonymous data streams to improve reliability. Your transactions, amounts, and names are never sent anywhere.</p>
        <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 24}}>
          <Card label="Crash reporting" sub="Anonymous crash traces · default on" on={a} set={setA}/>
          <Card label="Usage analytics" sub="Anonymous event counts · no PII · default on" on={b} set={setB}/>
        </div>
        <div style={{fontSize: 12, color: "var(--fg-muted)", marginTop: 16, lineHeight: 1.5}}>Both can be turned off anytime in Settings → Privacy.</div>
      </div>
      <div style={{padding: "0 24px 32px"}}>
        <button className="btn primary" style={{width: "100%"}} onClick={go}>Get Started</button>
      </div>
    </div>
  );
};

Object.assign(window, { Splash, OnbName, OnbAccounts, OnbDataWarning, OnbDisclaimer, OnbPrivacy });
