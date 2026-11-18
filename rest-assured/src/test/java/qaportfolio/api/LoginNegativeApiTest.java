package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class LoginNegativeApiTest {

    @Test
    void api009_loginWithInvalidCredentials() {

        // ARRANGE - Define invalid credentials
        String email = "invalid.qa.user@example.com";
        String password = "WrongPassword123!";

        // ACT - Send POST request with invalid login
        Response response = given()
                .contentType("application/x-www-form-urlencoded")
                .formParam("email", email)
                .formParam("password", password)
                .when()
                .post("https://automationexercise.com/api/verifyLogin");

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate API error code
        assertEquals(404, response.jsonPath().getInt("responseCode"));

        // ASSERT - Validate error message
        assertEquals(
                "User not found!",
                response.jsonPath().getString("message")
        );

        System.out.println(
                "API-009 PASSED - Invalid login rejected successfully!"
        );
    }
}