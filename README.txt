RES-COM HVAC QR SHARED APP v4 — RELIABILITY UPDATE

FIXES
- Home/back buttons use stronger tap handling on iPhone and iPad.
- Settings HOME button has a global fallback so it cannot get stranded.
- Removed the external scanner library that could fail to load and interfere with the page.
- Live QR scanning uses the device's built-in QR detector where supported.
- Added SCAN QR FROM PHOTO fallback.
- If a device still cannot scan inside the app, the normal phone Camera app can scan the QR and open the Res-Com unit.

UPDATE GITHUB
Replace all existing hosted files with this package, especially index.html and service-worker.js.

AFTER GITHUB PAGES UPDATES
1. Open the site in Safari and refresh.
2. Fully close the Home Screen app and reopen it.
3. If an old version is still cached, remove the Home Screen icon and add it again from Safari.
