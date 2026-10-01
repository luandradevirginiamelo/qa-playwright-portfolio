import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {

  readonly page: Page;

  // Signup form locators.
  readonly nameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupHeading: Locator;

  // Account information locators.
  readonly genderFemaleRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;

  // Optional preferences.
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;

  // Address information locators.
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;

  readonly createAccountButton: Locator;
  readonly accountCreatedMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    const signupForm = page
      .locator('form')
      .filter({ hasText: 'Signup' });

    this.nameInput =
      signupForm.getByPlaceholder('Name');

    this.signupEmailInput =
      signupForm.getByPlaceholder('Email Address');

    this.signupButton =
      signupForm.getByRole('button', { name: 'Signup' });

    this.signupHeading =
      page.getByRole('heading', { name: 'New User Signup!' });

    this.genderFemaleRadio =
      page.locator('#id_gender2');

    this.passwordInput =
      page.locator('#password');

    this.daysSelect =
      page.locator('#days');

    this.monthsSelect =
      page.locator('#months');

    this.yearsSelect =
      page.locator('#years');

    this.newsletterCheckbox =
      page.locator('#newsletter');

    this.offersCheckbox =
      page.locator('#optin');

    this.firstNameInput =
      page.locator('#first_name');

    this.lastNameInput =
      page.locator('#last_name');

    this.companyInput =
      page.locator('#company');

    this.addressInput =
      page.locator('#address1');

    this.countrySelect =
      page.locator('#country');

    this.stateInput =
      page.locator('#state');

    this.cityInput =
      page.locator('#city');

    this.zipcodeInput =
      page.locator('#zipcode');

    this.mobileNumberInput =
      page.locator('#mobile_number');

    this.createAccountButton =
      page.getByRole('button', { name: 'Create Account' });

    this.accountCreatedMessage =
      page.getByText('Account Created!', { exact: true });
  }

  async startSignup(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async completeRegistration(password: string) {
    await this.genderFemaleRadio.check();

    await this.passwordInput.fill(password);

    await this.daysSelect.selectOption('10');
    await this.monthsSelect.selectOption('5');
    await this.yearsSelect.selectOption('1990');

    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    await this.addressInput.fill('1 Test Street');
    await this.countrySelect.selectOption('Canada');
    await this.stateInput.fill('Ontario');
    await this.cityInput.fill('Toronto');
    await this.zipcodeInput.fill('M5V2T6');
    await this.mobileNumberInput.fill('1234567890');

    await this.createAccountButton.click();

    await expect(
      this.accountCreatedMessage
    ).toBeVisible();
  }
}