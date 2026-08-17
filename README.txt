RES-COM HVAC QR v5 — PERMANENT QR / SHARED EQUIPMENT FIX

IMPORTANT CHANGES
1. A new blank QR is registered in Airtable immediately when it is created.
   The QR Unit ID no longer depends on one phone's local storage.
2. The Home screen refreshes the shared equipment list from Airtable.
   Existing equipment returns after app updates and on other authorized devices.
3. Old QR links using either ?unit= or the older ?equipment= format are accepted.
4. The unreliable Scan From Photo feature was removed.
5. In-app scanning is attempted only on browsers that support QR BarcodeDetector.
   On iPhone/iPad, the reliable method is the normal Camera app:
   point Camera at the Res-Com QR and tap the banner. It opens the exact unit.

DO NOT CHANGE THE GITHUB PAGES URL/REPOSITORY PATH.
Existing printed QR labels contain that web address. Keeping the same hosted URL keeps the labels valid.

UPDATE GITHUB
Replace all current app files with the contents of this package.
Especially replace index.html and service-worker.js.

AFTER DEPLOYMENT
Open the GitHub Pages site in Safari and refresh.
Then fully close and reopen the Home Screen app.
If a device still has the old cached version, remove only the Home Screen shortcut and add it again from the SAME GitHub Pages URL.
