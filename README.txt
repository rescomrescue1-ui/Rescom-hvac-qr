RES-COM HVAC QR v29.2 — FULL LOADING RECOVERY
Build: Aug 19, 2026 11:15 AM

IMPORTANT
Upload EVERY file in this folder to the ROOT of the same GitHub repository and replace files with the same names.

THIS PACKAGE FIXES THE STUCK LOADING SCREEN
- The technician app now opens BEFORE the version/network update check.
- Update checking runs in the background and cannot hold the loading screen open.
- A 2.5-second emergency watchdog removes any stuck loading overlay and returns the device to protected company PIN access.
- index.html now directly identifies v29.2; it no longer depends on the service worker rewriting the app version.
- Service worker cache is bumped to rescom-qr-v29-2-full-loading-fix.
- Navigation/index/version files use network-first behavior with saved-app fallback.

FULL PACKAGE INCLUDED
- index.html
- service-worker.js
- version.json
- manifest.webmanifest
- modern-ui.css
- modern-ui.js
- qrcode.min.js
- icon-192.png
- icon-512.png
- README.txt

KEEP THE SAME GITHUB PAGES ADDRESS.
Do not rename the repository or change the QR website path. Existing printed ?unit= and legacy ?equipment= QR links remain compatible.

AFTER UPLOAD
1. Wait for GitHub Pages to finish publishing.
2. Fully close the Res-Com app/Safari tab on each device.
3. Reopen it.
4. If an older installed PWA still shows stale files, open the SAME GitHub Pages URL in Safari/Chrome once, refresh, then reopen the Home Screen app.

Do not clear local browser storage unless absolutely necessary because the saved Airtable token and local settings live on the device.
