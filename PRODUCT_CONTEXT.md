# Product context

## Evidence status

The source workspace contained `citrus.txt` and the Figma file only. There was no existing codebase, API contract, database schema, authentication system, deployment configuration, or validated product brief. The statements below separate what was recovered from Figma from what remains a product decision.

| Area | Status | Evidence / decision |
| --- | --- | --- |
| Product | Recovered from design | WeCare Pocket, a sovereign patient health passport. |
| Primary user | Recovered from design | A patient who stores, reviews, shares, and revokes access to health records. |
| Secondary users | Recovered from design | Caregivers, clinicians, pharmacies, laboratories, insurers, and emergency teams. |
| Primary journey | Recovered from design | Language → welcome → identity verification → consent → vault → care action → auditable sharing. |
| Healthcare data | Design evidence only | Prescriptions, visits, labs, vitals, documents, insurance, payments, and access events are represented. |
| Data source | Demo | The current implementation uses clearly labeled local demo state. It does not represent real clinical data. |
| Backend | Unknown | No backend exists in the supplied workspace. API and database work requires product-owner decisions and service credentials. |
| Authentication | Design evidence only | OTP and ABHA-linked identity are shown. No production identity provider is configured. |
| Compliance | Requires review | The UI references DPDP/ABDM. No compliance claim is made by this implementation. |
| Clinical safety | Designed for review | AI extraction is shown as a draft that requires human confirmation before saving. |

## Product principles

- Keep the patient in control of sharing.
- Make clinical and security status visible.
- Treat AI extraction as a draft until a person reviews it.
- Make destructive access actions explicit and reversible where possible.
- Keep demo data visibly separate from real records.
- Use calm, high-contrast, low-cognitive-load layouts.

## Core workflow state

```text
LANGUAGE_SELECTED
  → IDENTITY_PENDING
  → IDENTITY_VERIFIED
  → CONSENT_REVIEW
  → VAULT_ACTIVE
  → CARE_ACTION_IN_PROGRESS
  → HUMAN_REVIEW_REQUIRED
  → SAVED_OR_REJECTED
  → AUDIT_RECORDED
```

Every important workflow needs failure, retry, cancel, expiry, permission-denied, offline, and conflict states before production release.

## Current implementation boundary

The greenfield app implements the 60 Figma screen states as an interactive, responsive product prototype. It includes navigation, search, screen filtering, status feedback, local UI state, accessible controls, responsive behavior, and reusable visual primitives. It deliberately does not pretend to implement live patient storage, payment processing, identity verification, clinical decisions, or insurer transmission without a real backend and approved contracts.
