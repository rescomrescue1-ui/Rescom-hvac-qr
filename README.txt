RES-COM HVAC QR v11.0 — BUTTON + UPDATE INDICATOR FIX

WHAT WAS WRONG
A new JavaScript control was being attached to a button that was not actually present in the HTML.
That threw an error during app startup and stopped later startup code from running.

FIXED
- Added the missing TEST CLOUD HISTORY control.
- Static buttons now use safe event binding so ONE missing button cannot crash the whole app.
- Permanent APP v11.0 badge is visible in the app.
- First launch after an update shows: APP UPDATED.
- Settings now has CHECK FOR APP UPDATE.
- If the service worker detects a newer deployed build, the app shows an UPDATE AVAILABLE banner.
- index.html and version.json are fetched network-first so phones are less likely to stay stuck on an old build.
- Existing scanner, history, photos, install date, and Airtable features remain.

BUILD
Aug 17, 2026 3:58 PM

IMPORTANT
Upload version.json along with the other files.
Keep the SAME GitHub Pages URL so existing printed QR labels continue to work.
