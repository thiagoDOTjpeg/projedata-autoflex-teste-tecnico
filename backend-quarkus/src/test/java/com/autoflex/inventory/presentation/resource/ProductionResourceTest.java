package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.builders.ProductBuilder;
import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.RawMaterial;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class ProductionResourceTest {

  private static final String BASE_PATH = "/api/production";

  @BeforeEach
  void setUp() {
    RestAssured.port = 8081;
    QuarkusTransaction.requiringNew().run(() -> {
      Product.deleteAll();
      RawMaterial.deleteAll();
    });
  }

  @Test
  void shouldReturn200AndListWhenSuggestionsExist() {
    QuarkusTransaction.requiringNew().run(() -> {
      RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(10.0).persist();
      ProductBuilder.aProduct()
              .withName("Robot")
              .withMaterial(steel, 2.0)
              .persist();
    });

    given()
            .when()
            .get(BASE_PATH + "/suggestions")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("size()", is(1))
            .body("[0].productName", equalTo("Robot"))
            .body("[0].quantityToProduce", is(5));
  }

  @Test
  void shouldReturnEmptyListWhenNoProductsExist() {
    given()
            .when()
            .get(BASE_PATH + "/suggestions")
            .then()
            .statusCode(200)
            .body("size()", is(0));
  }
}