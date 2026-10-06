# Figma implementation map

The Figma source is a 60-screen mobile product flow. All screens use the shared `PhonePreview`, `StatusBar`, `PhoneHeader`, `DataCard`, `PrimaryButton`, and optional `BottomDock` primitives. Screen-specific compositions are selected by `kind` in `src/data.js` and rendered by `ScreenBody` in `src/main.jsx`.

| Figma | Node | Route/state | Composition | Domain |
| --- | --- | --- | --- | --- |
| P01 | `17-2` | `#p01` | Language gateway | Foundation |
| P02 | `17-3` | `#p02` | Welcome cards | Foundation |
| P03 | `17-4` | `#p03` | OTP verification | Foundation |
| P04 | `17-5` | `#p04` | Consent toggles | Foundation |
| P05 | `17-6` | `#p05` | Vault activation success | Foundation |
| P06 | `17-7` | `#p06` | Vault home and metrics | Core record |
| P07 | `17-8` | `#p07` | Timeline rail | Core record |
| P08 | `17-9` | `#p08` | Visit detail | Core record |
| P09 | `17-10` | `#p09` | Digital prescription | Core record |
| P10 | `17-11` | `#p10` | Document repository | Core record |
| P11 | `17-12` | `#p11` | AI extraction review | Core record |
| P12 | `17-13` | `#p12` | Notifications | Core record |
| P13–P20 | `18-21`–`18-29` | `#p13`–`#p20` | QR visit card, trends, recovery, upload, review, vitals, export, medication | Insights |
| P21–P23 | `18-30`–`18-32` | `#p21`–`#p23` | Reminder ritual, adherence, refill | Medication |
| P24–P28 | `18-33`, `18-35`–`18-38` | `#p24`–`#p28` | Privacy grants, revocation, audit, rights, success | Privacy |
| P29–P37 | `18-39`–`18-49` | `#p29`–`#p37` | Family, caregiver, sharing, doctors, booking, consult, home visit, summary | Care circle |
| P38–P48 | `18-50`–`18-61` | `#p38`–`#p48` | Referrals, receipts, consent, pharmacy, generic savings, orders, lab, UPI | Commerce |
| P49–P51 | `18-63`–`18-65` | `#p49`–`#p51` | Insurance vault, claim assembly, claim status | Insurance |
| P52–P55 | `18-66`–`18-70` | `#p52`–`#p55` | NFC card, emergency QR, emergency handoff, access log | Safety |
| P56–P60 | `18-71`–`18-75` | `#p56`–`#p60` | Mastery, offline sync, Arabic corridor, dark security, second opinion | Safety |

## Reusable data/API boundary

The UI is ready to receive these domain resources once API contracts exist:

- `patientProfile`
- `healthRecords`
- `encounters`
- `prescriptions`
- `labResults`
- `accessGrants`
- `auditEvents`
- `careCircleMembers`
- `appointments`
- `payments`
- `insurancePolicies`
- `claims`
- `notifications`

Production work must define authentication, authorization, validation, audit events, retention, and error contracts for each resource before connecting live data.
