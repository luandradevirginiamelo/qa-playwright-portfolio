
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { createTestCustomer } from '../../utils/customerSetup';
import { closeAdIfVisible } from '../../utils/ads';
import { PaymentPage } from '../../pages/PaymentPage';

test.describe('Checkout', () => {

  test('CHECK-001 - Logged-in customer proceeds from cart to checkout', async ({ page }) => {
    test.setTimeout(120000);

    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Create and authenticate a new customer.
    await createTestCustomer(page);

    // Open the Products page.
    await page.goto(
      'https://automationexercise.com/products',
      { waitUntil: 'domcontentloaded' }
    );

    await closeAdIfVisible(page);

    // Add Blue Top to the cart.
    await productsPage.addProductToCart('1');

    await expect(
      productsPage.cartModal()
    ).toBeVisible();

    // Open the shopping cart.
    await productsPage.viewCart();

    await closeAdIfVisible(page);

    // Verify the product before checkout.
    await expect(
      cartPage.productRow('1')
    ).toBeVisible();

    // Proceed to checkout.
    await page.getByText(
      'Proceed To Checkout',
      { exact: true }
    ).click();

    // Verify navigation to the checkout page.
    await expect(page).toHaveURL(/\/checkout\/?$/);

    await closeAdIfVisible(page);

    // Verify checkout information is displayed.
    await expect(
      checkoutPage.deliveryAddress
    ).toBeVisible();

    await expect(
      checkoutPage.billingAddress
    ).toBeVisible();

    await expect(
      checkoutPage.orderReview
    ).toBeVisible();
  });

  
test('CHECK-002 - Validate delivery address against registered customer data', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Create and authenticate a new customer.
  await createTestCustomer(page);

  // Open the Products page.
  await page.goto(
    'https://automationexercise.com/products',
    { waitUntil: 'domcontentloaded' }
  );

  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(
    productsPage.cartModal()
  ).toBeVisible();

  // Open the shopping cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

  // Verify the product before checkout.
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

  // Verify delivery address is displayed.
  await expect(
    checkoutPage.deliveryAddress
  ).toBeVisible();

  // Validate registered customer details.
  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('Test User');

  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('1 Test Street');

  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('Toronto');

  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('Ontario');

  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('M5V2T6');

  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('Canada');

  await expect(
    checkoutPage.deliveryAddress
  ).toContainText('1234567890');
});


test('CHECK-003 - Validate billing address against registered customer data', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Create and authenticate a new customer.
  await createTestCustomer(page);

  // Open the Products page.
  await page.goto(
    'https://automationexercise.com/products',
    { waitUntil: 'domcontentloaded' }
  );

  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(
    productsPage.cartModal()
  ).toBeVisible();

  // Open the shopping cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

  // Verify the product before checkout.
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

  // Verify billing address is displayed.
  await expect(
    checkoutPage.billingAddress
  ).toBeVisible();

  // Validate billing address against registered data.
  await expect(
    checkoutPage.billingAddress
  ).toContainText('Test User');

  await expect(
    checkoutPage.billingAddress
  ).toContainText('1 Test Street');

  await expect(
    checkoutPage.billingAddress
  ).toContainText('Toronto');

  await expect(
    checkoutPage.billingAddress
  ).toContainText('Ontario');

  await expect(
    checkoutPage.billingAddress
  ).toContainText('M5V2T6');

  await expect(
    checkoutPage.billingAddress
  ).toContainText('Canada');

  await expect(
    checkoutPage.billingAddress
  ).toContainText('1234567890');
});


test('CHECK-004 - Validate product, quantity, price and total remain consistent in checkout', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Create and authenticate a new customer.
  await createTestCustomer(page);

  // Open the Products page.
  await page.goto(
    'https://automationexercise.com/products',
    { waitUntil: 'domcontentloaded' }
  );

  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(
    productsPage.cartModal()
  ).toBeVisible();

  // Open the shopping cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

  // Verify the product is present in the cart.
  await expect(
    cartPage.productRow('1')
  ).toBeVisible();

  // Capture actual cart values before checkout.
  const cartProductName = (
    await cartPage.productDescription('1').innerText()
  ).trim();

  const cartPrice = (
    await cartPage.productPrice('1').innerText()
  ).trim();

  const cartQuantity = (
    await cartPage.productQuantity('1').innerText()
  ).trim();

  const cartTotal = (
    await cartPage.productTotal('1').innerText()
  ).trim();

  // Validate cart total calculation.
  const numericPrice = Number(cartPrice.replace(/\D/g, ''));
  const numericQuantity = Number(cartQuantity);
  const numericTotal = Number(cartTotal.replace(/\D/g, ''));

  expect(numericTotal).toBe(
    numericPrice * numericQuantity
  );

  // Proceed to checkout.
  await page.getByText(
    'Proceed To Checkout',
    { exact: true }
  ).click();

  await expect(page).toHaveURL(/\/checkout\/?$/);

  await closeAdIfVisible(page);

  // Verify the same product exists in the checkout review.
  const checkoutProductRow = checkoutPage.orderReview.locator(
    '#product-1'
  );

  await expect(checkoutProductRow).toBeVisible();

  // Compare checkout values against the captured cart values.
  await expect(
    checkoutProductRow.locator('.cart_description')
  ).toContainText(cartProductName);

  await expect(
    checkoutProductRow.locator('.cart_price')
  ).toHaveText(cartPrice);

  await expect(
    checkoutProductRow.locator('.cart_quantity')
  ).toHaveText(cartQuantity);

  await expect(
    checkoutProductRow.locator('.cart_total_price')
  ).toHaveText(cartTotal);
});


test('CHECK-005 - Complete order with valid payment data', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

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

  // Open the cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

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

  // Verify order review before payment.
  await expect(
    checkoutPage.orderReview.locator('#product-1')
  ).toBeVisible();

  // Navigate to payment.
  await checkoutPage.placeOrderButton.click();

  await expect(page).toHaveURL(/\/payment\/?$/);

  await closeAdIfVisible(page);

  // Verify the payment form.
  await expect(
    paymentPage.nameOnCardInput
  ).toBeVisible();

  // Enter valid payment details.
  await paymentPage.enterPaymentDetails();

  // Submit the order.
  await paymentPage.submitPayment();

  // Verify successful order confirmation.
  await expect(
    paymentPage.orderSuccessMessage
  ).toBeVisible({
    timeout: 15000
  });
});


test('CHECK-006 - Prevent payment submission when card number is empty', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

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

  // Open the cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

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

  // Navigate to the payment page.
  await checkoutPage.placeOrderButton.click();

  await expect(page).toHaveURL(/\/payment\/?$/);

  await closeAdIfVisible(page);

  // Fill valid payment details except the card number.
  await paymentPage.nameOnCardInput.fill('Test User');
  await paymentPage.cardNumberInput.fill('');
  await paymentPage.cvcInput.fill('123');
  await paymentPage.expiryMonthInput.fill('12');
  await paymentPage.expiryYearInput.fill('2030');

  // Verify the required card number field is empty.
  await expect(
    paymentPage.cardNumberInput
  ).toBeEmpty();

  // Attempt to submit the payment.
  await paymentPage.submitPayment();

  // Verify the customer remains on the payment page.
  await expect(page).toHaveURL(/\/payment\/?$/);

  // Verify the required field is marked as invalid.
  await expect(
    paymentPage.cardNumberInput
  ).toHaveJSProperty('validity.valueMissing', true);
});


test('CHECK-007 - Validate behavior when card number contains letters', async ({ page }) => {
  test.setTimeout(120000);

  test.fail(
  true,
  'BUG-CHECK-007: Application accepts alphabetic card numbers.'
);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

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

  // Open the cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

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

  // Navigate to payment.
  await checkoutPage.placeOrderButton.click();

  await expect(page).toHaveURL(/\/payment\/?$/);

  await closeAdIfVisible(page);

  // Enter invalid card number and otherwise valid test data.
  await paymentPage.nameOnCardInput.fill('Test User');
  await paymentPage.cardNumberInput.fill('INVALIDCARDABC');
  await paymentPage.cvcInput.fill('123');
  await paymentPage.expiryMonthInput.fill('12');
  await paymentPage.expiryYearInput.fill('2030');

  // Check whether the application restricts non-numeric input.
  const enteredCardNumber =
    await paymentPage.cardNumberInput.inputValue();

  expect(enteredCardNumber).toBe('INVALIDCARDABC');

  // Capture the field's native validation state.
  const validationState =
    await paymentPage.cardNumberInput.evaluate((input) => {
      const field = input as HTMLInputElement;

      return {
        required: field.required,
        type: field.type,
        pattern: field.pattern,
        valid: field.validity.valid,
        patternMismatch: field.validity.patternMismatch
      };
    });

  console.log('Card number validation:', validationState);

  // Submit payment with an invalid card number.
await paymentPage.submitPayment();

// Invalid card data must not result in a confirmed order.
await expect(
  paymentPage.orderSuccessMessage,
  'DEFECT: The application confirmed an order with alphabetic characters in the card number.'
).not.toBeVisible();

  await expect(page).toHaveURL(/\/payment\/?$/);
});


test('CHECK-008 - Validate behavior when payment card is expired', async ({ page }) => {
  test.setTimeout(120000);

  test.fail(
  true,
  'BUG-CHECK-008: Application accepts expired payment cards.'
);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

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

  // Open the cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

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

  // Verify the order review before payment.
  await expect(
    checkoutPage.orderReview.locator('#product-1')
  ).toBeVisible();

  // Navigate to the payment page.
  await checkoutPage.placeOrderButton.click();

  await expect(page).toHaveURL(/\/payment\/?$/);

  await closeAdIfVisible(page);

  // Enter payment details with an expired card date.
  await paymentPage.nameOnCardInput.fill('Test User');
  await paymentPage.cardNumberInput.fill('4111111111111111');
  await paymentPage.cvcInput.fill('123');
  await paymentPage.expiryMonthInput.fill('01');
  await paymentPage.expiryYearInput.fill('2020');

  // Verify the expired date was entered correctly.
  await expect(
    paymentPage.expiryMonthInput
  ).toHaveValue('01');

  await expect(
    paymentPage.expiryYearInput
  ).toHaveValue('2020');

  // Submit payment with expired card details.
  await paymentPage.submitPayment();

  // An expired card must not result in a confirmed order.
  await expect(
    paymentPage.orderSuccessMessage,
    'DEFECT: The application confirmed an order using an expired card date (01/2020).'
  ).not.toBeVisible();
});


});
