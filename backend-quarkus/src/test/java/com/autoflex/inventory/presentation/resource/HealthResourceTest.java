package com.autoflex.inventory.presentation.resource;

import io.restassured.RestAssured;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class HealthResourceTest {

  private static final String BASE_PATH = "/api/health";

  @BeforeEach
  void setUp() {
    RestAssured.port = 8081;
  }

  @Test
  void shouldReturn200WhenHealthCheckIsCalled() {
    RestAssured
            .when()
            .get(BASE_PATH)
            .then()
            .statusCode(200);
  }
}
