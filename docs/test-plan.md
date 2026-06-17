# Test Plan: GitHub OAuth API

## 1. Objective

Validate the functional correctness, OAuth 2.0 authentication behavior,
authorization enforcement, and security characteristics of the GitHub REST
API. Special focus on token-based access control, cross-user data access
(BOLA), and token replay attack behavior.

## 2. Scope

### In Scope
- OAuth 2.0 authorization code flow (token obtained via Node.js server)
- User profile, repository, and gist endpoints
- Valid token, invalid token, missing token, and revoked token scenarios
- BOLA: attempting to access and modify another user's private resources
- Replay attack: using a revoked token to verify it is invalidated
- Response status codes, response body structure, and field-level assertions

### Out of Scope
- UI testing
- Performance or load testing
- Database-level validation
- Fine-grained token expiry testing
- GitHub Apps or GitHub Actions token flows
- Automated code-based testing (covered in Phase 5)

## 3. Test Types

| Type | Description |
|---|---|
| Functional | Does each endpoint return correct data for a valid authenticated request? |
| Authentication | Does the API correctly allow/deny access based on token validity? |
| Authorization (BOLA) | Can a user access or modify another user's private resources with their own token? |
| Security | Does a revoked token still grant access? (replay attack) |
| Negative | Does the API handle missing tokens, invalid tokens, and bad input correctly? |

## 4. Tools

| Tool | Purpose |
|---|---|
| Node.js + Express | OAuth 2.0 authorization code flow — token exchange server |
| Postman | Manual test execution and scripting |
| Newman | CLI-based collection runner |
| GitHub Actions | CI/CD pipeline to run Newman on push |
| Newman HTMLextra | HTML report generation |

## 5. Entry Criteria

- OAuth 2.0 flow completed successfully via Node.js server
- Valid access token stored in Postman environment as `githubToken`
- Second GitHub account token stored as `githubTokenUser2`
- A gist created on the second account with its ID noted for BOLA tests
- Postman collection and environment file created with all variables set

## 6. Exit Criteria

- All planned test cases executed
- BOLA and replay attack findings documented as bug reports or security notes
- Postman collection and environment exported and pushed to GitHub
- Newman runs successfully via GitHub Actions on push
- HTML report generated and uploaded as CI artifact
- README and test-cases.md complete

## 7. Risks and Assumptions

| Risk | Mitigation |
|---|---|
| GitHub tokens do not expire automatically | Revoke token manually via GitHub settings for replay attack test; document steps |
| BOLA test depends on second account having a private gist | Create a private gist on second account before running BOLA tests |
| Token must never be committed to the repository | Store as GitHub Actions secret; clear environment current value before export |
| GitHub API rate limit is 5000 requests/hour for authenticated requests | Well within limits for this test suite |
| OAuth app must be authorized by both accounts | Run Node.js flow separately for each account to obtain both tokens |
