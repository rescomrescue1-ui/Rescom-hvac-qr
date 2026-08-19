RES-COM HVAC QR — v29 MODERN UI PATCH
Build: Aug 19, 2026 10:49 AM

PURPOSE
This patch upgrades the existing Rescom-hvac-qr GitHub Pages app without changing the site path or printed QR links.

FILES TO REPLACE / ADD IN THE REPOSITORY ROOT
- modern-ui.css        (new)
- modern-ui.js         (new)
- service-worker.js    (replace)
- version.json         (replace)
- manifest.webmanifest (replace)

DO NOT REMOVE OR RENAME
- index.html
- qrcode.min.js
- icon-192.png
- icon-512.png

WHAT v29 ADDS
- Modern white/navy mobile UI based on the approved visual mockup.
- Five-tab bottom navigation: Home, Equipment, Accounts, Bugs, More.
- More bottom sheet for Settings, Manual, What's New and System Health.
- Fast 3-step first-use onboarding with technician selection.
- Customer QR landing clearly says the label is for service technicians and customer action is not required.
- Responsive layouts for iPhone, Samsung/Android, tablets and desktop browsers.
- Multi-label printing with 3-inch two-column labels and technician-only wording.
- Quantity quick buttons no longer create unwanted blank QR IDs.
- Create Blank QR opens the print center without creating an ID until Generate is tapped.
- Lazy-loaded service photos and debounced equipment search for smoother field use.
- Bug upload guard prevents recursive Airtable error-report storms.
- v29 Manual and Patch Notes are added dynamically in the app.

IMPORTANT
Keep the exact same GitHub Pages address. Existing ?unit= and legacy ?equipment= QR links remain compatible.
