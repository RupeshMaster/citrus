# WeCare Pocket

Responsive implementation of the 60-screen WeCare Pocket health passport design system recovered from the supplied Figma file.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Select a screen from the implementation board or use a hash such as `#p06`.

## Functional demo flows

The prototype persists state in browser `localStorage` under `wecare-pocket-demo-v1`.

- Mark a dose as taken from the Vault or Reminder screen.
- Toggle consent permissions on the Consent screen.
- Mark notification updates as read.
- Revoke access grants with an explicit confirmation dialog.
- Send a caregiver invitation with a confirmation step.
- Confirm simulated appointments and payments.
- Add a simulated document draft to the review queue.
- Create an expiring share link and clear the offline sync queue.

All payment, identity, clinical, and emergency actions are local demo workflows. They do not call real healthcare, banking, or emergency services.

## Build

```bash
npm run build
```

## Design system

- Warm paper surface: `#faf9f7`
- Ink: `#1a1a1e`
- Deep privacy teal: `#093939`
- Primary teal: `#0e5959`
- Positive surface: `#e3f6f0`
- Safety accent: `#e8963c`
- Typography: DM Sans stack with accessible system fallbacks
- Mobile reference frame: 440 × 956

See [`PRODUCT_CONTEXT.md`](./PRODUCT_CONTEXT.md) for evidence boundaries and [`FIGMA_IMPLEMENTATION_MAP.md`](./FIGMA_IMPLEMENTATION_MAP.md) for Figma traceability.
