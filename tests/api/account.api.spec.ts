
import { test, expect } from '@playwright/test';

test.describe('Account API', () => {

  test('API-011 - Create user account successfully', async ({ request }) => {
    // ARRANGE - Generate unique test account details
    const email = `api.user.${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    // ACT - Create a new account using the API
    const response = await request.post(
      'https://automationexercise.com/api/createAccount',
      {
        form: {
          name: 'API Test User',
          email: email,
          password: password,
          title: 'Mrs',
          birth_date: '10',
          birth_month: '5',
          birth_year: '1990',
          firstname: 'API',
          lastname: 'Tester',
          company: 'QA Portfolio',
          address1: '1 Test Street',
          address2: 'Apartment 2',
          country: 'Canada',
          zipcode: 'M5V2T6',
          state: 'Ontario',
          city: 'Toronto',
          mobile_number: '1234567890'
        }
      }
    );

    // Parse the JSON response
    const body = await response.json();

    // LOG - Display the API response in the terminal
    console.log('\n=== API-011 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Body:', JSON.stringify(body, null, 2));
    console.log('Created Test Email:', email);

    // ASSERT - Validate successful account creation
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');
  });

test('API-012 - Delete user account successfully', async ({ request }) => {
  // ARRANGE - Generate unique account credentials
  const email = `api.delete.${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  // Create an account before testing deletion
  const createResponse = await request.post(
    'https://automationexercise.com/api/createAccount',
    {
      form: {
        name: 'API Delete Test User',
        email: email,
        password: password,
        title: 'Mrs',
        birth_date: '10',
        birth_month: '5',
        birth_year: '1990',
        firstname: 'API',
        lastname: 'Tester',
        company: 'QA Portfolio',
        address1: '1 Test Street',
        country: 'Canada',
        zipcode: 'M5V2T6',
        state: 'Ontario',
        city: 'Toronto',
        mobile_number: '1234567890'
      }
    }
  );

  const createBody = await createResponse.json();

  // Verify the account was created before attempting deletion
  expect(createBody.responseCode).toBe(201);

  // ACT - Delete the account using its credentials
  const response = await request.delete(
    'https://automationexercise.com/api/deleteAccount',
    {
      form: {
        email: email,
        password: password
      }
    }
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the deletion response
  console.log('\n=== API-012 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate successful account deletion
  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(200);
  expect(body.message).toBe('Account deleted!');
});


test('API-013 - Update user account successfully', async ({ request }) => {
  // ARRANGE - Generate unique credentials for a test account
  const email = `api.update.${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  const accountData = {
    name: 'API Test User',
    email: email,
    password: password,
    title: 'Mrs',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1990',
    firstname: 'API',
    lastname: 'Tester',
    company: 'QA Portfolio',
    address1: '1 Test Street',
    address2: 'Apartment 2',
    country: 'Canada',
    zipcode: 'M5V2T6',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: '1234567890'
  };

  // Create an account before updating it
  const createResponse = await request.post(
    'https://automationexercise.com/api/createAccount',
    {
      form: accountData
    }
  );

  const createBody = await createResponse.json();

  expect(createBody.responseCode).toBe(201);

  // ACT - Update the existing user's information
  const response = await request.put(
    'https://automationexercise.com/api/updateAccount',
    {
      form: {
        ...accountData,
        name: 'Updated API Test User',
        firstname: 'Updated',
        city: 'Vancouver',
        state: 'British Columbia'
      }
    }
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the API response in the terminal
  console.log('\n=== API-013 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));
  console.log('Updated Test Email:', email);

  // ASSERT - Validate successful account update
  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(200);
  expect(body.message).toBe('User updated!');
});

test('API-014 - Get user account details by email', async ({ request }) => {
  // ARRANGE - Generate unique test account credentials
  const email = `api.details.${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  const accountData = {
    name: 'API Details Test User',
    email: email,
    password: password,
    title: 'Mrs',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1990',
    firstname: 'API',
    lastname: 'Tester',
    company: 'QA Portfolio',
    address1: '1 Test Street',
    address2: 'Apartment 2',
    country: 'Canada',
    zipcode: 'M5V2T6',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: '1234567890'
  };

  // Create an account before retrieving its details
  const createResponse = await request.post(
    'https://automationexercise.com/api/createAccount',
    {
      form: accountData
    }
  );

  const createBody = await createResponse.json();

  expect(createBody.responseCode).toBe(201);

  // ACT - Retrieve the account details using its email
  const response = await request.get(
    'https://automationexercise.com/api/getUserDetailByEmail',
    {
      params: {
        email: email
      }
    }
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the API response in the terminal
  console.log('\n=== API-014 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate the response and user information
  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(200);

  expect(body.user.name).toBe(accountData.name);
  expect(body.user.email).toBe(accountData.email);
  expect(body.user.city).toBe(accountData.city);
  expect(body.user.state).toBe(accountData.state);
});


});
