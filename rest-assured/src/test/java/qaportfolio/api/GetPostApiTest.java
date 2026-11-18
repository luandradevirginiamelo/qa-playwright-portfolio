package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class GetPostApiTest {

    @Test
    void api008_getPostByIdSuccessfully() {

        // ARRANGE - Define post ID
        int postId = 1;

        // ACT - Send GET request
        Response response = given()
                .when()
                .get("https://jsonplaceholder.typicode.com/posts/" + postId);

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate post ID
        assertEquals(postId, response.jsonPath().getInt("id"));

        // ASSERT - Validate required fields
        assertNotNull(response.jsonPath().get("userId"));

        String title = response.jsonPath().getString("title");
        String body = response.jsonPath().getString("body");

        assertNotNull(title);
        assertFalse(title.isBlank());

        assertNotNull(body);
        assertFalse(body.isBlank());

        System.out.println(
                "API-008 PASSED - Post retrieved successfully!"
        );
    }
}