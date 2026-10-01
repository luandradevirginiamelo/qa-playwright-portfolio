import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { acceptConsentIfVisible } from '../../utils/consent';

test.describe('Authentication', () => {

  test.describe.configure({
    timeout: 60_000
  });

/*
 * AUTH-001
 * Register a new user successfully
 */
test('AUTH-001 - Register a new user successfully', async ({ page }) => {

  const signupPage = new SignupPage(page);

  const name = 'Test User';
  const email =
    `luanna.test.${Date.now()}@example.com`;

  const password = 'TestPassword123!';

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Verify that the Signup section is displayed.
  await expect(
    signupPage.signupHeading
  ).toBeVisible();

  /*
   * START SIGNUP
   */

  await signupPage.startSignup(
    name,
    email
  );

  // Verify that the Account Information section is displayed.
  await expect(
    page.getByText('Enter Account Information', { exact: true })
  ).toBeVisible();

  /*
   * Verify that name and email were automatically populated.
   */

  await expect(
    page.locator('#name')
  ).toHaveValue(name);

  await expect(
    page.locator('#email')
  ).toHaveValue(email);

  /*
   * ACCOUNT INFORMATION
   */

  await signupPage.genderFemaleRadio.check();

  await signupPage.passwordInput.fill(password);

  await signupPage.daysSelect.selectOption('10');
  await signupPage.monthsSelect.selectOption('5');
  await signupPage.yearsSelect.selectOption('1990');

  // Select optional preferences.
  await signupPage.newsletterCheckbox.check();
  await signupPage.offersCheckbox.check();

  /*
   * ADDRESS INFORMATION
   */

  await signupPage.firstNameInput.fill('Test');
  await signupPage.lastNameInput.fill('User');
  await signupPage.companyInput.fill('QA Automation Test');
  await signupPage.addressInput.fill('1 Test Street');

  await signupPage.countrySelect.selectOption('Canada');

  await signupPage.stateInput.fill('Ontario');
  await signupPage.cityInput.fill('Toronto');
  await signupPage.zipcodeInput.fill('M5V2T6');
  await signupPage.mobileNumberInput.fill('1234567890');

  /*
   * CREATE ACCOUNT
   */

  await signupPage.createAccountButton.click();

  /*
   * ASSERTION
   */

  await expect(
    signupPage.accountCreatedMessage
  ).toBeVisible();

});

  /*
 * AUTH-002
 * Register with an already existing email
 */
test('AUTH-002 - Register with an already existing email', async ({ page }) => {

  const signupPage = new SignupPage(page);

  // Generate a unique email for this test.
  const existingEmail =
    `existing.user.${Date.now()}@example.com`;

  const password = 'TestPassword123!';

  /*
   * TEST SETUP
   *
   * Create a user account first so that the email
   * already exists in the application.
   */

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  await expect(
    signupPage.signupHeading
  ).toBeVisible();

  // Create the account.
  await signupPage.startSignup(
    'Existing User',
    existingEmail
  );

  await signupPage.completeRegistration(password);

  // Continue after account creation.
  await page
    .getByRole('link', { name: 'Continue' })
    .click();

  // Verify that the user is authenticated.
  await expect(
    page.getByText('Logged in as Existing User')
  ).toBeVisible();

  // Logout.
  await page
    .getByRole('link', { name: 'Logout' })
    .click();

  /*
   * ACTUAL TEST
   *
   * Attempt to register another account
   * using the same email address.
   */

  await expect(
    signupPage.signupHeading
  ).toBeVisible();

  await signupPage.startSignup(
    'Another User',
    existingEmail
  );

  /*
   * ASSERTION
   *
   * Verify that registration is rejected
   * because the email already exists.
   */

  await expect(
    page.getByText(
      'Email Address already exist!',
      { exact: true }
    )
  ).toBeVisible();

});

/*
 * AUTH-003
 * Login with an unregistered email
 */
test('AUTH-003 - Login with an unregistered email', async ({ page }) => {

  // Create the Login Page Object.
  const loginPage = new LoginPage(page);

  // Generate a unique email address.
  // This email has never been registered in the application.
  const unregisteredEmail =
    `unregistered.user.${Date.now()}@example.com`;

  const password = 'TestPassword123!';

  // Navigate to the application.
  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  // Open the Signup / Login page.
  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Verify that the Login section is displayed.
  await expect(loginPage.loginHeading).toBeVisible();

  /*
   * ACTUAL TEST
   *
   * Attempt to login using an unregistered email.
   */

  await loginPage.login(
    unregisteredEmail,
    password
  );

  /*
   * ASSERTION
   *
   * Verify that authentication is rejected.
   */

  await expect(
    page.getByText(
      'Your email or password is incorrect!',
      { exact: true }
    )
  ).toBeVisible();

});

/*
 * AUTH-004
 * Login with a valid email and invalid password
 */
test('AUTH-004 - Login with a valid email and invalid password', async ({ page }) => {

  // Create the Page Objects used by this test.
  const signupPage = new SignupPage(page);
  const loginPage = new LoginPage(page);

  // Generate a unique email for this test.
  const registeredEmail =
    `valid.user.${Date.now()}@example.com`;

  const correctPassword = 'TestPassword123!';
  const invalidPassword = 'WrongPassword123!';

  /*
   * TEST SETUP
   *
   * Create a valid user account first.
   * This guarantees that the email exists before
   * testing the invalid password scenario.
   */

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Create the account using the Signup Page Object.
  await signupPage.startSignup(
    'Valid User',
    registeredEmail
  );

  await signupPage.completeRegistration(
    correctPassword
  );

  // Continue to the application after account creation.
  await page
    .getByRole('link', { name: 'Continue' })
    .click();

  // Verify that the newly created user is authenticated.
  await expect(
    page.getByText('Logged in as Valid User')
  ).toBeVisible();

  // Logout before testing the invalid password.
  await page
    .getByRole('link', { name: 'Logout' })
    .click();

  /*
   * ACTUAL TEST
   *
   * Attempt to login using:
   * - a registered email
   * - an incorrect password
   */

  await loginPage.login(
    registeredEmail,
    invalidPassword
  );

  /*
   * ASSERTION
   *
   * Verify that authentication is rejected.
   */

  await expect(
    page.getByText(
      'Your email or password is incorrect!',
      { exact: true }
    )
  ).toBeVisible();

});

/*
 * AUTH-005
 * Login with an empty email
 */
test('AUTH-005 - Login with an empty email', async ({ page }) => {

  const loginPage = new LoginPage(page);

  const password = 'TestPassword123!';

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Verify that the Login section is displayed.
  await expect(loginPage.loginHeading).toBeVisible();

  /*
   * TEST
   *
   * Leave the email field empty and enter only the password.
   */

  await loginPage.passwordInput.fill(password);

  // Verify that the email field is empty.
  await expect(loginPage.emailInput).toHaveValue('');

  // Attempt to login without entering an email.
  await loginPage.loginButton.click();

  /*
   * ASSERTION
   *
   * Verify that the email field is required.
   */

  await expect(
    loginPage.emailInput
  ).toHaveAttribute('required', '');

});

/*
 * AUTH-006
 * Login with an empty password
 */
test('AUTH-006 - Login with an empty password', async ({ page }) => {

  const loginPage = new LoginPage(page);

  const email = 'test.user@example.com';

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Verify that the Login section is displayed.
  await expect(loginPage.loginHeading).toBeVisible();

  /*
   * TEST
   *
   * Enter an email address and leave the password field empty.
   */

  await loginPage.emailInput.fill(email);

  // Verify that the password field is empty.
  await expect(loginPage.passwordInput).toHaveValue('');

  // Attempt to login without entering a password.
  await loginPage.loginButton.click();

  /*
   * ASSERTION
   *
   * Verify that the password field is required.
   */

  await expect(
    loginPage.passwordInput
  ).toHaveAttribute('required', '');

});

/*
 * AUTH-007
 * Login with both fields empty
 */
test('AUTH-007 - Login with both fields empty', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Verify that the Login section is displayed.
  await expect(loginPage.loginHeading).toBeVisible();

  /*
   * TEST
   *
   * Leave both email and password fields empty.
   */

  await expect(loginPage.emailInput).toHaveValue('');
  await expect(loginPage.passwordInput).toHaveValue('');

  // Attempt to login without entering any credentials.
  await loginPage.loginButton.click();

  /*
   * ASSERTIONS
   *
   * Verify that both fields are required.
   */

  await expect(
    loginPage.emailInput
  ).toHaveAttribute('required', '');

  await expect(
    loginPage.passwordInput
  ).toHaveAttribute('required', '');

});

/*
 * AUTH-008
 * Login with valid credentials
 */
test('AUTH-008 - Login with valid credentials', async ({ page }) => {

  // Create the Page Objects used by this test.
  const signupPage = new SignupPage(page);
  const loginPage = new LoginPage(page);

  // Generate unique credentials for this test execution.
  const registeredEmail =
    `login.user.${Date.now()}@example.com`;

  const password = 'TestPassword123!';


  /*
   * TEST SETUP
   *
   * Create a valid user account before testing login.
   */

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  // Use the Signup Page Object instead of repeating
  // the signup locators inside the test.
  await signupPage.startSignup(
    'Login User',
    registeredEmail
  );

  // Complete the registration using the reusable
  // method from SignupPage.
  await signupPage.completeRegistration(password);

  await page
    .getByRole('link', { name: 'Continue' })
    .click();

  // Verify that account creation resulted in authentication.
  await expect(
    page.getByText('Logged in as Login User')
  ).toBeVisible();

  // Logout before testing the actual login scenario.
  await page
    .getByRole('link', { name: 'Logout' })
    .click();


  /*
   * ACTUAL TEST
   *
   * Login using the valid credentials created above.
   */

  await loginPage.login(
    registeredEmail,
    password
  );


  /*
   * ASSERTION
   *
   * Verify that authentication was successful.
   */

  await expect(
    page.getByText('Logged in as Login User')
  ).toBeVisible();

});

/*
 * AUTH-009
 * Logout after successful login
 */
test('AUTH-009 - Logout after successful login', async ({ page }) => {

  const signupPage = new SignupPage(page);
  const loginPage = new LoginPage(page);

  // Generate a unique email for this test.
  const registeredEmail =
    `logout.user.${Date.now()}@example.com`;

  const password = 'TestPassword123!';

  /*
   * TEST SETUP
   *
   * Create a valid user account.
   */

  await page.goto('https://automationexercise.com/');

  await acceptConsentIfVisible(page);

  await page
    .getByRole('link', { name: 'Signup / Login' })
    .click();

  await signupPage.startSignup(
    'Logout User',
    registeredEmail
  );

  await signupPage.completeRegistration(password);

  await page
    .getByRole('link', { name: 'Continue' })
    .click();

  // Verify that the user is authenticated.
  await expect(
    page.getByText('Logged in as Logout User')
  ).toBeVisible();

  /*
   * ACTUAL TEST
   *
   * Logout from the application.
   */

  await page
    .getByRole('link', { name: 'Logout' })
    .click();

  /*
   * ASSERTIONS
   *
   * Verify that the user is redirected to the Login page
   * and is no longer authenticated.
   */

  await expect(
    loginPage.loginHeading
  ).toBeVisible();

  await expect(
    page.getByText('Logged in as Logout User')
  ).not.toBeVisible();

});

});