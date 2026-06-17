# Bug Reports: ReqRes API

---

## BUG-001: BOLA - Private Gist Accessible by Any Authenticated User

| Field | Detail |
|---|---|
| Bug ID | BUG-001 |
| Severity | High |
| Related Test Case | TC-017 |
| Vulnerability Type | BOLA (Broken Object Level Authorization) — OWASP API Security #1 |
| Endpoint | GET /gists/:id |
| Environment | https://api.github.com |

**Request:**
- Method: GET
- URL: https://api.github.com/gists/7539d5baf08bb8405f2597e54f3253a9
- Headers: Authorization: Bearer {{githubToken}} (primary account token)
- Body: None

**Actual Response:**
- Status: 200
- Body: Full gist content returned including file contents, owner details, and commit history — owned by haris-yousaf-itz, accessed by haris-yousaf

**Expected Response:**
- Status: 403 or 404
- Body: Error indicating the resource is not accessible to this user

**Description:**
A private gist created by user haris-yousaf-itz was fully accessible to a different authenticated user (haris-yousaf) using only the gist ID. GitHub gists marked as private are not truly private — they are unlisted, meaning any authenticated user who knows or discovers the ID can read the full contents including file data and commit history.

This is a textbook BOLA vulnerability: the API returns object-level data based on ID knowledge alone without verifying that the requesting user has ownership or explicit access rights to that object.

**Security Impact:**
If a gist ID is leaked via a URL, log file, referrer header, or brute force, any authenticated GitHub user can read its contents regardless of the owner's privacy intent. This is especially dangerous for gists containing API keys, credentials, or sensitive configuration files.

**Standard Reference:**
OWASP API Security Top 10 2023 - API1: Broken Object Level Authorization.
APIs must verify that the authenticated user has the right to perform the requested action on the specific object, not just that they are authenticated.

**Note:**
This is a known GitHub design decision documented in their API docs. However it is included here as a documented BOLA finding because it demonstrates real-world authorization boundary failure regardless of intent.

---

