
package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class SearchProductsSuccessfullyTest {

    @Test
    void api005_searchProductsSuccessfully() {

        // ARRANGE - Define search term
        String searchTerm = "top";

        // ACT - Search for products
        Response response = given()
                .contentType("application/x-www-form-urlencoded")
                .formParam("search_product", searchTerm)
                .when()
                .post("https://automationexercise.com/api/searchProduct");

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate API response code
        assertEquals(200, response.jsonPath().getInt("responseCode"));

        // ASSERT - Validate products list
        List<Map<String, Object>> products =
                response.jsonPath().getList("products");

        assertNotNull(products);
        assertFalse(products.isEmpty());

        // ASSERT - Validate product structure
        for (Map<String, Object> product : products) {
            assertNotNull(product.get("id"));
            assertNotNull(product.get("name"));
            assertNotNull(product.get("price"));
            assertNotNull(product.get("brand"));
        }

        System.out.println(
                "API-005 PASSED - Search returned "
                + products.size() + " products!"
        );
    }
}
