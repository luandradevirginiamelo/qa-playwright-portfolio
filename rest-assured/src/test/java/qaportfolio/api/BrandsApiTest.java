package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class BrandsApiTest {

    @Test
    void api003_getAllBrandsSuccessfully() {

        // ACT - Send GET request
        Response response = given()
                .when()
                .get("https://automationexercise.com/api/brandsList");

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate API response code
        assertEquals(200, response.jsonPath().getInt("responseCode"));

        // ASSERT - Validate brands list
        List<Map<String, Object>> brands =
                response.jsonPath().getList("brands");

        assertNotNull(brands);
        assertFalse(brands.isEmpty());

        // ASSERT - Validate required brand fields
        for (Map<String, Object> brand : brands) {
            assertNotNull(brand.get("id"));
            assertNotNull(brand.get("brand"));
        }

        System.out.println("API-003 PASSED - Brands retrieved successfully!");
    }
}