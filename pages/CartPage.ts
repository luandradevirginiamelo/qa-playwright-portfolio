import { Page, Locator } from '@playwright/test';
import { acceptConsentIfVisible } from '../utils/consent';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  productRow(productId: string): Locator {
    return this.page.locator(`#product-${productId}`);
  }

  productDescription(productId: string): Locator {
    return this.productRow(productId).locator('.cart_description');
  }

  productPrice(productId: string): Locator {
    return this.productRow(productId).locator('.cart_price');
  }

  productQuantity(productId: string): Locator {
    return this.productRow(productId).locator('.cart_quantity');
  }

  productTotal(productId: string): Locator {
    return this.productRow(productId).locator('.cart_total_price');
  }

  

async removeProduct(productId: string): Promise<void> {
  // Handle consent before interacting with the cart.
  await acceptConsentIfVisible(this.page);

  await this.productRow(productId)
    .locator('.cart_quantity_delete')
    .click();
}


emptyCartMessage(): Locator {
  return this.page.locator('#empty_cart');
}


async returnToShopping() {
  await this.emptyCartMessage()
    .getByRole('link', { name: 'here' })
    .click();
}

}