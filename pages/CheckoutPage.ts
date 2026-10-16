
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderReview: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.deliveryAddress = page.locator(
      '#address_delivery'
    );

    this.billingAddress = page.locator(
      '#address_invoice'
    );

    this.orderReview = page.locator(
      '#cart_info'
    );

    this.placeOrderButton = page.getByRole(
      'link',
      { name: 'Place Order' }
    );
  }
}
