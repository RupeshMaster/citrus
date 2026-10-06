import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { screenById, screens, sections } from "./data";
import { addAuditEvent, loadState, persistState, resetState } from "./store";
import "./styles.css";

const NAV_ITEMS = [
  { label: "Vault", icon: "⌂", target: "p06" },
  { label: "Timeline", icon: "⌁", target: "p07" },
  { label: "Consult", icon: "✦", target: "p33" },
  { label: "Meds", icon: "✚", target: "p20" },
];

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.1 8.3-8 10-4.9-1.7-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.8-5" /></>,
    lock: <><rect x="5" y="9" width="14" height="11" rx="2" /><path d="M8 9V7a4 4 0 0 1 8 0v2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}

function Logo({ compact = false }) {
  return <div className={`brand ${compact ? "brand-compact" : ""}`}>
    <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
    {!compact && <span><strong>WeCare</strong><small>Pocket</small></span>}
  </div>;
}

function Badge({ children, tone = "teal" }) {
  return <span className={`badge badge-${tone}`}><i />{children}</span>;
}

function PrimaryButton({ children, onClick, tone = "teal", icon = true }) {
  return <button className={`primary-button button-${tone}`} onClick={onClick}>{children}{icon && <Icon name="arrow" size={16} />}</button>;
}

function StatusBar({ dark = false }) {
  return <div className={`status-bar ${dark ? "status-dark" : ""}`}><span>9:41</span><span className="status-right">5G&nbsp; ●●●&nbsp; 100%</span></div>;
}

function BottomDock({ active = "Vault", dark = false, onNavigate }) {
  return <div className={`phone-dock ${dark ? "dock-dark" : ""}`}>
    {NAV_ITEMS.map((item) => <button key={item.label} className={active === item.label ? "dock-item active" : "dock-item"} onClick={() => onNavigate(item.target)}><span>{item.icon}</span><small>{item.label}</small></button>)}
  </div>;
}

function PhoneHeader({ screen, dark = false, onBack, onMore }) {
  return <header className={`phone-header ${dark ? "phone-header-dark" : ""}`}>
    <button className="back-button" onClick={onBack} aria-label="Back"><Icon name="back" size={18} /></button>
    <div><h1>{screen.title}</h1><p>{screen.subtitle}</p></div>
    <button className="more-button" onClick={onMore} aria-label="More options"><Icon name="more" size={19} /></button>
  </header>;
}

function DataCard({ card, index = 0, dark = false, onClick }) {
  const tones = ["teal", "orange", "blue", "neutral"];
  return <article className={`data-card ${dark ? "data-card-dark" : ""} card-enter`} style={{ "--delay": `${index * 45}ms` }} onClick={onClick} onKeyDown={(event) => { if (onClick && (event.key === "Enter" || event.key === " ")) onClick(); }} tabIndex={onClick ? 0 : undefined}>
    <div className="card-topline"><span className={`card-icon icon-tone-${tones[index % tones.length]}`}>{["✦", "⌁", "◌", "▦"][index % 4]}</span>{card.badge && <Badge tone={card.badge.toLowerCase().includes("urgent") || card.badge.toLowerCase().includes("needs") ? "orange" : "teal"}>{card.badge}</Badge>}</div>
    <h3>{card.title}</h3>
    <p>{card.body}</p>
    {onClick && <span className="card-action">Open <Icon name="arrow" size={13} /></span>}
  </article>;
}

function QRCode({ compact = false }) {
  return <div className={`qr-code ${compact ? "qr-compact" : ""}`} aria-label="Secure QR code">
    {Array.from({ length: compact ? 25 : 49 }).map((_, index) => <i key={index} className={(index * 17 + index * index) % 7 < 3 ? "on" : ""} />)}
  </div>;
}

function ChartCard() {
  return <div className="chart-card"><div className="chart-y"><span>120</span><span>100</span><span>80</span></div><div className="chart-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 340 120" preserveAspectRatio="none" aria-label="Improving trend"><path d="M8 96 C45 82, 66 84, 91 71 S139 72, 166 58 S212 53, 239 42 S284 43, 331 20" /><circle cx="8" cy="96" r="4" /><circle cx="91" cy="71" r="4" /><circle cx="166" cy="58" r="4" /><circle cx="239" cy="42" r="4" /><circle cx="331" cy="20" r="5" /></svg><div className="chart-x"><span>Mar</span><span>May</span><span>Jul</span><span>Aug</span></div></div>;
}

function CalendarGrid() {
  const days = Array.from({ length: 35 }, (_, index) => index - 2);
  return <div className="calendar-grid">{days.map((day, index) => <span key={index} className={day < 1 ? "muted" : day % 9 === 0 ? "missed" : day < 25 ? "done" : "future"}>{day > 0 ? day : ""}</span>)}</div>;
}

function ProgressRing({ value = 80 }) {
  return <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg` }}><div><strong>{value}%</strong><small>On track</small></div></div>;
}

function ScreenBody({ screen, state, onAction, onNavigate, onToggleConsent }) {
  const dark = ["dark-reminder", "danger", "dark-security"].includes(screen.kind);
  const isIntro = ["language", "welcome", "otp", "consent", "success"].includes(screen.kind);
  const cards = screen.cards || [];

  if (screen.kind === "language") return <div className="intro-body language-body"><div className="logo-hero"><Logo compact /><h2>WeCare Pocket</h2><p>The sovereign patient health passport</p></div>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "welcome") return <div className="intro-body welcome-body"><div className="welcome-hero"><div className="hero-orbit"><span>✦</span><span>+</span><span>◌</span></div><h2>Your Health,<br /><em>Remembered Forever.</em></h2><p>A lifetime sovereign passport for your medical records.</p></div>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "otp") return <div className="intro-body otp-body"><p className="notice">Verification code sent to <strong>+91 98765-43210</strong></p><div className="otp-inputs">{Array.from({ length: 6 }).map((_, i) => <button key={i} className={i < 4 ? "filled" : ""} onClick={() => onAction("OTP digit")}>{i < 4 ? "•" : ""}</button>)}</div>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}<p className="resend">Resend code in <strong>00:24</strong></p></div>;
  if (screen.kind === "consent") return <div className="intro-body consent-body"><div className="consent-hero"><Badge>Data sovereignty guarantee</Badge><h2>We Only See<br /><em>What You Allow.</em></h2><p>Granular privacy toggles. Revoke any permission anytime.</p></div>{cards.map((card, i) => { const key = i === 0 ? "history" : i === 1 ? "ai" : "pharmacy"; const enabled = state.consent[key]; return <div key={card.title} className={`toggle-row ${enabled ? "enabled" : "disabled"}`} onClick={() => onToggleConsent(key)}><div><Badge tone={enabled ? "teal" : "orange"}>{enabled ? "Active [ON]" : "Paused [OFF]"}</Badge><h3>{card.title}</h3><p>{card.body}</p></div><button className={`switch ${enabled ? "on" : ""}`} aria-label={`Toggle ${card.title}`}><i /></button></div>; })}</div>;
  if (screen.kind === "success") return <div className="intro-body success-body"><div className="success-mark">✓</div><Badge>{screen.id === "p47" ? "Results ready" : screen.id === "p05" ? "Vault active" : "Access removed"}</Badge><h2>{screen.id === "p05" ? "Your Lifetime Record is Now Active." : screen.id === "p47" ? "Your Results Are Ready." : "You Are Back In Total Control."}</h2>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;

  if (screen.kind === "home") return <div className="phone-content home-body"><div className="vault-hero"><div className="profile-line"><span className="avatar">RS</span><strong>Rohan Sharma <small>(34M)</small></strong><Badge>ABHA 91-8472</Badge></div><h2>{screen.id === "p56" ? "Your Health is Secure" : "Health Resilience"}</h2><p>{screen.id === "p56" ? "Health Resilience Index: 94/100 (Optimal)" : "Resilience Index: 92/100 (Optimal)"}</p><button className={`dose-alert ${state.meds.metforminTaken ? "dose-complete" : ""}`} onClick={() => onAction("Take dose")}>{state.meds.metforminTaken ? "✓ Metformin 500mg logged to vault" : "● Metformin 500mg due in 45 mins"}<strong>{state.meds.metforminTaken ? "VIEW LOG →" : "TAKE DOSE →"}</strong></button></div><div className="metric-pair"><div><span>Blood Pressure</span><strong>118 / 78</strong><small>Optimal mmHg</small></div><div><span>Fasting Glucose</span><strong>94 mg/dL</strong><small>Metropolis Lab</small></div></div>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;

  if (screen.kind === "chart") return <div className="phone-content"><div className="metric-pair"><div><span>Latest Reading</span><Badge>Normal</Badge><strong>94 mg/dL</strong><small>18 Aug 2026</small></div><div><span>6-Mo Change</span><Badge>Positive</Badge><strong>−12 mg/dL</strong><small>Improving trend</small></div></div><ChartCard />{cards.slice(2).map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "notifications") return <div className="phone-content"><div className="notification-summary"><div><strong>{state.notifications.filter((item) => !item.read).length}</strong><span>unread updates</span></div><button onClick={() => onAction("Mark all as read")}>Mark all read</button></div>{state.notifications.map((item, index) => <DataCard key={item.id} card={{ badge: item.read ? "Read" : "New", title: item.title, body: item.detail }} index={index} onClick={() => onAction(item.title)} />)}</div>;
  if (screen.kind === "privacy") return <div className="phone-content"><div className="privacy-score"><Icon name="shield" size={22} /><div><strong>Your sharing perimeter</strong><span>{state.accessGrants.filter((grant) => grant.active).length} active grants · patient controlled</span></div></div>{state.accessGrants.map((grant, index) => <DataCard key={grant.id} card={{ badge: grant.active ? "Active grant" : "Revoked", title: grant.name, body: `${grant.scope}${grant.active ? " · Revoke" : " · Access removed"}` }} index={index} onClick={() => grant.active ? onAction(`Revoke ${grant.name}`) : onAction(grant.name)} />)}</div>;
  if (screen.kind === "progress") return <div className="phone-content centered-content"><ProgressRing value={screen.id === "p50" ? 100 : 80} />{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "calendar") return <div className="phone-content"><div className="calendar-summary"><div><span>Current streak</span><strong>{state.meds.streak} days</strong></div><Badge>{state.meds.metforminTaken ? "Today logged" : "100% Perfect"}</Badge></div><h3 className="section-label">August compliance <span>{state.meds.metforminTaken ? "98%" : "96%"}</span></h3><CalendarGrid />{cards.slice(1).map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "scanner") return <div className="phone-content scanner-body"><div className="scanner-frame"><div className="scan-corner tl" /><div className="scan-corner tr" /><div className="scan-corner bl" /><div className="scan-corner br" /><div className="scan-document"><span>METROPOLIS LAB</span><strong>Diagnostic Report</strong><i /><i /><i /><i /></div><Badge>Good lighting</Badge></div>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "qr" || screen.kind === "emergency") return <div className="phone-content"><div className={`qr-panel ${screen.kind === "emergency" ? "qr-emergency" : ""}`}><QRCode /><Badge tone={screen.kind === "emergency" ? "orange" : "teal"}>{cards[0]?.badge || "Secure token"}</Badge><h3>{cards[0]?.title}</h3><p>{cards[0]?.body}</p></div>{cards.slice(1).map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "danger") return <div className="phone-content danger-body"><div className="danger-icon">!</div><div className="danger-panel"><Badge tone="orange">Emergency override</Badge><h2>{screen.title === "The Kill Switch" ? "Stop all sharing with this clinic?" : "Share vital records with emergency team?"}</h2><p>{cards[0]?.body}</p><button className="danger-button" onClick={() => onAction(screen.primary)}>{screen.primary}</button><button className="cancel-button" onClick={() => onAction("Cancel")}>Cancel & Keep Active</button></div></div>;
  if (screen.kind === "dark-reminder") return <div className="phone-content dark-content ritual-body"><div className="ritual-mark">✦</div><Badge>Focus dose ritual</Badge><h2>Time For Your<br /><em>Medicine.</em></h2>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} dark onClick={() => onAction(card.title)} />)}<button className="ritual-secondary" onClick={() => onAction("Snooze")}>Skip / Snooze 15m</button></div>;
  if (screen.kind === "dark-security") return <div className="phone-content dark-content security-body"><div className="security-orb"><Icon name="lock" size={30} /></div><Badge>Encrypted</Badge><h2>Biometric<br /><em>Enclave</em></h2>{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} dark onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "video") return <div className="phone-content video-body"><div className="video-frame"><div className="video-avatar">PS</div><span className="recording">REC ●</span><small>Live 08:42</small><h3>Dr. Priya Sharma, MD</h3></div><div className="subtitle-box"><Badge>AI Live</Badge><p>Doctor: Please continue fever meds for 2 days.</p><p className="arabic-copy">डॉक्टर: कृपया बुखार की दवा 2 दिन और लें।</p></div>{cards.slice(1).map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
  if (screen.kind === "matrix") return <div className="phone-content matrix-body"><div className="matrix-head"><span>Criteria</span><strong>Apollo</strong><strong>Dubai</strong></div>{[["Diagnosis","Bronchitis","Concurred"],["Treatment","5-day course","Same protocol"],["Cardiac","Not flagged","Normal"]].map((row) => <div className="matrix-row" key={row[0]}><span>{row[0]}</span><strong>{row[1]}</strong><strong>{row[2]}</strong></div>)}{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;

  return <div className={`phone-content ${isIntro ? "" : ""}`}>{screen.kind === "metrics" && <div className="metric-pair"><div><span>Average BP</span><strong>118 / 78</strong><small>Optimal mmHg</small></div><div><span>Resting heart rate</span><strong>72 bpm</strong><small>Stable</small></div></div>}{screen.kind === "offline" && <div className="offline-banner"><span>⌁</span><div><strong>{state.queuedActions ? `${state.queuedActions} transactions queued` : "All transactions synced"}</strong><p>{state.queuedActions ? "Your local changes are safe." : "Your vault is up to date."}</p></div></div>}{screen.kind === "arabic" && <div className="arabic-hero" dir="rtl"><Badge>معتمد ✓</Badge><h2>صحتك، محفوظة.</h2><p>Cross-border health passport</p></div>}{screen.kind === "card" && <div className="physical-card"><div className="card-chip">◈</div><strong>WeCare</strong><small>WC-NFC-849</small><span>O+</span></div>}{screen.kind === "map" && <div className="map-panel"><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-pin">✦</div><span>5 min</span></div>}{screen.kind === "catalog" && <div className="search-field"><Icon name="search" size={17} /><span>Search tests</span></div>}{screen.kind === "payment" && <div className="payment-total"><span>Total</span><strong>₹1,499.00</strong><small>Google Pay UPI · rohan@okhdfcbank</small></div>}{screen.kind === "invite" && <div className="form-preview"><label>Recipient<input value={state.caregiver.recipient} readOnly /></label><label>Relationship<select defaultValue="Daughter" onChange={() => onAction("Relationship changed")}><option>Daughter</option><option>Son</option><option>Care team</option></select></label></div>}{screen.kind === "booking" && <div className="slot-row"><span>{state.booking.confirmed ? "Confirmed" : "Today"}</span><strong>{state.booking.label}</strong><Badge>{state.booking.confirmed ? "Booked ✓" : "Selected"}</Badge></div>}{cards.map((card, i) => <DataCard key={card.title} card={card} index={i} onClick={() => onAction(card.title)} />)}</div>;
}

function PhonePreview({ screen, state, onAction, onNavigate, onMore, onToggleConsent }) {
  const dark = ["dark-reminder", "danger", "dark-security"].includes(screen.kind);
  return <div className={`web-preview ${dark ? "web-preview-dark" : ""}`}><div className="web-preview-head"><div><span className="eyebrow">LIVE PRODUCT STATE</span><strong>{screen.code} · {screen.title}</strong></div><div className="web-preview-meta"><span className="online-dot" />Local demo state</div></div><div className={`web-screen ${dark ? "screen-dark" : ""}`}>{screen.kind === "language" || screen.kind === "welcome" ? <div className="web-title-spacer" /> : <PhoneHeader screen={screen} dark={dark} onBack={() => onNavigate("p06")} onMore={onMore} />}<ScreenBody screen={screen} state={state} onAction={onAction} onNavigate={onNavigate} onToggleConsent={onToggleConsent} />{screen.kind !== "danger" && screen.kind !== "dark-reminder" && <div className="web-action-bar"><div><span className="web-action-label">NEXT SAFE ACTION</span><strong>{screen.primary}</strong></div><PrimaryButton tone={dark ? "light" : screen.kind === "emergency" ? "orange" : "teal"} onClick={() => onAction(screen.primary)}>{screen.primary}</PrimaryButton></div>}</div></div>;
}

function Sidebar({ activeScreen, onNavigate, section, setSection, search, setSearch }) {
  return <aside className="sidebar"><Logo /><div className="workspace-label"><span className="workspace-dot" />Patient workspace <Icon name="more" size={15} /></div><div className="sidebar-search"><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search screens" /></div><nav className="main-nav">{NAV_ITEMS.map((item) => <button key={item.label} className={activeScreen === item.target ? "nav-link active" : "nav-link"} onClick={() => onNavigate(item.target)}><span className="nav-icon">{item.icon}</span>{item.label}<span className="nav-count">{item.label === "Vault" ? "12" : item.label === "Timeline" ? "8" : item.label === "Consult" ? "9" : "6"}</span></button>)}</nav><div className="library-title"><span>DESIGN LIBRARY</span><span>60</span></div><div className="section-nav">{sections.slice(1).map((item) => <button key={item} className={section === item ? "section-link active" : "section-link"} onClick={() => setSection(item)}><span className="section-dot" />{item}<span>{screens.filter((screen) => screen.section === item).length}</span></button>)}</div><div className="sidebar-footer"><div className="privacy-note"><Icon name="shield" size={16} /><span><strong>Privacy by design</strong><small>Demo data · not a clinical record</small></span></div><button className="profile-button"><span className="avatar small">RS</span><span><strong>Rohan Sharma</strong><small>Patient workspace</small></span><Icon name="more" size={15} /></button></div></aside>;
}

function Modal({ modal, onClose, onConfirm }) {
  if (!modal) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`modal-card ${modal.tone === "danger" ? "modal-danger" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button><div className="modal-icon">{modal.tone === "danger" ? "!" : modal.tone === "success" ? "✓" : "✦"}</div><span className="eyebrow">{modal.kicker || "CONFIRMATION"}</span><h2 id="modal-title">{modal.title}</h2><p>{modal.body}</p>{modal.detail && <div className="modal-detail">{modal.detail}</div>}<div className="modal-actions"><button className="modal-secondary" onClick={onClose}>{modal.cancelLabel || "Cancel"}</button><button className={`modal-primary ${modal.tone === "danger" ? "modal-primary-danger" : ""}`} onClick={onConfirm}>{modal.confirmLabel || "Continue"}<Icon name="arrow" size={15} /></button></div></section></div>;
}

function App() {
  const [activeId, setActiveId] = useState(window.location.hash.slice(1) || "p06");
  const [section, setSection] = useState("All screens");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [state, setState] = useState(loadState);
  const [modal, setModal] = useState(null);
  const activeScreen = screenById[activeId] || screenById.p06;
  const filteredScreens = useMemo(() => screens.filter((screen) => (section === "All screens" || screen.section === section) && `${screen.code} ${screen.title} ${screen.subtitle}`.toLowerCase().includes(search.toLowerCase())), [section, search]);

  useEffect(() => { window.location.hash = activeScreen.id; }, [activeScreen.id]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(""), 2800); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { persistState(state); }, [state]);

  function navigate(id) { setActiveId(id); setToast(""); }
  function announce(message) { setToast(message); }
  function updateState(updater, message) {
    setState((current) => addAuditEvent(typeof updater === "function" ? updater(current) : { ...current, ...updater }, message));
    announce(`${message} · saved to demo vault`);
  }
  function openConfirmation(config) { setModal(config); }
  function action(label) {
    const id = activeScreen.id;
    if (label === "Mark all as read" || id === "p12" && label === activeScreen.primary) {
      updateState((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) }), "Notifications marked as read");
      return;
    }
    if (label === "Take dose" || label.includes("Taken") || id === "p21") {
      updateState((current) => ({ ...current, meds: { ...current.meds, metforminTaken: true, streak: current.meds.streak + (current.meds.metforminTaken ? 0 : 1) } }), "Metformin dose logged");
      return;
    }
    if (label.startsWith("Revoke") || id === "p25" || id === "p24" && label.includes("grant")) {
      openConfirmation({ tone: "danger", kicker: "ACCESS CONTROL", title: "Revoke this access grant?", body: "The third party will lose access immediately. Your records stay in the vault.", detail: "This creates a visible audit event and rotates the affected sharing key.", confirmLabel: "Revoke access", action: "revoke" });
      return;
    }
    if (id === "p54" || label === "Share emergency record") {
      openConfirmation({ tone: "danger", kicker: "EMERGENCY OVERRIDE", title: "Share the minimum emergency record?", body: "Only your blood group, critical allergy, and last medication will be shared for this session.", detail: "The handoff expires automatically after 15 minutes.", confirmLabel: "Share emergency record", action: "emergency" });
      return;
    }
    if (id === "p30" || label === "Send caregiver invitation") {
      openConfirmation({ kicker: "CAREGIVER ACCESS", title: "Send a read-only invitation?", body: `An invite will be sent to ${state.caregiver.recipient}. You can revoke access at any time.`, confirmLabel: "Send invitation", action: "caregiver" });
      return;
    }
    if (id === "p34" || id === "p45" || label.includes("Confirm & Pay")) {
      openConfirmation({ kicker: "BOOKING", title: "Confirm this care slot?", body: "Your demo booking will be added to the timeline. No real payment will be processed.", detail: activeScreen.subtitle, confirmLabel: "Confirm booking", action: "booking" });
      return;
    }
    if (["p41", "p42", "p48"].includes(id) || label.includes("Pay now") || label.includes("Proceed to Pay")) {
      openConfirmation({ kicker: "DEMO PAYMENT", title: "Approve this simulated payment?", body: "This is a safe demo transaction. No bank, card, or UPI network will be contacted.", detail: id === "p42" ? "New total after generic savings: ₹114" : "Total: ₹1,499.00", confirmLabel: "Approve demo payment", action: "payment" });
      return;
    }
    if (id === "p16" || label.includes("Upload") || label.includes("Capture")) {
      openConfirmation({ kicker: "DOCUMENT INTAKE", title: "Add a simulated report scan?", body: "A draft document will be added to the local demo vault and marked as awaiting review.", confirmLabel: "Add draft scan", action: "upload" });
      return;
    }
    if (id === "p32" || label.includes("Share link")) {
      updateState((current) => ({ ...current, share: { ...current.share, created: true } }), "Expiring share link created");
      return;
    }
    if (id === "p57" || label.includes("queued")) {
      updateState((current) => ({ ...current, queuedActions: 0 }), "Offline queue synced");
      return;
    }
    announce(`${label} · recorded in demo state`);
  }
  function toggleConsent(key) {
    updateState((current) => ({ ...current, consent: { ...current.consent, [key]: !current.consent[key] } }), `${key} permission ${state.consent[key] ? "paused" : "enabled"}`);
  }
  function confirmModal() {
    const actionType = modal?.action;
    if (actionType === "revoke") updateState((current) => ({ ...current, accessGrants: current.accessGrants.map((grant, index) => index === 0 ? { ...grant, active: false } : grant) }), "Access grant revoked");
    if (actionType === "emergency") updateState((current) => ({ ...current, queuedActions: current.queuedActions + 1 }), "Emergency handoff created");
    if (actionType === "caregiver") updateState((current) => ({ ...current, caregiver: { ...current.caregiver, invited: true } }), "Caregiver invitation sent");
    if (actionType === "booking") updateState((current) => ({ ...current, booking: { ...current.booking, confirmed: true } }), "Care slot confirmed");
    if (actionType === "payment") updateState((current) => ({ ...current, cart: { ...current.cart, items: 0 } }), "Demo payment approved");
    if (actionType === "upload") updateState((current) => ({ ...current, queuedActions: current.queuedActions + 1 }), "Draft report added");
    setModal(null);
  }

  return <div className="app-shell"><Sidebar activeScreen={activeId} onNavigate={navigate} section={section} setSection={setSection} search={search} setSearch={setSearch} /><main className="app-main"><header className="topbar"><div><span className="eyebrow">PRODUCT MAP <b>·</b> 60 Figma screens</span><h1>Health passport experience</h1></div><div className="topbar-actions"><button className="icon-button" aria-label="Notifications" onClick={() => navigate("p12")}><Icon name="bell" size={18} /><i /></button><span className="top-avatar">RS</span></div></header><div className="content-area"><div className="screen-library"><div className="library-heading"><div><span className="eyebrow">IMPLEMENTATION BOARD</span><h2>Choose a product state</h2></div><button className="view-toggle" onClick={() => setSection("All screens")}><Icon name="grid" size={16} /> All screens</button></div><div className="screen-list">{filteredScreens.map((screen) => <button key={screen.id} className={activeId === screen.id ? "screen-row active" : "screen-row"} onClick={() => navigate(screen.id)}><span className="screen-number">{screen.code}</span><span className="screen-row-copy"><strong>{screen.title}</strong><small>{screen.subtitle}</small></span><Icon name="arrow" size={14} /></button>)}{filteredScreens.length === 0 && <div className="empty-library"><span>⌁</span><strong>No screens found</strong><p>Try a different search or section.</p></div>}</div></div><section className="preview-area"><div className="preview-toolbar"><div><Badge>{activeScreen.section}</Badge><span className="node-ref">Figma node {activeScreen.nodeId}</span></div><button className="inspect-button" onClick={() => action("Design inspection")}>Inspect state <Icon name="arrow" size={15} /></button></div><PhonePreview key={activeScreen.id} screen={activeScreen} state={state} onAction={action} onNavigate={navigate} onMore={() => openConfirmation({ kicker: "SCREEN CONTROLS", title: activeScreen.title, body: "This screen is wired to local demo state. Actions are reversible and are never sent to a real healthcare system.", confirmLabel: "Close", action: "close" })} onToggleConsent={toggleConsent} /></section></div></main>{toast && <div className="toast"><span className="toast-check"><Icon name="check" size={14} /></span><span>{toast}</span><button onClick={() => setToast("")}>×</button></div>}<Modal modal={modal} onClose={() => setModal(null)} onConfirm={confirmModal} /></div>;
}

createRoot(document.getElementById("root")).render(<App />);
