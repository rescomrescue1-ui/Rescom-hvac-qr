RES-COM HVAC QR SHARED APP v2

WHAT CHANGED
- Equipment and service history can sync through your Airtable base:
  Res-Com Equipment Service Records
- One large SAVE button.
- Status shows SAVED & SYNCED / SYNC PENDING / OFFLINE.
- Offline entries remain on the device and are retried when connection returns.
- QR-first workflow remains unchanged.

IMPORTANT SECURITY SETUP
Do NOT put an Airtable token in GitHub source code.

On each iPhone/iPad:
1. Create a restricted Airtable Personal Access Token in Airtable.
2. Give it ONLY:
   - data.records:read
   - data.records:write
3. Give it access ONLY to:
   - Res-Com Equipment Service Records
4. In the Res-Com app, open Settings.
5. Paste the token and tap Save Connection.

GITHUB UPDATE
Replace the existing hosted app files with the files from this package:
- index.html
- manifest.webmanifest
- service-worker.js
- qrcode.min.js
- icon-192.png
- icon-512.png

After GitHub Pages updates, reopen the installed app. If iOS keeps an old version,
close the app completely and reopen it, or remove/re-add it to the Home Screen.
