package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.builders.ProductBuilder;
import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductMaterialUpdateDTO;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class ProductMaterialResourceTest {

  private static final String BASE_PATH = "/api/product-materials";
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
  void shouldReturn201WhenAddingValidMaterialToProduct() {

    final Product product = QuarkusTransaction.requiringNew().call(() -> ProductBuilder.aProduct().persist());
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() -> RawMaterialBuilder.aRawMaterial().persist());

    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 10.0);

    given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
            .post(BASE_PATH + "/" + product.id)
            .then()
            .statusCode(201)
            .body("materials.size()", is(1))
            .body("materials[0].rawMaterial.id", is(material.id.intValue()));
  }

  @Test
  void shouldReturn404WhenAddingMaterialToNonExistentProduct() {
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() -> RawMaterialBuilder.aRawMaterial().persist());
    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 5.0);

    given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
            .post(BASE_PATH + "/9999")
            .then()
            .statusCode(404)
            .contentType(CONTENT_TYPE_PROBLEM)
            .body("title", equalTo("Resource Not Found"));
  }

  @Test
  void shouldReturn400WhenAddingMaterialWithNegativeQuantity() {
    final Product product = QuarkusTransaction.requiringNew().call(() -> ProductBuilder.aProduct().persist());
    MaterialAmountDTO dto = new MaterialAmountDTO(1L, -1.0);

    given()
            .contentType(ContentType.JSON)
            .body(dto)
            .when()
            .post(BASE_PATH + "/" + product.id)
            .then()
            .statusCode(400)
            .body("title", equalTo("Validation Error"));
  }



  @Test
  void shouldReturn200WhenUpdatingMaterialsOfAProduct() {
    final RawMaterial mat1 = QuarkusTransaction.requiringNew().call(() -> RawMaterialBuilder.aRawMaterial().persist());
    final RawMaterial mat2 = QuarkusTransaction.requiringNew().call(() -> RawMaterialBuilder.aRawMaterial().persist());
    final Product product = QuarkusTransaction.requiringNew().call(() ->
            ProductBuilder.aProduct().withMaterial(mat1, 2.0).persist()
    );


    ProductMaterialUpdateDTO updateDto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(mat2.id, 50.0))
    );

    given()
            .contentType(ContentType.JSON)
            .body(updateDto)
            .when()
            .put(BASE_PATH + "/" + product.id)
            .then()
            .statusCode(200)
            .body("size()", is(1))
            .body("requiredQuantity", hasItem(50.0f));
  }



  @Test
  void shouldReturn204WhenRemovingMaterialFromProduct() {
    final RawMaterial material = QuarkusTransaction.requiringNew().call(() -> RawMaterialBuilder.aRawMaterial().persist());
    final Product product = QuarkusTransaction.requiringNew().call(() ->
            ProductBuilder.aProduct().withMaterial(material, 10.0).persist()
    );

    given()
            .when()
            .delete(BASE_PATH + "/" + product.id + "/" + material.id)
            .then()
            .statusCode(204);


    given()
            .when()
            .get("/api/products/" + product.id)
            .then()
            .body("materials.size()", is(0));
  }

  @Test
  void shouldReturn404WhenDeletingFromNonExistentProduct() {
    given()
            .when()
            .delete(BASE_PATH + "/9999/1")
            .then()
            .statusCode(204);
  }
}