
import { test, expect } from '@playwright/test';

test.describe('Account API', () => {

  
test('API-011 - Create user account successfully', async ({ request }) => {
  // ARRANGE - Generate unique test account details
  const email = `api.user.${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  let accountCreated = false;

  try {
    // ACT - Create a new account using the API
    const response = await request.post(
      'https://automationexercise.com/api/createAccount',
      {
        form: {
          name: 'API Test User',
          email,
          password,
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
    accountCreated = body.responseCode === 201;

    // LOG - Display the API response
    console.log('\n=== API-011 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Body:', JSON.stringify(body, null, 2));

    // ASSERT - Validate successful account creation
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');

  } finally {
    // CLEANUP - Delete the account created by this test
    if (accountCreated) {
      const deleteResponse = await request.delete(
        'https://automationexercise.com/api/deleteAccount',
        {
          form: {
            email,
            password
          }
        }
      );

      const deleteBody = await deleteResponse.json();

      console.log('\n=== API-011 CLEANUP ===');
      console.log('Response Body:', JSON.stringify(deleteBody, null, 2));

      expect(deleteBody.responseCode).toBe(200);
      expect(deleteBody.message).toBe('Account deleted!');
    }
  }
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
  let accountCreated = false;

  const accountData = {
    name: 'API Test User',
    email,
    password,
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

  try {
    // Create an account before updating it
    const createResponse = await request.post(
      'https://automationexercise.com/api/createAccount',
      {
        form: accountData
      }
    );

    const createBody = await createResponse.json();
    accountCreated = createBody.responseCode === 201;

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

    // LOG - Display the API response
    console.log('\n=== API-013 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Body:', JSON.stringify(body, null, 2));

    // ASSERT - Validate successful account update
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User updated!');

  } finally {
    // CLEANUP - Delete the test account
    if (accountCreated) {
      const deleteResponse = await request.delete(
        'https://automationexercise.com/api/deleteAccount',
        {
          form: {
            email,
            password
          }
        }
      );

      const deleteBody = await deleteResponse.json();

      console.log('\n=== API-013 CLEANUP ===');
      console.log('Response Body:', JSON.stringify(deleteBody, null, 2));

      expect(deleteBody.responseCode).toBe(200);
      expect(deleteBody.message).toBe('Account deleted!');
    }
  }
});



test('API-014 - Get user account details by email', async ({ request }) => {
  // ARRANGE - Generate unique test credentials
  const email = `api.details.${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  let accountCreated = false;

  try {
    // Create an account to retrieve its details
    const createResponse = await request.post(
      'https://automationexercise.com/api/createAccount',
      {
        form: {
          name: 'API Details Test User',
          email,
          password,
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

    const createBody = await createResponse.json();
    accountCreated = createBody.responseCode === 201;

    expect(createBody.responseCode).toBe(201);

    // ACT - Retrieve account details by email
    const response = await request.get(
      'https://automationexercise.com/api/getUserDetailByEmail',
      {
        params: { email }
      }
    );

    const body = await response.json();

    // LOG - Display the API response
    console.log('\n=== API-014 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Body:', JSON.stringify(body, null, 2));

    // ASSERT - Validate the returned account details
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.user.email).toBe(email);
    expect(body.user.name).toBe('API Details Test User');

  } finally {
    // CLEANUP - Delete the test account
    if (accountCreated) {
      const deleteResponse = await request.delete(
        'https://automationexercise.com/api/deleteAccount',
        {
          form: { email, password }
        }
      );

      const deleteBody = await deleteResponse.json();

      console.log('\n=== API-014 CLEANUP ===');
      console.log('Response Body:', JSON.stringify(deleteBody, null, 2));

      expect(deleteBody.responseCode).toBe(200);
      expect(deleteBody.message).toBe('Account deleted!');
    }
  }
});



});
