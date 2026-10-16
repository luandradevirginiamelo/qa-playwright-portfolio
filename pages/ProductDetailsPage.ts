import { Page, Locator } from '@playwright/test';

export class ProductDetailsPage {

  readonly page: Page;
  readonly productName: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly brand: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product information section.
    const productInformation = page.locator('.product-information');

    // Product details.
    this.productName = productInformation.getByRole('heading', {
      name: 'Sleeveless Dress'
    });

    this.category = productInformation.getByText(
      'Category: Women > Dress'
    );

    this.price = productInformation.getByText('Rs. 1000');

    this.quantityInput = productInformation.locator('#quantity');

    this.addToCartButton = productInformation.getByRole('button', {
      name: 'Add to cart'
    });

    this.availability = productInformation.getByText(
      'Availability: In Stock'
    );

    this.condition = productInformation.getByText(
      'Condition: New'
    );

    this.brand = productInformation.getByText(
      'Brand: Madame'
    );
  }
}