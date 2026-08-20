RES-COM HVAC QR — v30.15
Diagnostics • Email PIN Reset • Offline Photo Queue • QR Audit • Auto Update

IMPORTANT
Keep the SAME GitHub Pages repository/path so every printed equipment QR label remains valid:
https://rescomrescue1-ui.github.io/Rescom-hvac-qr/

WHAT'S NEW
- Bug diagnostics distinguish actual bugs from user mistakes and normal actions/navigation.
- Admin repeated-mistake alerts help identify confusing workflows.
- Forgot PIN uses a 15-minute one-time email reset code; existing PINs remain non-recoverable by design.
- Equipment QR URLs/scans and Staff QR audit data are synchronized to Airtable.
- Staff QR can be consumed correctly even when another account is already signed in.
- Offline equipment/service photos persist in IndexedDB and retry later.
- Separate camera and camera-roll/photo-library choices.
- Stronger automatic app/service-worker update checks.

EMAIL RESET NOTE
The included AIRTABLE_PIN_RESET_EMAIL_SETUP.txt describes the one-time Airtable Automation required for actual reset-code email delivery.

DEPLOYMENT
Upload the CONTENTS of this folder to the root of the existing Rescom-hvac-qr GitHub repository on main.
Do not rename the repository or GitHub Pages path.
After upload, open the normal Res-Com URL online, wait a few seconds, close it, and reopen the Home Screen app. Confirm APP v30.15.


v30.16 TRANSITION: Upload the ENTIRE zip contents to the existing repository root. The root becomes a stable release launcher. Do not upload only releases/30.16. Current team release stays v30.15 until a Developer approves v30.16.
Developer preview: open the normal app URL with ?candidate=1.
