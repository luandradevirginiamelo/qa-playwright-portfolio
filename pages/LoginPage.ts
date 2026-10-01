import { Page, Locator } from '@playwright/test';

export class LoginPage {

  // Playwright Page object representing the browser page.
  readonly page: Page;

  // Locators used on the Login page.
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locate the Login form.
    this.loginForm = page
      .locator('form')
      .filter({ hasText: 'Login' });

    // Locate the email field inside the Login form.
    this.emailInput =
      this.loginForm.getByPlaceholder('Email Address');

    // Locate the password field inside the Login form.
    this.passwordInput =
      this.loginForm.getByPlaceholder('Password');

    // Locate the Login button.
    this.loginButton =
      this.loginForm.getByRole('button', { name: 'Login' });

    // Locate the Login page heading.
    this.loginHeading =
      page.getByRole('heading', {
        name: 'Login to your account'
      });
  }

  /*
   * Perform login using the provided credentials.
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}