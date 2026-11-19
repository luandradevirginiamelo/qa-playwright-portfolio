package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class SearchWithoutRequiredParameter {

    @Test
    void api006_searchWithoutRequiredParameter() {

        // ACT - Send POST without search_product
        Response response = given()
                .contentType("application/x-www-form-urlencoded")
                .when()
                .post("https://automationexercise.com/api/searchProduct");

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate API error code
        assertEquals(400, response.jsonPath().getInt("responseCode"));

        // ASSERT - Validate error message
        String message = response.jsonPath().getString("message");

        assertNotNull(message);
        assertTrue(
                message.toLowerCase().contains("search_product"),
                "Expected an error about the missing search_product parameter"
        );

        System.out.println(
                "API-006 PASSED - Missing search parameter validated!"
        );
    }
}