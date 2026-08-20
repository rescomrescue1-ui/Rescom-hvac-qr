RES-COM HVAC QR v30.16.2
Access Mode • Developer Release Status • Direct-Root QR Safety • Diagnostics • PIN Reset • Offline Photos

IMPORTANT
Keep the SAME GitHub Pages repository/path so every printed equipment QR label remains valid:
https://rescomrescue1-ui.github.io/Rescom-hvac-qr/

WHAT THIS REPAIR DOES
- Restores the full production app directly at the permanent GitHub Pages root.
- Removes the v30.16 launcher/nested-release production design.
- Equipment QR and Staff Sign-In QR links always point to the permanent Res-Com root.
- Cleans up leftover nested-release service workers and launcher caches.
- New production service workers wait for active field sessions to close instead of forcing a mid-job reload.
- Kai and Paul retain Developer Access through Airtable.
- Guest Mode is disabled for Res-Com-only company use.
- MORE → MANUAL has a hard-bound route.
- Existing PINs, Unit IDs, printed QR labels, service history, bug diagnostics, and offline-photo queue remain compatible.

FUTURE SAFE RELEASE WORKFLOW
Do not replace the production root while a candidate is still being tested. Future candidate builds should be placed in a separate candidate test folder. After a Developer approves the candidate, upload the approved production package to the root. That manual promotion is the company release step.

EMAIL RESET NOTE
AIRTABLE_PIN_RESET_EMAIL_SETUP.txt describes the one-time Airtable Automation required for actual Forgot PIN email delivery.

DEPLOYMENT
Upload the CONTENTS of this folder to the root of the existing Rescom-hvac-qr GitHub repository on main.
Do not rename the repository or GitHub Pages path.
Do not upload this app inside /releases/.
After GitHub Pages deploys, open the normal Res-Com URL online, confirm APP v30.16.4, close the app completely, and reopen it.

v30.16.2: Team now uses visible Tech/Admin/Developer Access Mode. Developers see a Release Status card with This App, Released to Everyone, Candidate, and an approval control.
