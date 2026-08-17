RES-COM HVAC QR v20.0 — ACCOUNTS + REMINDERS + QR COPY/PASTE

ACCOUNTS
- Airtable Accounts table
- Account Name
- Email
- Phone
- Notes
- Equipment links to an Account
- Account Email is copied onto the Equipment row for reminder emails
- Multiple pieces of equipment can share one Account

QR CAMERA WORKFLOW
1. Scan the QR with the normal Camera app.
2. Tap COPY EQUIPMENT ID.
3. Open the installed Res-Com app.
4. Tap PASTE EQUIPMENT ID.
5. Enter the company PIN if requested.

EMAIL REMINDERS
Set up two Airtable automations:
1. Warranty: daily scheduled trigger -> find Equipment where Warranty Expiration is today and Account Email is not empty -> send email to Account Email.
2. Maintenance: daily scheduled trigger -> find Equipment where Next Maintenance Due is today and Account Email is not empty -> send email to Account Email.

This runs from Airtable, so reminder emails can send even while the app is closed.

Keep the SAME GitHub Pages URL so existing QR labels continue to work.
