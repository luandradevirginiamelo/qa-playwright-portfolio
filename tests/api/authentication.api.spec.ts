
import { test, expect } from '@playwright/test';

test.describe('Authentication API', () => {



test('API-007 - Verify login with valid credentials', async ({ request }) => {
  // ARRANGE - Generate unique test credentials
  const email = `api.login.${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  let accountCreated = false;

  try {
    // Create a test account
    const createResponse = await request.post(
      'https://automationexercise.com/api/createAccount',
      {
        form: {
          name: 'API Login Test User',
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

    // ACT - Verify login with valid credentials
    const response = await request.post(
      'https://automationexercise.com/api/verifyLogin',
      {
        form: {
          email,
          password
        }
      }
    );

    const body = await response.json();

    // LOG - Display the API response
    console.log('\n=== API-007 RESPONSE ===');
    console.log('HTTP Status:', response.status());
    console.log('Response Body:', JSON.stringify(body, null, 2));

    // ASSERT - Validate successful login
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User exists!');

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

      console.log('\n=== API-007 CLEANUP ===');
      console.log('Response Body:', JSON.stringify(deleteBody, null, 2));

      expect(deleteBody.responseCode).toBe(200);
      expect(deleteBody.message).toBe('Account deleted!');
    }
  }
});



  
test('API-008 - Reject login without email parameter', async ({ request }) => {
  // ARRANGE - Define a password without providing an email
  const password = 'TestPassword123!';

  // ACT - Send POST request without the required email parameter
  const response = await request.post(
    'https://automationexercise.com/api/verifyLogin',
    {
      form: {
        password: password
      }
    }
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the API response in the terminal
  console.log('\n=== API-008 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate the missing parameter error
  expect(body.responseCode).toBe(400);

  expect(body.message).toBe(
    'Bad request, email or password parameter is missing in POST request.'
  );
});


test('API-009 - Reject DELETE request on verify login', async ({ request }) => {
  // ACT - Send an unsupported DELETE request
  const response = await request.delete(
    'https://automationexercise.com/api/verifyLogin'
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the API response in the terminal
  console.log('\n=== API-009 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate the unsupported method response
  expect(body.responseCode).toBe(405);

  expect(body.message).toBe(
    'This request method is not supported.'
  );
});

test('API-010 - Reject login with invalid credentials', async ({ request }) => {
  // ARRANGE - Define credentials that do not belong to a valid user
  const email = `invalid.user.${Date.now()}@example.com`;
  const password = 'WrongPassword123!';

  // ACT - Send login request with invalid credentials
  const response = await request.post(
    'https://automationexercise.com/api/verifyLogin',
    {
      form: {
        email: email,
        password: password
      }
    }
  );

  // Parse the JSON response
  const body = await response.json();

  // LOG - Display the API response in the terminal
  console.log('\n=== API-010 RESPONSE ===');
  console.log('HTTP Status:', response.status());
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // ASSERT - Validate that the user is not found
  expect(body.responseCode).toBe(404);

  expect(body.message).toBe('User not found!');
});



});
