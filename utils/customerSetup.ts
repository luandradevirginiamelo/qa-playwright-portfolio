
import { Page, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { acceptConsentIfVisible } from './consent';
import { closeAdIfVisible } from './ads';

export interface TestCustomer {
  name: string;
  email: string;
  password: string;
}

export async function createTestCustomer(
  page: Page
): Promise<TestCustomer> {
  const signupPage = new SignupPage(page);

  const customer: TestCustomer = {
    name: 'Test User',
    email: `checkout.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@example.com`,
    password: 'TestPassword123!'
  };

  // Open the registration page.
  await page.goto(
    'https://automationexercise.com/login',
    { waitUntil: 'domcontentloaded' }
  );

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Complete the initial signup form.
  await expect(signupPage.signupHeading).toBeVisible();

  await signupPage.startSignup(
    customer.name,
    customer.email
  );

  // Verify the account information form.
  await expect(
    page.getByText('Enter Account Information', {
      exact: true
    })
  ).toBeVisible();

  // Complete registration using the existing Page Object.
  await signupPage.completeRegistration(
    customer.password
  );

  // Continue to the authenticated session.
  await page.getByRole('link', {
    name: 'Continue'
  }).click();

  await closeAdIfVisible(page);

// Verify the customer is logged in.
await expect(
  page.locator('header').getByText(
    `Logged in as ${customer.name}`
  )
).toBeVisible();

  return customer;
}
