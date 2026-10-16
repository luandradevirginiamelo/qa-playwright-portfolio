import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { acceptConsentIfVisible } from '../../utils/consent';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { closeAdIfVisible } from '../../utils/ads';

test.describe('Products', () => {

  test('PROD-001 - Search for an existing product', async ({ page }) => {

    const productsPage = new ProductsPage(page);

    await page.goto('https://automationexercise.com/products');

    await acceptConsentIfVisible(page);

    await closeAdIfVisible(page);

    await productsPage.searchProduct('Dress');

    // Verify that the search results section is displayed.
    await expect(
      productsPage.searchedProductsHeading
    ).toBeVisible();

    // Get the names of all products returned by the search.
    const productNames =
      await productsPage.productNames.allTextContents();

    // Verify that the search returned at least one product.
    expect(productNames.length).toBeGreaterThan(0);

    // Verify that an expected product is included in the search results.
    expect(productNames).toContain('Stylish Dress');
  });

  test('PROD-002 - Search for a non-existing product', async ({ page }) => {

  const productsPage = new ProductsPage(page);

  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);

  await closeAdIfVisible(page);

  await productsPage.searchProduct('XYZPRODUCT999');

  // Verify that the search results section is displayed.
  await expect(
    productsPage.searchedProductsHeading
  ).toBeVisible();

  // Verify that no products are returned.
  await expect(
    productsPage.productNames
  ).toHaveCount(0);
});

test('PROD-003 - View product details', async ({ page }) => {

  const productDetailsPage = new ProductDetailsPage(page);

  await page.goto('https://automationexercise.com/product_details/3');

  await acceptConsentIfVisible(page);

  await closeAdIfVisible(page);

  // Verify product information.
  await expect(productDetailsPage.productName).toBeVisible();

  await expect(productDetailsPage.category).toBeVisible();

  await expect(productDetailsPage.price).toBeVisible();

  await expect(productDetailsPage.availability).toBeVisible();

  await expect(productDetailsPage.condition).toBeVisible();

  await expect(productDetailsPage.brand).toBeVisible();

  // Verify that the default quantity is 1.
  await expect(productDetailsPage.quantityInput).toHaveValue('1');

  // Verify that the product can be added to the cart.
  await expect(productDetailsPage.addToCartButton).toBeVisible();
});

const categoryScenarios = [
  {
    category: 'Women',
    subcategory: 'Dress'
  },
  {
    category: 'Men',
    subcategory: 'Tshirts'
  },
  {
    category: 'Kids',
    subcategory: 'Dress'
  }
];

for (const scenario of categoryScenarios) {

  test(`PROD-004 - View ${scenario.category} ${scenario.subcategory} products`, async ({ page }) => {

    const productsPage = new ProductsPage(page);

    await page.goto('https://automationexercise.com/products');

    await acceptConsentIfVisible(page);

    await closeAdIfVisible(page);

    await productsPage.openCategory(scenario.category);

    await productsPage.selectSubcategory(scenario.subcategory);

    await expect(
      productsPage.categoryHeading(
        scenario.category,
        scenario.subcategory
      )
    ).toBeVisible();
  });
}

test('PROD-005 - View products by brand', async ({ page }) => {

  const productsPage = new ProductsPage(page);

  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  await productsPage.selectBrand('Madame');

  // Verify that the selected brand page is displayed.
  await expect(
    productsPage.brandHeading('Madame')
  ).toBeVisible();

  // Verify that products are displayed for the selected brand.
  await expect(
    productsPage.productNames.first()
  ).toBeVisible();
});

test('PROD-006 - Add product to cart from Products page', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Add Blue Top (product ID 1) to the cart.
  await productsPage.addProductToCart('1');

  // Verify that the cart confirmation modal is displayed.
  const cartModal = productsPage.cartModal();

  await expect(cartModal).toBeVisible();

  await expect(
    cartModal.getByText('Your product has been added to cart.')
  ).toBeVisible();

  // Open the shopping cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

  // Locate Blue Top in the cart using its product ID.
  const cartProduct = page.locator('#product-1');

  // Verify that the correct product was added.
  await expect(cartProduct).toBeVisible();

  await expect(
    cartProduct.locator('.cart_description')
  ).toContainText('Blue Top');

  // Verify the product price.
  await expect(
    cartProduct.locator('.cart_price')
  ).toContainText('Rs. 500');

  // Verify the quantity.
  await expect(
    cartProduct.locator('.cart_quantity')
  ).toContainText('1');

  // Verify the calculated total.
  await expect(
    cartProduct.locator('.cart_total_price')
  ).toHaveText('Rs. 500');
});

test('PROD-007 - Add multiple quantity from Product Details', async ({ page }) => {
  const productDetailsPage = new ProductDetailsPage(page);

  // Open Sleeveless Dress product details.
  await page.goto('https://automationexercise.com/product_details/3');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Verify that the correct product details page is displayed.
  await expect(productDetailsPage.productName).toBeVisible();
  await expect(productDetailsPage.price).toHaveText('Rs. 1000');

  // Change the product quantity to 3.
  await productDetailsPage.quantityInput.fill('3');

  await expect(productDetailsPage.quantityInput).toHaveValue('3');

  // Add the product to the cart.
  await productDetailsPage.addToCartButton.click();

  // Verify the confirmation modal.
  const cartModal = page.locator('#cartModal');

  await expect(cartModal).toBeVisible();

  await expect(
    cartModal.getByText('Your product has been added to cart.')
  ).toBeVisible();

  // Open the shopping cart.
  await cartModal
    .getByRole('link', { name: 'View Cart' })
    .click();

  await closeAdIfVisible(page);

  // Product ID 3 = Sleeveless Dress.
  const cartProduct = page.locator('#product-3');

  await expect(cartProduct).toBeVisible();

  // Verify product name.
  await expect(
    cartProduct.locator('.cart_description')
  ).toContainText('Sleeveless Dress');

  // Verify unit price.
  await expect(
    cartProduct.locator('.cart_price')
  ).toContainText('Rs. 1000');

  // Verify quantity.
  await expect(
    cartProduct.locator('.cart_quantity')
  ).toContainText('3');

  // Verify total: Rs. 1000 × 3 = Rs. 3000.
  await expect(
    cartProduct.locator('.cart_total_price')
  ).toHaveText('Rs. 3000');
});

});