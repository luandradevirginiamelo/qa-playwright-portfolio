
# QA Automation Portfolio

Welcome to my QA Automation Portfolio!

## About Me

I am a Software QA Engineer with 7+ years of experience in software testing, quality assurance, and test automation.

This portfolio demonstrates my practical experience in building automated test frameworks, validating REST APIs, and integrating automated tests into CI/CD pipelines.

## Featured Project

### Playwright UI & API Automation Framework

A test automation framework developed using Playwright and TypeScript to demonstrate modern QA engineering practices.

The project includes 51 automated test scenarios covering UI and API functionality.

## Test Coverage

| Test Type | Tests | Description |
|-----------|-------|-------------|
| UI Automation | 37 | Functional and end-to-end testing |
| API Automation | 14 | REST API validation |
| **Total** | **51** | **Automated test scenarios** |

### UI Automation

The UI tests use Playwright, TypeScript, and the Page Object Model (POM) design pattern.

Key features:

- End-to-end functional testing
- Page Object Model
- Reusable page components
- Positive and negative test scenarios
- Assertions and validations
- HTML test reports
- Defect identification and documentation

### API Automation

The API tests validate endpoints from the Automation Exercise application.

Test coverage includes:

- Retrieve products and brands
- Search for products
- Validate unsupported HTTP methods
- Verify login with valid credentials
- Verify login with invalid credentials
- Validate missing required parameters
- Create user accounts
- Update user information
- Retrieve account details
- Delete user accounts
- Automatically clean up test accounts

The API regression suite contains 14 tests and has successfully passed in GitHub Actions.

## Technologies and Tools

### Automation Framework

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)

### Additional QA Skills

- Java
- Selenium WebDriver
- REST API Testing
- Postman
- SQL

### Version Control and CI/CD

- Git
- GitHub
- GitHub Actions
- CI/CD

## Project Structure

```text
qa-playwright-portfolio/
├── .github/
│   └── workflows/
├── tests/
│   ├── api/
│   │   ├── account.api.spec.ts
│   │   ├── authentication.api.spec.ts
│   │   └── products.api.spec.ts
│   └── ui/
├── portfolio/
├── playwright.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/luandradevirginiamelo/qa-playwright-portfolio.git
```

Navigate to the project directory:

```bash
cd qa-playwright-portfolio
```

Install dependencies:

```bash
npm ci
```

Install Playwright Chromium:

```bash
npx playwright install chromium
```

## Running the Tests

### Run API Tests

```bash
npx playwright test tests/api/ --project=chromium --workers=1
```

### Run UI Tests

```bash
npx playwright test tests/ui/ --project=chromium --workers=1
```

### Run All Tests

```bash
npx playwright test --project=chromium --workers=1
```

### View HTML Report

```bash
npx playwright show-report
```

## Continuous Integration (CI/CD)

This project uses GitHub Actions to execute automated tests.

Separate workflows are configured for UI and API regression testing.

The CI pipeline includes:

- Repository checkout
- Node.js setup
- Dependency installation
- Automated test execution
- HTML test report generation
- Report artifact upload

The API regression suite has been successfully executed in GitHub Actions with all 14 tests passing.

[View GitHub Actions](https://github.com/luandradevirginiamelo/qa-playwright-portfolio/actions)

## Test Reports

Playwright generates HTML reports to provide visibility into automated test execution.

Test reports are also uploaded as GitHub Actions artifacts for reviewing CI results.

## Portfolio Website

Explore my QA Automation Portfolio:

[View Portfolio Website](https://luandradevirginiamelo.github.io/qa-playwright-portfolio/)

## Author

**Luanna Virginia**

Software QA Engineer | QA Automation Engineer

[GitHub Profile](https://github.com/luandradevirginiamelo)
