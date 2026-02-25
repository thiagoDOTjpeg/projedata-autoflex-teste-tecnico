package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.builders.ProductBuilder;
import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import com.autoflex.inventory.presentation.dto.ProductUpdateDTO;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class ProductResourceTest {

  private static final String BASE_PATH = "/api/products";
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
  void shouldReturn201WhenSavingValidProduct() {
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() ->
            RawMaterialBuilder.aRawMaterial().withName("Steel").persist()
    );

    ProductRequestDTO dto = new ProductRequestDTO(
            "Industrial Robot",
            BigDecimal.valueOf(1500.00),
            List.of(new MaterialAmountDTO(material.id, 5.0))
    );

    given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .body("name", equalTo("Industrial Robot"))
            .body("price", is(1500.0f));
  }

  @Test
  void shouldReturn400WhenSavingProductWithInvalidData() {
    ProductRequestDTO invalidDto = new ProductRequestDTO("", BigDecimal.valueOf(-1), List.of());

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
  void shouldReturn200WhenListingProducts() {
    QuarkusTransaction.requiringNew().run(() ->
            ProductBuilder.aProduct().persistListWithMaterials(2)
    );

    given()
            .when()
            .get(BASE_PATH)
            .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(2));
  }

  @Test
  void shouldReturn404WhenProductDoesNotExist() {
    given()
            .when()
            .get(BASE_PATH + "/9999")
            .then()
            .statusCode(404)
            .contentType(CONTENT_TYPE_PROBLEM)
            .body("title", equalTo("Resource Not Found"));
  }


  @Test
  void shouldReturn200WhenUpdatingProduct() {
    final Product product = QuarkusTransaction.requiringNew().call(() ->
            ProductBuilder.aProduct().withName("Old Name").persist()
    );

    ProductUpdateDTO updateDto = new ProductUpdateDTO("New Name", BigDecimal.valueOf(250.00));

    given()
            .contentType(ContentType.JSON)
            .body(updateDto)
            .when()
            .put(BASE_PATH + "/" + product.id)
            .then()
            .statusCode(200)
            .body("name", equalTo("New Name"))
            .body("price", is(250.0f));
  }


  @Test
  void shouldReturn204WhenDeletingProduct() {
    final Product product = QuarkusTransaction.requiringNew().call(() ->
            ProductBuilder.aProduct().persist()
    );

    given()
            .when()
            .delete(BASE_PATH + "/" + product.id)
            .then()
            .statusCode(204);
  }
}