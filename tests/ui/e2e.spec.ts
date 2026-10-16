
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { OrderConfirmationPage } from '../../pages/OrderConfirmationPage';
import { createTestCustomer } from '../../utils/customerSetup';
import { closeAdIfVisible } from '../../utils/ads';

test.describe('End-to-End Customer Journey', () => {

  test('E2E-001 - Registered customer completes the full purchase journey', async ({ page }) => {
    test.setTimeout(120000);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);

    const productName = 'Blue Top';
    const productId = '1';

    // Register a new customer and start an authenticated session.
    const customer = await createTestCustomer(page);

    await expect(
      page.locator('header').getByText(`Logged in as ${customer.name}`)
    ).toBeVisible();

    // Open the product catalogue.
    await page.goto(
      'https://automationexercise.com/products',
      { waitUntil: 'domcontentloaded' }
    );

    await closeAdIfVisible(page);

    // Search for the product.
    await productsPage.searchProduct(productName);

    await expect(
      productsPage.searchedProductsHeading
    ).toBeVisible();

    await expect(
      productsPage.productNames
    ).toContainText([productName]);

    // Add the searched product to the cart.
    await productsPage.addProductToCart(productId);

    await expect(
      productsPage.cartModal()
    ).toBeVisible();

    // Navigate to the cart.
    await productsPage.viewCart();

    await closeAdIfVisible(page);

    // Validate the selected product in the cart.
    await expect(
      cartPage.productRow(productId)
    ).toBeVisible();

    await expect(
      cartPage.productDescription(productId)
    ).toContainText(productName);

    const cartPrice = (
      await cartPage.productPrice(productId).innerText()
    ).trim();

    const cartQuantity = (
      await cartPage.productQuantity(productId).innerText()
    ).trim();

    const cartTotal = (
      await cartPage.productTotal(productId).innerText()
    ).trim();

    // Validate the cart calculation.
    const numericPrice = Number(cartPrice.replace(/\D/g, ''));
    const numericQuantity = Number(cartQuantity);
    const numericTotal = Number(cartTotal.replace(/\D/g, ''));

    expect(numericTotal).toBe(numericPrice * numericQuantity);

    // Proceed to checkout.
    await page.getByText(
      'Proceed To Checkout',
      { exact: true }
    ).click();

    await expect(page).toHaveURL(/\/checkout\/?$/);

    await closeAdIfVisible(page);

    // Validate order details at checkout.
    const checkoutProductRow = checkoutPage.orderReview.locator(
      `#product-${productId}`
    );

    await expect(checkoutProductRow).toBeVisible();

    await expect(
      checkoutProductRow.locator('.cart_description')
    ).toContainText(productName);

    await expect(
      checkoutProductRow.locator('.cart_price')
    ).toHaveText(cartPrice);

    await expect(
      checkoutProductRow.locator('.cart_quantity')
    ).toHaveText(cartQuantity);

    await expect(
      checkoutProductRow.locator('.cart_total_price')
    ).toHaveText(cartTotal);

    // Navigate to payment.
    await checkoutPage.placeOrderButton.click();

    await expect(page).toHaveURL(/\/payment\/?$/);

    await closeAdIfVisible(page);

    // Complete payment using fictional test data.
    await paymentPage.enterPaymentDetails();
    await paymentPage.submitPayment();

    // Verify the order was placed successfully.
    await expect(
      orderConfirmationPage.orderPlacedHeading
    ).toBeVisible();

    await expect(
      orderConfirmationPage.confirmationMessage
    ).toBeVisible();
  });

});
