RES-COM HVAC QR v10 — SCANNER + HISTORY REBUILD

FIXED
- Replaced browser BarcodeDetector scanner with jsQR camera decoding.
- Same QR decoding method is used for live camera and Scan From Photo.
- Designed to work on iPhone, iPad, Android, and desktop browsers with camera access.
- Service history no longer relies on an Airtable linked-record formula.
- The app fetches history records and matches the actual Airtable linked equipment record ID.
- Equipment detail screen shows how many cloud history records were loaded.
- REFRESH HISTORY FROM CLOUD gives a visible error if Airtable history cannot be read.
- Settings includes TEST CLOUD HISTORY for troubleshooting.

IMPORTANT
Keep the SAME GitHub Pages URL so existing QR labels keep working.

AFTER UPDATING
1. Replace files in the same GitHub repository.
2. Wait for GitHub Pages deployment.
3. Open the site in Safari and refresh.
4. Fully close/reopen the Home Screen app.
5. If v10 is still not shown, remove the Home Screen shortcut and add it again from the same URL.

SCANNER
Camera access must be allowed.
If live scan struggles, use SCAN QR FROM PHOTO with a sharp photo where the entire QR is visible.
