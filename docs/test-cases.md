# Test Cases: GitHub OAuth API

## Endpoint Coverage Summary

| Method | Endpoint | Operation |
|---|---|---|
| GET | /user | Get authenticated user profile |
| GET | /users/:username | Get public user profile |
| GET | /user/repos | List authenticated user repositories |
| POST | /gists | Create gist |
| GET | /gists/:id | Get gist by ID |
| PATCH | /gists/:id | Update gist |
| DELETE | /gists/:id | Delete gist |
| GET | /rate_limit | Get rate limit status |

---

## Required Headers (All Authenticated Requests)

| Header | Value |
|---|---|
| Authorization | Bearer {{githubToken}} |
| Accept | application/vnd.github+json |
| X-GitHub-Api-Version | 2022-11-28 |

---

## Auth Tests

### TC-001: Get Authenticated User - Valid Token

| Field | Detail |
|---|---|
| Test Case ID | TC-001 |
| Endpoint | GET /user |
| Description | Valid token returns authenticated user profile |
| Pre-conditions | Valid token in githubToken variable |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 200 |
| Expected Response | Object containing `login`, `id`, `type` fields |
| Type | Functional / Auth |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200", function(){
    pm.response.to.have.status(200);
});

pm.test("Response contains 'login' field", function(){
    pm.expect(response).to.have.property("login")
});

pm.test("Login matches expected username", function(){
    pm.expect(response.login).to.eql("haris-yousaf")
});

pm.test("Response contains 'id' field", function(){
    pm.expect(response).to.have.property("id")
    pm.expect(response.id).to.be.a("number")
});

pm.test("Response contains 'type' field", function(){
    pm.expect(response).to.have.property("type")
});
```

---

### TC-002: Get Authenticated User - Invalid Token

| Field | Detail |
|---|---|
| Test Case ID | TC-002 |
| Endpoint | GET /user |
| Description | Invalid token value returns 401 |
| Pre-conditions | None |
| Auth | Bearer invalidtoken123 |
| Request Body | None |
| Expected Status | 401 |
| Expected Response | `{ "message": "Bad credentials" }` |
| Type | Auth / Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Response message is 'Bad credentials'", function () {
    pm.expect(response.message).to.eql("Bad credentials")
});
```

---

### TC-003: Get Authenticated User - Missing Token

| Field | Detail |
|---|---|
| Test Case ID | TC-003 |
| Endpoint | GET /user |
| Description | Request with no Authorization header returns 401 |
| Pre-conditions | None |
| Auth | None |
| Request Body | None |
| Expected Status | 401 |
| Expected Response | Error response indicating auth required |
| Type | Auth / Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Response message is 'Requires authentication'", function () {
    pm.expect(response.message).to.eql("Requires authentication")
});
```

---

## User Profile Tests

### TC-004: Get Own Public Profile by Username

| Field | Detail |
|---|---|
| Test Case ID | TC-004 |
| Endpoint | GET /users/haris-yousaf |
| Description | Public profile is accessible and contains expected fields |
| Pre-conditions | Valid token |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 200 |
| Expected Response | Object with `login`, `id`, `public_repos`, `type` fields |
| Type | Functional |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200", function(){
    pm.response.to.have.status(200);
});

pm.test("Response contains 'login' field", function(){
    pm.expect(response).to.have.property("login")
});

pm.test("Login matches username 'haris-yousaf'", function(){
    pm.expect(response.login).to.eql("haris-yousaf")
});

pm.test("Response contains 'id' field", function(){
    pm.expect(response).to.have.property("id")
    pm.expect(response.id).to.be.a("number")
});

pm.test("Response contains 'public_repos' field", function(){
    pm.expect(response).to.have.property("public_repos")
});

pm.test("Response contains 'type' field", function(){
    pm.expect(response).to.have.property("type")
});
```

---

### TC-005: Get Non-Existent User Profile

| Field | Detail |
|---|---|
| Test Case ID | TC-005 |
| Endpoint | GET /users/this-user-does-not-exist-xyz-99999 |
| Description | Non-existent username returns 404 |
| Pre-conditions | Valid token |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 404 |
| Expected Response | `{ "message": "Not Found" }` |
| Type | Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Response message is 'Not Found'", function () {
    pm.expect(response.message).to.eql("Not Found")
});
```

---

## Repository Tests

### TC-006: List Authenticated User Repositories

| Field | Detail |
|---|---|
| Test Case ID | TC-006 |
| Endpoint | GET /user/repos |
| Description | Returns list of repos accessible to the authenticated user |
| Pre-conditions | Valid token with repo scope |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 200 |
| Expected Response | Array of repo objects each containing `id`, `name`, `private`, `owner` fields |
| Type | Functional |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200", function(){
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function(){
    pm.expect(response).to.be.an("array");
});

pm.test("Each repo has fields 'id', 'name', 'private', 'owner'", function(){
    response.forEach(function(repo){
        pm.expect(repo).to.have.property("id");
        pm.expect(repo).to.have.property("name");
        pm.expect(repo).to.have.property("private");
        pm.expect(repo).to.have.property("owner");
    })
});
```

---

### TC-007: List Repositories Without Auth

| Field | Detail |
|---|---|
| Test Case ID | TC-007 |
| Endpoint | GET /user/repos |
| Description | Request without token returns 401 |
| Pre-conditions | None |
| Auth | None |
| Request Body | None |
| Expected Status | 401 |
| Expected Response | Error response indicating auth required |
| Type | Auth / Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Response message is 'Requires authentication'", function () {
    pm.expect(response.message).to.eql("Requires authentication")
});
```

---

## Gist Tests

### TC-008: Create Gist with Valid Data

| Field | Detail |
|---|---|
| Test Case ID | TC-008 |
| Endpoint | POST /gists |
| Description | Valid token creates a gist and returns it with an ID |
| Pre-conditions | Valid token with gist scope |
| Auth | Bearer {{githubToken}} |
| Request Body | See below |
| Expected Status | 201 |
| Expected Response | Object with `id`, `public`, `files`, `owner` fields |
| Type | Functional / Auth |

**Request Body:**
```json
{
  "description": "SQA Portfolio - Test Gist",
  "public": false,
  "files": {
    "test-file.txt": {
      "content": "This gist was created by an automated API test."
    }
  }
}
```

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 201", function(){
    pm.response.to.have.status(201);
})

pm.test("Response has 'id'", function(){
    pm.expect(response).to.have.property("id");
});

pm.test("Response has 'public'", function(){
    pm.expect(response).to.have.property("public");
});

pm.test("Response has 'files'", function(){
    pm.expect(response).to.have.property("files");
});

pm.test("Response has 'owner'", function(){
    pm.expect(response).to.have.property("owner");
});

// Save gist ID for subsequent requests
pm.environment.ser("gistId", response.id);
```

---

### TC-009: Get Gist by Valid ID

| Field | Detail |
|---|---|
| Test Case ID | TC-009 |
| Endpoint | GET /gists/{{gistId}} |
| Description | Returns the full gist object for a valid ID |
| Pre-conditions | Gist created in TC-008 |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 200 |
| Expected Response | Gist object with matching description and files |
| Type | Functional |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200", function(){
    pm.response.to.have.status(200);
});

pm.test("Gist description matches", function(){
    pm.expect(response.description).to.eql("SQA Portfolio - Test Gist")
});

pm.test("Gist has 'test-file.txt'", function(){
    pm.expect(response.files).to.have.property("test-file.txt")
});

pm.test("Owner is 'haris-yousaf'", function(){
    pm.expect(response.owner.login).to.eql("haris-yousaf")
});
```

---

### TC-010: Update Gist with Valid Data

| Field | Detail |
|---|---|
| Test Case ID | TC-010 |
| Endpoint | PATCH /gists/{{gistId}} |
| Description | Authenticated update modifies the gist description and file content |
| Pre-conditions | Gist created in TC-008, valid token |
| Auth | Bearer {{githubToken}} |
| Request Body | See below |
| Expected Status | 200 |
| Expected Response | Updated gist object with new description |
| Type | Functional / Auth |

**Request Body:**
```json
{
  "description": "SQA Portfolio - Updated Test Gist",
  "files": {
    "test-file.txt": {
      "content": "This gist was updated by an automated API test."
    }
  }
}
```

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200", function(){
    pm.response.to.have.status(200);
});

pm.test("Gist description updated", function(){
    pm.expect(response.description).to.eql("SQA Portfolio - Updated Test Gist")
});

pm.test("'test-file.txt' content updated", function(){
    pm.expect(response.files['test-file.txt'].content).to.eql("This gist was updated by an automated API test.")
});

pm.test("Owner is 'haris-yousaf'", function(){
    pm.expect(response.owner.login).to.eql("haris-yousaf")
});
```

---

### TC-011: Get Gist After Update

| Field | Detail |
|---|---|
| Test Case ID | TC-011 |
| Endpoint | GET /gists/{{gistId}} |
| Description | Verifies updated values persist after PATCH |
| Pre-conditions | Gist updated in TC-010 |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 200 |
| Expected Response | Gist with updated description |
| Type | Functional |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200", function(){
    pm.response.to.have.status(200);
});

pm.test("Updated Gist description persists", function(){
    pm.expect(response.description).to.eql("SQA Portfolio - Updated Test Gist")
});
```

---

### TC-012: Create Gist Without Auth

| Field | Detail |
|---|---|
| Test Case ID | TC-012 |
| Endpoint | POST /gists |
| Description | Create request without token is rejected |
| Pre-conditions | None |
| Auth | None |
| Request Body | Same as TC-008 |
| Expected Status | 401 |
| Expected Response | Error indicating auth required |
| Type | Auth / Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Response message is 'Requires authentication'", function () {
    pm.expect(response.message).to.eql("Requires authentication")
});
```

---

### TC-013: Delete Gist Without Auth

| Field | Detail |
|---|---|
| Test Case ID | TC-013 |
| Endpoint | DELETE /gists/{{gistId}} |
| Description | Delete request without token is rejected |
| Pre-conditions | Gist exists from TC-008 |
| Auth | None |
| Request Body | None |
| Expected Status | 401 |
| Expected Response | Error indicating auth required |
| Type | Auth / Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Response message is 'Requires authentication'", function () {
    pm.expect(response.message).to.eql("Requires authentication")
});
```

---

### TC-014: Delete Gist with Valid Token

| Field | Detail |
|---|---|
| Test Case ID | TC-014 |
| Endpoint | DELETE /gists/{{gistId}} |
| Description | Authenticated delete removes the gist |
| Pre-conditions | Gist exists, valid token |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 204 |
| Expected Response | Empty body |
| Type | Functional / Auth |

**Test Script:**
```javascript
pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});

pm.test("Response body is empty", function () {
    pm.expect(pm.response.text()).to.be.empty;
});
```

---

### TC-015: Get Gist After Deletion

| Field | Detail |
|---|---|
| Test Case ID | TC-015 |
| Endpoint | GET /gists/{{gistId}} |
| Description | Fetching a deleted gist returns 404 |
| Pre-conditions | Gist deleted in TC-014 |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 404 |
| Expected Response | `{ "message": "Not Found" }` |
| Type | Negative |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Response message is 'Not Found'", function () {
    pm.expect(response.message).to.eql("Not Found")
});
```

---

## BOLA Tests

Before running these, create a private gist on the `haris-yousaf-itz` account
manually or via Postman using `githubTokenUser2`. Save that gist ID as
`gistIdUser2` in your environment.

### TC-016: Access Own Gist with Own Token (Baseline)

| Field | Detail |
|---|---|
| Test Case ID | TC-016 |
| Endpoint | GET /gists/{{gistId}} |
| Description | Baseline — own token can access own gist |
| Pre-conditions | A new gist created on primary account, ID saved as gistId |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 200 |
| Expected Response | Full gist object |
| Type | Functional / BOLA baseline |

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Owner is haris-yousaf", function () {
    const json = pm.response.json();
    pm.expect(json.owner.login).to.eql("haris-yousaf");
});
```

---

### TC-017: Access User2 Private Gist with User1 Token (BOLA Read)

| Field | Detail |
|---|---|
| Test Case ID | TC-017 |
| Endpoint | GET /gists/{{gistIdUser2}} |
| Description | Primary account token attempts to read second account's private gist |
| Pre-conditions | Private gist exists on haris-yousaf-itz, ID in gistIdUser2 |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 404 or 403 |
| Actual Status | 200 |
| Expected Response | `{ "message": "Not Found" }` — private gist not visible to other users |
| Actual Response | Full gist content returned of User 2 |
| Type | BOLA / Security |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 200 instead of 404 - BOLA confirmed, see BUG-001", function () {
    pm.response.to.have.status(200);
});

pm.test("Gist is of another user - BOLA", function () {
    pm.expect(response.owner.login).to.eql("haris-yousaf-itz");
});

pm.test("Gist is private - BOLA", function () {
    pm.expect(response.public).to.eql(false);
});
```

---

### TC-018: Delete User2 Gist with User1 Token (BOLA Write)

| Field | Detail |
|---|---|
| Test Case ID | TC-018 |
| Endpoint | DELETE /gists/{{gistIdUser2}} |
| Description | Primary account token attempts to delete second account's gist |
| Pre-conditions | Private gist exists on haris-yousaf-itz, ID in gistIdUser2 |
| Auth | Bearer {{githubToken}} |
| Request Body | None |
| Expected Status | 403 or 404 |
| Expected Response | Error indicating forbidden or not found |
| Type | BOLA / Security |

**Test Script:**
```javascript
const response = pm.response.json();

pm.test("Status code is 403 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([403, 404]);
});

pm.test("Cross-user delete is rejected", function () {
    pm.expect(response).to.have.property("message");
});
```

---

## Replay Attack Test

### TC-019: Get Authenticated User with Revoked Token

| Field | Detail |
|---|---|
| Test Case ID | TC-019 |
| Endpoint | GET /user |
| Description | A manually revoked token is rejected and cannot be replayed |
| Pre-conditions | Token has been revoked via github.com/settings/tokens |
| Auth | Bearer {{revokedToken}} |
| Request Body | None |
| Expected Status | 401 |
| Expected Response | `{ "message": "Bad credentials" }` |
| Type | Security / Replay Attack |

**Setup steps before running:**
1. Generate a token via the Node.js OAuth flow
2. Store it in Postman as `revokedToken`
3. Go to github.com/settings/tokens and revoke it
4. Run this test case

**Test Script:**
```javascript
pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Revoked token is rejected", function () {
    const json = pm.response.json();
    pm.expect(json.message).to.eql("Bad credentials");
});

pm.test("Response does not contain user data", function () {
    const json = pm.response.json();
    pm.expect(json).to.not.have.property("login");
});
```
