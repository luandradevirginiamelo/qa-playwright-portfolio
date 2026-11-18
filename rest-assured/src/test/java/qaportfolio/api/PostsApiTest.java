package qaportfolio.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

public class PostsApiTest {

    @Test
    void api007_updatePostTitleSuccessfully() {

        // ARRANGE - Define the new title
        String newTitle = "Updated by QA Automation";

        // ACT - Send PATCH request with JSON body
        Response response = given()
                .contentType("application/json")
                .body("{\"title\":\"" + newTitle + "\"}")
                .when()
                .patch("https://jsonplaceholder.typicode.com/posts/1");

        // ASSERT - Validate HTTP status
        assertEquals(200, response.statusCode());

        // ASSERT - Validate updated title
        assertEquals(
                newTitle,
                response.jsonPath().getString("title")
        );

        // ASSERT - Validate post ID
        assertEquals(1, response.jsonPath().getInt("id"));

        System.out.println(
                "API-007 PASSED - PATCH update simulated successfully!"
        );
    }
}