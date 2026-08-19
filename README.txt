Res-Com HVAC QR v30.14 — Fast PIN / Fresh Cloud Reads

This release fixes the PIN delay at the cloud/cache layer. Older Res-Com service workers used cache-first behavior for every GET request, which could also cache Airtable account responses. That could leave another phone looking at an older PIN/account record after an Admin had already changed it.

v30.14 never caches Airtable or other third-party cloud requests. Airtable GETs also use browser no-store mode. Sign In reuses the account list that is already on the login screen, and a correct PIN opens the app before the non-critical Last Login update finishes. PIN hashing/security is unchanged.

UPLOAD: unzip this package and upload the files to the SAME GitHub repository, branch, root, and Pages path. Replace files with matching names. Do not move or rename the site.

IMPORTANT AFTER UPLOAD: open the normal Res-Com website once while online, wait about 5 seconds so v30.14 can activate and delete the old service-worker cache, close it completely, then reopen the Home Screen app. Confirm APP v30.14 before testing a newly assigned PIN on another phone.
