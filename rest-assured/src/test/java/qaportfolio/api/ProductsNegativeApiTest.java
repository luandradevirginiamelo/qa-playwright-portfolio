package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class ProductsNegativeApiTest {

    @Test
    void api002_postToProductsListIsNotSupported() {

        // ACT - Send unsupported POST request
        Response response = given()
                .when()
                .post("https://automationexercise.com/api/productsList");

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate API error code
        assertEquals(405, response.jsonPath().getInt("responseCode"));

        // ASSERT - Validate error message
        String message = response.jsonPath().getString("message");

        assertNotNull(message);
        assertTrue(message.toLowerCase().contains("not supported"));

        System.out.println("API-002 PASSED - Unsupported POST method validated!");
    }
}