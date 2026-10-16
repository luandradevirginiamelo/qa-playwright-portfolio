
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { OrderConfirmationPage } from '../../pages/OrderConfirmationPage';
import { createTestCustomer } from '../../utils/customerSetup';
import { closeAdIfVisible } from '../../utils/ads';

test.describe('Order Confirmation', () => {

  test('ORDER-001 - Validate order confirmation and return to application', async ({ page }) => {
    test.setTimeout(120000);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);

    // Create and authenticate a new customer.
    await createTestCustomer(page);

    // Open the Products page.
    await page.goto(
      'https://automationexercise.com/products',
      { waitUntil: 'domcontentloaded' }
    );

    await closeAdIfVisible(page);

    // Add a product to the cart.
    await productsPage.addProductToCart('1');

    await expect(
      productsPage.cartModal()
    ).toBeVisible();

    // Open the shopping cart.
    await productsPage.viewCart();

    await closeAdIfVisible(page);

    // Verify the product is present before checkout.
    await expect(
      cartPage.productRow('1')
    ).toBeVisible();

    // Proceed to checkout.
    await page.getByText(
      'Proceed To Checkout',
      { exact: true }
    ).click();

    await expect(page).toHaveURL(/\/checkout\/?$/);

    await closeAdIfVisible(page);

    // Verify the product in the order review.
    await expect(
      checkoutPage.orderReview.locator('#product-1')
    ).toBeVisible();

    // Navigate to payment.
    await checkoutPage.placeOrderButton.click();

    await closeAdIfVisible(page);

    await expect(page).toHaveURL(/\/payment\/?$/);  

    // Complete payment using test data.
    await paymentPage.enterPaymentDetails();
    await paymentPage.submitPayment();

    // Verify successful order confirmation.
    await expect(
      orderConfirmationPage.orderPlacedHeading
    ).toBeVisible();

    await expect(
      orderConfirmationPage.confirmationMessage
    ).toBeVisible();

    // Return to the application.
    await orderConfirmationPage.continueButton.click();

    await expect(page).toHaveURL(
      'https://automationexercise.com/'
    );

    // Verify the customer remains authenticated.
    await expect(
      page.locator('header').getByText('Logged in as Test User')
    ).toBeVisible();
  });

  

test('ORDER-002 - Download and validate invoice after purchase', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);

  // Create and authenticate a new customer.
  await createTestCustomer(page);

  // Open the Products page.
  await page.goto(
    'https://automationexercise.com/products',
    { waitUntil: 'domcontentloaded' }
  );

  await closeAdIfVisible(page);

  // Add a product to the cart.
  await productsPage.addProductToCart('1');

  await expect(productsPage.cartModal()).toBeVisible();

  // Open the shopping cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

  await expect(cartPage.productRow('1')).toBeVisible();

  // Proceed to checkout.
  await page.getByText(
    'Proceed To Checkout',
    { exact: true }
  ).click();

  await expect(page).toHaveURL(/\/checkout\/?$/);

  await closeAdIfVisible(page);

  // Verify the product in the order review.
  await expect(
    checkoutPage.orderReview.locator('#product-1')
  ).toBeVisible();

  // Navigate to payment.
  await checkoutPage.placeOrderButton.click();

  await expect(page).toHaveURL(/\/payment\/?$/);

  await closeAdIfVisible(page);

  // Complete payment.
  await paymentPage.enterPaymentDetails();
  await paymentPage.submitPayment();

  // Verify successful order confirmation.
  await expect(
    orderConfirmationPage.orderPlacedHeading
  ).toBeVisible();

  // Wait for the invoice download.
  const downloadPromise = page.waitForEvent('download');

  await orderConfirmationPage.downloadInvoiceButton.click();

  const download = await downloadPromise;

  // Verify the download completed successfully.
  expect(await download.failure()).toBeNull();

  // Verify the downloaded filename.
  expect(download.suggestedFilename()).toMatch(
    /invoice/i
  );

  // Read the downloaded invoice.
  const filePath = await download.path();

  expect(filePath).not.toBeNull();

  const fs = await import('node:fs/promises');

  const fileContent = await fs.readFile(
    filePath!,
    'utf-8'
  );

  // Verify the invoice is not empty.
  expect(fileContent.trim().length).toBeGreaterThan(0);

  // Verify the invoice contains expected customer information.
  expect(fileContent).toContain('Test User');
});



});
