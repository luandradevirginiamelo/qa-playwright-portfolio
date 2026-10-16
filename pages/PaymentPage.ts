
import { Page, Locator } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;

  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly orderSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameOnCardInput = page.locator(
      '[data-qa="name-on-card"]'
    );

    this.cardNumberInput = page.locator(
      '[data-qa="card-number"]'
    );

    this.cvcInput = page.locator(
      '[data-qa="cvc"]'
    );

    this.expiryMonthInput = page.locator(
      '[data-qa="expiry-month"]'
    );

    this.expiryYearInput = page.locator(
      '[data-qa="expiry-year"]'
    );

    this.payButton = page.locator(
      '[data-qa="pay-button"]'
    );

    this.orderSuccessMessage = page.getByText(
      'Congratulations! Your order has been confirmed!',
      { exact: true }
    );
  }

  async enterPaymentDetails() {
    await this.nameOnCardInput.fill('Test User');
    await this.cardNumberInput.fill('4111111111111111');
    await this.cvcInput.fill('123');
    await this.expiryMonthInput.fill('12');
    await this.expiryYearInput.fill('2030');
  }

  async submitPayment() {
    await this.payButton.click();
  }
}
