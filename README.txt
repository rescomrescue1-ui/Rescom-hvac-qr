RES-COM HVAC QR v30.0 — TEAM / SEARCH / THEME CLEANUP
Build: Aug 19, 2026 11:43 AM

WHAT CHANGED
- Replaced the confusing customer Accounts tab + separate Technician/Company User setup with one TEAM account system.
- The first person who creates an App Account automatically becomes Admin.
- Every Admin and Tech signs in with their own email and password.
- New employee self-signups require the current 4-digit company PIN.
- Only Admins can generate/manage the company PIN.
- Admins can create users, promote Tech/Admin roles, disable/enable users, and reset passwords.
- Admin PIN email action prepares one email addressed to all active Admins with the new 4-digit PIN.
- Customer/Site Name, Customer Email and Customer Phone now save directly on the Equipment record. A separate customer account is no longer required.
- Equipment search merges locally scanned/created QR units with every equipment record downloaded from Airtable.
- Fixed the LOADING SHARED EQUIPMENT status so it always finishes as Equipment Ready, Local Equipment Ready, or Cloud Error — Local Equipment Ready.
- Added WHITE and BLACK appearance choices in Settings.
- Added strong contrast overrides so white text no longer disappears on white cards.
- Updated the Home welcome strip to use the Res-Com app logo instead of a generic RC circle.
- Updated the in-app Manual and Patch Notes for all v30 changes.
- Old local Technician / Company User / shared-company-PIN identity data is cleared once during the v30 migration. Equipment and service history are NOT deleted.
- Service History now saves the signed-in App Account email.

AIRTABLE CLEANUP / SCHEMA
- Old legacy Company User records were cleared.
- Old Customer account records were cleared.
- App Accounts is the active Res-Com employee account table.
- Added App Settings for the shared company PIN hash.
- Added Customer Phone directly to Equipment.

IMPORTANT
Upload ALL files from this package to the SAME GitHub Pages repository root and replace matching files.
Do not change the GitHub Pages URL. Existing printed QR labels remain compatible.
