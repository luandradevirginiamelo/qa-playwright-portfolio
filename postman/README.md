# Postman API Testing

API testing portfolio using Postman and JavaScript assertions.

## Technologies
- Postman
- JavaScript
- REST APIs
- Git and GitHub

## API Test Coverage

| Test | Method | Scenario |
|------|--------|----------|
| API 1 | GET | Retrieve products |
| API 2 | POST | Validate unsupported method |
| API 3 | GET | Retrieve brands |
| API 4 | PUT | Validate unsupported method |
| API 5 | POST | Search products |
| API 6 | PATCH | Simulate post update |
| API 7 | DELETE | Delete account (pending) |

## APIs Used
- Automation Exercise
- JSONPlaceholder

## Test Validations
- HTTP status codes
- API response codes
- JSON response structure
- Product and brand data
- Error messages
- Updated response fields

## How to Run
1. Install Postman.
2. Import `QA-API-Testing.postman_collection.json`.
3. Open the collection.
4. Run the configured requests.
5. Check the test results.

Note: API 7 (DELETE) is pending and should not be
executed without a dedicated disposable test account.

JSONPlaceholder simulates PATCH updates without
persisting changes.
