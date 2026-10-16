
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { CartPage } from '../../pages/CartPage';
import { acceptConsentIfVisible } from '../../utils/consent';
import { closeAdIfVisible } from '../../utils/ads';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';

test.describe('Shopping Cart', () => {

  test('CART-001 - Add one product and validate cart details', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Open the Products page.
    await page.goto('https://automationexercise.com/products');

    await acceptConsentIfVisible(page);
    await closeAdIfVisible(page);

    // Add Blue Top (product ID 1) to the cart.
    await productsPage.addProductToCart('1');

    // Verify the confirmation modal.
    await expect(productsPage.cartModal()).toBeVisible();

    // Navigate to the cart.
    await productsPage.viewCart();
    await closeAdIfVisible(page);

    // Verify the correct product.
    await expect(cartPage.productRow('1')).toBeVisible();

    await expect(
      cartPage.productDescription('1')
    ).toContainText('Blue Top');

    // Verify the unit price.
    await expect(
      cartPage.productPrice('1')
    ).toContainText('Rs. 500');

    // Verify the quantity.
    await expect(
      cartPage.productQuantity('1')
    ).toContainText('1');

    // Verify the total.
    await expect(
      cartPage.productTotal('1')
    ).toHaveText('Rs. 500');
  });

  
test('CART-002 - Add two different products and validate both', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(productsPage.cartModal()).toBeVisible();

  // Continue shopping.
  await productsPage.cartModal()
    .getByRole('button', { name: 'Continue Shopping' })
    .click();

  // Add Men Tshirt to the cart.
  await productsPage.addProductToCart('2');

  await expect(productsPage.cartModal()).toBeVisible();

  // Open the shopping cart.
  await productsPage.viewCart();
  await closeAdIfVisible(page);

  // Verify that both products are present.
  await expect(cartPage.productRow('1')).toBeVisible();
  await expect(cartPage.productRow('2')).toBeVisible();

  // Verify Blue Top.
  await expect(
    cartPage.productDescription('1')
  ).toContainText('Blue Top');

  await expect(
    cartPage.productPrice('1')
  ).toContainText('Rs. 500');

  await expect(
    cartPage.productQuantity('1')
  ).toContainText('1');

  await expect(
    cartPage.productTotal('1')
  ).toHaveText('Rs. 500');

  // Verify Men Tshirt.
  await expect(
    cartPage.productDescription('2')
  ).toContainText('Men Tshirt');

  await expect(
    cartPage.productPrice('2')
  ).toContainText('Rs. 400');

  await expect(
    cartPage.productQuantity('2')
  ).toContainText('1');

  await expect(
    cartPage.productTotal('2')
  ).toHaveText('Rs. 400');

  // Verify that the cart contains exactly two products.
  await expect(
    page.locator('#cart_info_table tbody tr')
  ).toHaveCount(2);
});


test('CART-003 - Validate total equals price multiplied by quantity', async ({ page }) => {
  const cartPage = new CartPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  // Open Sleeveless Dress product details.
  await page.goto('https://automationexercise.com/product_details/3');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Set the quantity to 3.
  await productDetailsPage.quantityInput.fill('3');

  // Add the product to the cart.
  await productDetailsPage.addToCartButton.click();

  const cartModal = page.locator('#cartModal');

  await expect(cartModal).toBeVisible();

  // Navigate to the shopping cart.
  await cartModal
    .getByRole('link', { name: 'View Cart' })
    .click();

  await closeAdIfVisible(page);

  // Verify the product is displayed.
  await expect(cartPage.productRow('3')).toBeVisible();

  // Extract the displayed unit price.
  const priceText = await cartPage.productPrice('3').innerText();
  const unitPrice = Number(priceText.replace(/\D/g, ''));

  // Extract the displayed quantity.
  const quantityText = await cartPage.productQuantity('3').innerText();
  const quantity = Number(quantityText.trim());

  // Calculate the expected total.
  const expectedTotal = unitPrice * quantity;

  // Extract the displayed total.
  const totalText = await cartPage.productTotal('3').innerText();
  const actualTotal = Number(totalText.replace(/\D/g, ''));

  // Verify the expected quantity and price.
  expect(unitPrice).toBe(1000);
  expect(quantity).toBe(3);

  // Validate the business calculation.
  expect(actualTotal).toBe(expectedTotal);
});


test('CART-004 - Remove a product from cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Open the Products page.
  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(productsPage.cartModal()).toBeVisible();

  // Navigate to the shopping cart.
  await productsPage.viewCart();
  await closeAdIfVisible(page);

  // Verify the product is present before removal.
  await expect(cartPage.productRow('1')).toBeVisible();

  await expect(
    cartPage.productDescription('1')
  ).toContainText('Blue Top');

  // Remove the product.
  await cartPage.removeProduct('1');

  // Verify the product is no longer in the cart.
  await expect(cartPage.productRow('1')).toHaveCount(0);
});


test('CART-005 - Remove one product while another remains', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Open the Products page.
  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(productsPage.cartModal()).toBeVisible();

  // Continue shopping.
  await productsPage.cartModal()
    .getByRole('button', { name: 'Continue Shopping' })
    .click();

  // Add Men Tshirt to the cart.
  await productsPage.addProductToCart('2');

  await expect(productsPage.cartModal()).toBeVisible();

  // Navigate to the shopping cart.
  await productsPage.viewCart();
  await closeAdIfVisible(page);

  // Verify both products are present.
  await expect(cartPage.productRow('1')).toBeVisible();
  await expect(cartPage.productRow('2')).toBeVisible();

  // Remove Blue Top.
  await cartPage.removeProduct('1');

  // Verify Blue Top was removed.
  await expect(cartPage.productRow('1')).toHaveCount(0);

  // Verify Men Tshirt remains in the cart.
  await expect(cartPage.productRow('2')).toBeVisible();

  await expect(
    cartPage.productDescription('2')
  ).toContainText('Men Tshirt');

  // Verify the remaining product details.
  await expect(
    cartPage.productPrice('2')
  ).toContainText('Rs. 400');

  await expect(
    cartPage.productQuantity('2')
  ).toContainText('1');

  await expect(
    cartPage.productTotal('2')
  ).toHaveText('Rs. 400');

  // Verify exactly one product remains.
  await expect(
    page.locator('#cart_info_table tbody tr')
  ).toHaveCount(1);
});


test('CART-006 - Remove all products and validate empty cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Open the Products page.
  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Add Blue Top.
  await productsPage.addProductToCart('1');

  await expect(productsPage.cartModal()).toBeVisible();

  // Continue shopping.
  await productsPage.cartModal()
    .getByRole('button', { name: 'Continue Shopping' })
    .click();

  // Add Men Tshirt.
  await productsPage.addProductToCart('2');

  await expect(productsPage.cartModal()).toBeVisible();

  // Navigate to the shopping cart.
  await productsPage.viewCart();
  await closeAdIfVisible(page);

  // Verify both products are present.
  await expect(cartPage.productRow('1')).toBeVisible();
  await expect(cartPage.productRow('2')).toBeVisible();

  // Remove the first product.
  await cartPage.removeProduct('1');

  await expect(cartPage.productRow('1')).toHaveCount(0);

  // Remove the second product.
  await cartPage.removeProduct('2');

  await expect(cartPage.productRow('2')).toHaveCount(0);

  // Verify the empty cart state.
  await expect(cartPage.emptyCartMessage()).toBeVisible();

  await expect(
    cartPage.emptyCartMessage()
  ).toContainText('Cart is empty!');
});


test('CART-007 - Return to shopping from empty cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Open the Products page.
  await page.goto('https://automationexercise.com/products');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(productsPage.cartModal()).toBeVisible();

  // Navigate to the shopping cart.
  await productsPage.viewCart();
  await closeAdIfVisible(page);

  // Verify the product is present.
  await expect(cartPage.productRow('1')).toBeVisible();

  // Remove the product.
  await cartPage.removeProduct('1');

  // Verify the cart is empty.
  await expect(cartPage.productRow('1')).toHaveCount(0);

  await expect(cartPage.emptyCartMessage()).toBeVisible();

  // Return to shopping using the "here" link.
  await acceptConsentIfVisible(page);
  await cartPage.returnToShopping();

  await closeAdIfVisible(page);

  // Verify navigation to the Products page.
  await expect(page).toHaveURL(/\/products\/?$/);

  // Verify the product search field is available.
  await expect(productsPage.searchInput).toBeVisible();
});




test('CART-008 - Preserve cart after customer login', async ({ page }) => {
  test.setTimeout(120000);

  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const loginPage = new LoginPage(page);

  const email = `cart.test.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@example.com`;
  const password = 'Test@12345';
  const name = 'Cart Test User';

  // STEP 1: Create a new test account.
  await page.goto('https://automationexercise.com/login');

  await acceptConsentIfVisible(page);
  await closeAdIfVisible(page);

  // Complete the initial signup form.
  await page.locator('[data-qa="signup-name"]').fill(name);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.locator('[data-qa="signup-button"]').click();

  // Verify the account information form.
  await expect(
    page.getByText('Enter Account Information', { exact: true })
  ).toBeVisible();

  // Complete the registration details.
  await page.locator('#id_gender2').check();

  await page.locator('[data-qa="password"]').fill(password);

  await page.locator('[data-qa="days"]').selectOption('10');
  await page.locator('[data-qa="months"]').selectOption('5');
  await page.locator('[data-qa="years"]').selectOption('1995');

  await page.locator('[data-qa="first_name"]').fill('Cart');
  await page.locator('[data-qa="last_name"]').fill('Tester');
  await page.locator('[data-qa="address"]').fill('123 Test Street');
  await page.locator('[data-qa="country"]').selectOption('Canada');
  await page.locator('[data-qa="state"]').fill('Ontario');
  await page.locator('[data-qa="city"]').fill('Toronto');
  await page.locator('[data-qa="zipcode"]').fill('12345');
  await page.locator('[data-qa="mobile_number"]').fill('1234567890');

  // Submit the registration form.
  await acceptConsentIfVisible(page);
  await page.locator('[data-qa="create-account"]').click();

  // Verify account creation.
  await expect(
    page.getByText('Account Created!', { exact: true })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Continue' }).click();

  await closeAdIfVisible(page);

  // Verify the customer is authenticated.
  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // STEP 2: Log out before shopping.
  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(
    loginPage.emailInput
  ).toBeVisible();

  // STEP 3: Search for Blue Top as a guest.
  await page.goto('https://automationexercise.com/products');

  await closeAdIfVisible(page);

  await productsPage.searchProduct('Blue Top');

  await expect(
    productsPage.searchedProductsHeading
  ).toBeVisible();

  await expect(
    productsPage.productNames
  ).toContainText(['Blue Top']);

  // STEP 4: Add Blue Top to the cart.
  await productsPage.addProductToCart('1');

  await expect(
    productsPage.cartModal()
  ).toBeVisible();

  // Open the cart.
  await productsPage.viewCart();

  await closeAdIfVisible(page);

  // Verify the product before login.
  await expect(
    cartPage.productRow('1')
  ).toBeVisible();

  await expect(
    cartPage.productDescription('1')
  ).toContainText('Blue Top');

  await expect(
    cartPage.productPrice('1')
  ).toContainText('Rs. 500');

  await expect(
    cartPage.productQuantity('1')
  ).toContainText('1');

  await expect(
    cartPage.productTotal('1')
  ).toHaveText('Rs. 500');

  // STEP 5: Navigate to the login page.
  await page.getByRole('link', {
    name: 'Signup / Login'
  }).click();

  await closeAdIfVisible(page);

  // Verify the login form is available.
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();

  // Log in using the newly created account.
  await loginPage.login(email, password);

  // Verify successful authentication.
  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  
  // STEP 6: Navigate to the cart after login.
  await page.goto(
    'https://automationexercise.com/view_cart',
    { waitUntil: 'domcontentloaded' }
  );

  // Verify the cart page URL.
  await expect(page).toHaveURL(/\/view_cart\/?$/);

  await closeAdIfVisible(page);

  // STEP 7: Verify cart persistence after login.
  await expect(cartPage.productRow('1')).toBeVisible();

  await expect(
    cartPage.productDescription('1')
  ).toContainText('Blue Top');

  await expect(
    cartPage.productPrice('1')
  ).toContainText('Rs. 500');

  await expect(
    cartPage.productQuantity('1')
  ).toContainText('1');

  await expect(
    cartPage.productTotal('1')
  ).toHaveText('Rs. 500');
});




});
