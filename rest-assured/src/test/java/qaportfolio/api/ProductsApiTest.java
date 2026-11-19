
package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class ProductsApiTest {

    @Test
    void api001_getAllProductsSuccessfully() {

        // ACT - Send GET request
        Response response = given()
                .when()
                .get("https://automationexercise.com/api/productsList");

        // DEBUG - Inspect API response in GitHub Actions
        System.out.println("HTTP STATUS: " + response.statusCode());
        System.out.println("CONTENT TYPE: " + response.contentType());

        String responseBody = response.asString();

        System.out.println(
                "RESPONSE BODY: " +
                responseBody.substring(0, Math.min(responseBody.length(), 500))
        );

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate API response code
        assertEquals(200, response.jsonPath().getInt("responseCode"));

        // ASSERT - Validate product list
        List<Map<String, Object>> products =
                response.jsonPath().getList("products");

        assertNotNull(products);
        assertFalse(products.isEmpty());

        // ASSERT - Validate required product fields
        for (Map<String, Object> product : products) {
            assertNotNull(product.get("id"));
            assertNotNull(product.get("name"));
            assertNotNull(product.get("price"));
            assertNotNull(product.get("brand"));
        }

        System.out.println(
                "API-001 PASSED - Products retrieved successfully!"
        );
    }
}
