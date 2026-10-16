import { Page, Locator } from '@playwright/test';

export class ProductsPage {

  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;

    // Search field used to find products.
    this.searchInput = page.getByPlaceholder('Search Product');

    // Search button represented by the magnifying glass icon.
    this.searchButton = page.locator('#submit_search');

    // Heading displayed after a product search.
    this.searchedProductsHeading = page.getByRole('heading', {
      name: 'Searched Products'
    });

    // Names of all products displayed in the search results.
    this.productNames = page.locator('.productinfo p');
  }

  /*
   * Search for a product using the provided term.
   */
  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  /*
   * Open a main product category.
   */
  async openCategory(category: string) {
    await this.page
      .locator(`#accordian a[href="#${category}"]`)
      .click();
  }

  /*
   * Select a product subcategory.
   */
  async selectSubcategory(subcategory: string) {
    await this.page
      .locator('#accordian')
      .getByRole('link', {
        name: subcategory,
        exact: true
      })
      .click();
  }

  /*
   * Get the heading displayed for the selected category.
   */
  categoryHeading(category: string, subcategory: string) {
    return this.page.getByRole('heading', {
      name: `${category} - ${subcategory} Products`
    });
  }

  /*
   * Select a product brand.
   */
  async selectBrand(brand: string) {
    await this.page
      .locator('.brands_products')
      .getByRole('link', {
        name: new RegExp(brand, 'i')
      })
      .click();
  }

  /*
   * Get the heading displayed for the selected brand.
   */
  brandHeading(brand: string) {
    return this.page.getByRole('heading', {
      name: `Brand - ${brand} Products`
    });
  }

/*
 * Add a product to the cart using its product ID.
 */
async addProductToCart(productId: string) {
  await this.page
    .locator(`.productinfo a.add-to-cart[data-product-id="${productId}"]`)
    .click();
}

/*
 * Get the confirmation modal displayed after adding a product.
 */
cartModal() {
  return this.page.locator('#cartModal');
}

/*
 * Open the shopping cart from the confirmation modal.
 */
async viewCart() {
  await this.page
    .locator('#cartModal')
    .getByRole('link', { name: 'View Cart' })
    .click();
}
}