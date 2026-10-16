
import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  test('API-001 - Get all products successfully', async ({ request }) => {
    const response = await request.get(
      'https://automationexercise.com/api/productsList'
    );

    const responseBody = await response.json();

    console.log('\n=== API-001 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Code:', responseBody.responseCode);
    console.log('Total Products:', responseBody.products.length);
    console.log(
      'First Product:',
      JSON.stringify(responseBody.products[0], null, 2)
    );

    expect(response.status()).toBe(200);
    expect(responseBody.responseCode).toBe(200);
    expect(Array.isArray(responseBody.products)).toBe(true);
    expect(responseBody.products.length).toBeGreaterThan(0);
  });

  test('API-002 - Reject POST request to products list', async ({ request }) => {
    const response = await request.post(
      'https://automationexercise.com/api/productsList'
    );

    const responseBody = await response.json();

    console.log('\n=== API-002 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));

    expect(responseBody.responseCode).toBe(405);
    expect(responseBody.message).toBe(
      'This request method is not supported.'
    );
  });

  test('API-003 - Get all brands list successfully', async ({ request }) => {
  // ACT - Send GET request to retrieve all brands
  const response = await request.get(
    'https://automationexercise.com/api/brandsList'
  );

  // Retrieve the response body
  const body = await response.json();

  // LOG - Display HTTP status and response body
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate HTTP status
  expect(response.status()).toBe(200);

  // ASSERT - Validate API response code
  expect(body.responseCode).toBe(200);

  // ASSERT - Validate brands list
  expect(Array.isArray(body.brands)).toBe(true);
  expect(body.brands.length).toBeGreaterThan(0);
});
test('API-004 - Reject PUT request to brands list', async ({ request }) => {
  // ACT - Send an unsupported PUT request
  const response = await request.put(
    'https://automationexercise.com/api/brandsList'
  );

  // Retrieve the response body
  const body = await response.json();

  // LOG - Display HTTP status and response body
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate API error response
  expect(body.responseCode).toBe(405);
  expect(body.message).toBe('This request method is not supported.');
});

test('API-005 - Search products successfully', async ({ request }) => {
  // ACT - Search for products containing "top"
  const response = await request.post(
    'https://automationexercise.com/api/searchProduct',
    {
      form: {
        search_product: 'top'
      }
    }
  );

  // Retrieve the response body
  const body = await response.json();

  // LOG - Display HTTP status and response body
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate successful response
  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(200);

  // Validate the returned products
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);

  // Validate that at least one product matches the search
  const hasMatchingProduct = body.products.some(
    (product: { name: string }) =>
      product.name.toLowerCase().includes('top')
  );

  expect(hasMatchingProduct).toBe(true);
});


test('API-006 - Reject product search without search parameter', async ({ request }) => {
  // ACT - Send POST request without the required search parameter
  const response = await request.post(
    'https://automationexercise.com/api/searchProduct'
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the API response in the terminal
  console.log('\n=== API-006 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate the error response
  expect(body.responseCode).toBe(400);

  expect(body.message).toBe(
    'Bad request, search_product parameter is missing in POST request.'
  );
});

});
