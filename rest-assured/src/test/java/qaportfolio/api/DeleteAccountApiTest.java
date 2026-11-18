package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class DeleteAccountApiTest {

    @Test
    void api010_createAndDeleteAccountSuccessfully() {

        // ARRANGE - Generate disposable test account
        String email = "qa.test." + UUID.randomUUID() + "@example.com";
        String password = "QaTest123!";

        // ACT - Create account
        Response createResponse = given()
                .contentType("application/x-www-form-urlencoded")
                .formParam("name", "QA Automation")
                .formParam("email", email)
                .formParam("password", password)
                .formParam("title", "Mr")
                .formParam("birth_date", "10")
                .formParam("birth_month", "5")
                .formParam("birth_year", "1995")
                .formParam("firstname", "QA")
                .formParam("lastname", "Automation")
                .formParam("company", "QA Portfolio")
                .formParam("address1", "123 Test Street")
                .formParam("address2", "Suite 1")
                .formParam("country", "United States")
                .formParam("zipcode", "10001")
                .formParam("state", "New York")
                .formParam("city", "New York")
                .formParam("mobile_number", "1234567890")
                .when()
                .post("https://automationexercise.com/api/createAccount");

        int createCode = createResponse.jsonPath().getInt("responseCode");
        String createMessage = createResponse.jsonPath().getString("message");

        // Cleanup - Delete account if creation succeeded
        if (createCode == 201) {

            Response deleteResponse = given()
                    .contentType("application/x-www-form-urlencoded")
                    .formParam("email", email)
                    .formParam("password", password)
                    .when()
                    .delete("https://automationexercise.com/api/deleteAccount");

            // ASSERT - Validate account deletion
            assertEquals(200, deleteResponse.statusCode());
            assertEquals(200, deleteResponse.jsonPath().getInt("responseCode"));
            assertEquals(
                    "Account deleted!",
                    deleteResponse.jsonPath().getString("message")
            );

            System.out.println("API-010 PASSED - Test account deleted!");
        }

        // ASSERT - Validate account creation
        assertEquals(200, createResponse.statusCode());
        assertEquals(201, createCode);
        assertEquals("User created!", createMessage);
    }
}