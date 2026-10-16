
import { Page, Locator } from '@playwright/test';

export class OrderConfirmationPage {
  readonly page: Page;
  readonly orderPlacedHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly continueButton: Locator;
  readonly downloadInvoiceButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.orderPlacedHeading = page.getByText(
      'Order Placed!',
      { exact: true }
    );

    this.confirmationMessage = page.getByText(
      'Congratulations! Your order has been confirmed!',
      { exact: true }
    );

    this.continueButton = page.locator(
      '[data-qa="continue-button"]'
    );

    this.downloadInvoiceButton = page.getByRole('link', {
  name: 'Download Invoice'
});

  }
}
