package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.RawMaterialRequestDTO;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class RawMaterialResourceTest {

  private static final String BASE_PATH = "/api/raw-materials";
  private static final String CONTENT_TYPE_PROBLEM = "application/problem+json";

  @BeforeEach
  void setUp() {
    RestAssured.port = 8081;
    QuarkusTransaction.requiringNew().run(() -> {
      Product.deleteAll();
      RawMaterial.deleteAll();
    });
  }

  @Test
  void shouldReturn201WhenSavingValidRawMaterial() {
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Steel Plate", 150.0);

    given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .body("name", equalTo("Steel Plate"))
            .body("stockQuantity", is(150.0f));
  }

  @Test
  void shouldReturn400WhenSavingRawMaterialWithInvalidData() {
    RawMaterialRequestDTO invalidDto = new RawMaterialRequestDTO("", -10.0);

    given()
            .contentType(ContentType.JSON)
            .body(invalidDto)
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(400)
            .contentType(CONTENT_TYPE_PROBLEM)
            .body("title", equalTo("Validation Error"));
  }

  @Test
  void shouldReturn200WhenListingRawMaterials() {
    QuarkusTransaction.requiringNew().run(() -> {
      RawMaterialBuilder.aRawMaterial().withName("Copper").persist();
      RawMaterialBuilder.aRawMaterial().withName("Aluminum").persist();
    });

    given()
            .when()
            .get(BASE_PATH)
            .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(2))
            .body("name", hasItems("Copper", "Aluminum"));
  }

  @Test
  void shouldReturn200WhenGettingRawMaterialById() {
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() ->
            RawMaterialBuilder.aRawMaterial().withName("Titanium").withStock(50.0).persist()
    );

    given()
            .when()
            .get(BASE_PATH + "/" + material.id)
            .then()
            .statusCode(200)
            .body("name", equalTo("Titanium"))
            .body("stockQuantity", is(50.0f));
  }

  @Test
  void shouldReturn404WhenRawMaterialDoesNotExist() {
    given()
            .when()
            .get(BASE_PATH + "/999999")
            .then()
            .statusCode(404)
            .contentType(CONTENT_TYPE_PROBLEM)
            .body("title", equalTo("Resource Not Found"));
  }

  @Test
  void shouldReturn200WhenUpdatingRawMaterial() {
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() ->
            RawMaterialBuilder.aRawMaterial().withName("Old Material").persist()
    );

    RawMaterialRequestDTO updateDto = new RawMaterialRequestDTO("Updated Material", 500.0);

    given()
            .contentType(ContentType.JSON)
            .body(updateDto)
            .when()
            .put(BASE_PATH + "/" + material.id)
            .then()
            .statusCode(200)
            .body("name", equalTo("Updated Material"))
            .body("stockQuantity", is(500.0f));
  }

  @Test
  void shouldReturn204WhenDeletingRawMaterial() {
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() ->
            RawMaterialBuilder.aRawMaterial().persist()
    );

    given()
            .when()
            .delete(BASE_PATH + "/" + material.id)
            .then()
            .statusCode(204);
  }
}