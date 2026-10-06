const STORAGE_KEY = "wecare-pocket-demo-v1";

export const defaultState = {
  profile: { name: "Rohan Sharma", age: 34, abha: "91-8472" },
  consent: { history: true, ai: true, pharmacy: true },
  meds: { metforminTaken: false, azithromycinTaken: false, streak: 24 },
  notifications: [
    { id: "dose", title: "Medicine due in 10 mins", detail: "Metformin 500mg morning dose with breakfast", read: false },
    { id: "record", title: "Dr. Sharma shared a record", detail: "Bronchitis follow-up note signed and encrypted", read: false },
    { id: "security", title: "NFC tap at Clinic A", detail: "Your physical card was used at 11:02 AM", read: true },
  ],
  accessGrants: [
    { id: "sharma", name: "Dr. Sharma · Lucknow", scope: "Prescriptions & vitals", active: true },
    { id: "pharmacy", name: "City Pharmacy", scope: "Current Rx only · expires in 24h", active: true },
  ],
  caregiver: { invited: false, recipient: "+91 98112-23344" },
  cart: { items: 3, total: 239 },
  share: { created: false, expires: "24h", pin: "8492" },
  booking: { confirmed: false, label: "Today 04:30 PM" },
  queuedActions: 2,
  auditEvents: [],
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultState));
}

export function loadState() {
  if (typeof window === "undefined") return cloneDefault();
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return saved ? { ...cloneDefault(), ...saved } : cloneDefault();
  } catch {
    return cloneDefault();
  }
}

export function persistState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The app remains usable if browser storage is unavailable.
  }
}

export function resetState() {
  const fresh = cloneDefault();
  try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  return fresh;
}

export function addAuditEvent(state, label) {
  return {
    ...state,
    auditEvents: [
      { id: `${Date.now()}-${label}`, label, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ...(state.auditEvents || []),
    ].slice(0, 12),
  };
}
