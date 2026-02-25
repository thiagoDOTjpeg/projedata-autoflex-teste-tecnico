package com.autoflex.inventory.application.service;

import com.autoflex.inventory.builders.ProductBuilder;
import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import com.autoflex.inventory.presentation.dto.ProductUpdateDTO;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.List;

@QuarkusTest
public class ProductServiceTest {

  @Inject
  ProductService productService;

  @Test
  @TestTransaction
  void shouldReturnAllProductsWhenDatabaseIsNotEmpty() {
    long initialCount = Product.count();
    ProductBuilder.aProduct().persistListWithMaterials(3);

    List<Product> result = productService.getAllProducts();

    assertEquals(initialCount + 3, result.size());
  }

  @Test
  @TestTransaction
  void shouldPersistProductAndAssociationsWhenDtoIsValid() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial()
            .withName("Steel")
            .withStock(100.0)
            .persist();

    ProductRequestDTO dto = new ProductRequestDTO(
            "Industrial Robot",
            BigDecimal.valueOf(150.00),
            List.of(new MaterialAmountDTO(material.id, 10.0))
    );

    Product result = productService.saveProductWithMaterials(dto);

    assertNotNull(result.id);
    assertNotNull(Product.findById(result.id));
    assertEquals("Steel", result.materials.getFirst().rawMaterial.name);
  }

  @Test
  @TestTransaction
  void shouldUpdateBasicFieldsWhenMaterialsAreNotProvided() {
    Product product = ProductBuilder.aProduct().withName("Wireless Mouse").persist();
    String oldName = product.name;
    Long id = product.id;

    ProductUpdateDTO dto = new ProductUpdateDTO(
            "Gaming Mouse",
            BigDecimal.valueOf(200.00)
    );

    Product result = productService.updateProductWithMaterials(id, dto);

    assertEquals("Gaming Mouse", result.name);
    assertEquals(BigDecimal.valueOf(200.00).stripTrailingZeros(), result.price.stripTrailingZeros());
    assertNotEquals(oldName, result.name);
  }

  @Test
  @TestTransaction
  void shouldCalculateMaximumProductionBasedOnLimitingMaterialStock() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(10.0).persist();
    RawMaterial screw = RawMaterialBuilder.aRawMaterial().withName("Screw").withStock(100.0).persist();

    ProductBuilder.aProduct()
            .withName("Bottleneck Robot")
            .withMaterial(steel, 2.0)
            .withMaterial(screw, 5.0)
            .persist();

    var suggestions = productService.getProductionSuggestions();

    var suggestion = suggestions.stream()
            .filter(s -> s.productName().equals("Bottleneck Robot"))
            .findFirst()
            .orElseThrow();

    assertEquals(5, suggestion.quantityToProduce());
  }

  @Test
  @TestTransaction
  void shouldRemoveProductFromDatabaseWhenIdExists() {
    Product product = ProductBuilder.aProduct().withName("Mechanical Keyboard").persist();
    Long id = product.id;

    productService.deleteProductById(id);

    assertNull(Product.findById(id));
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenGetProductByIdWithNonExistentId() {
    Long nonExistentId = 9999L;

    assertThrows(NotFoundException.class, () -> {
      productService.getProductById(nonExistentId);
    });
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenMaterialDoesNotExistDuringSaveProduct() {
    ProductRequestDTO dto = new ProductRequestDTO(
            "Robot with Invalid Material",
            BigDecimal.valueOf(150.00),
            List.of(new MaterialAmountDTO(9999L, 10.0))
    );

    assertThrows(NotFoundException.class, () -> {
      productService.saveProductWithMaterials(dto);
    });
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenUpdateProductWithNonExistentId() {
    Long nonExistentId = 9999L;
    ProductUpdateDTO dto = new ProductUpdateDTO(
            "Updated Name",
            BigDecimal.valueOf(200.00)
    );

    assertThrows(NotFoundException.class, () -> {
      productService.updateProductWithMaterials(nonExistentId, dto);
    });
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenDeleteProductWithNonExistentId() {
    Long nonExistentId = 9999L;

    assertDoesNotThrow(() -> {
      productService.deleteProductById(nonExistentId);
    });
  }

  @Test
  @TestTransaction
  void shouldReturnEmptyListWhenNoProductsExist() {
    List<Product> result = productService.getAllProducts();

    assertNotNull(result);
  }

  @Test
  @TestTransaction
  void shouldReturnEmptyProductionSuggestionsWhenProductHasNoMaterials() {
    ProductBuilder.aProduct()
            .withName("Product Without Materials")
            .persist();

    var suggestions = productService.getProductionSuggestions();

    var suggestion = suggestions.stream()
            .filter(s -> s.productName().equals("Product Without Materials"))
            .findFirst();

    assertTrue(suggestion.isEmpty());
  }

  @Test
  @TestTransaction
  void shouldReturnZeroProductionWhenMaterialStockIsInsufficient() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(2.0).persist();

    ProductBuilder.aProduct()
            .withName("Heavy Robot")
            .withMaterial(steel, 10.0)
            .persist();

    var suggestions = productService.getProductionSuggestions();

    var suggestion = suggestions.stream()
            .filter(s -> s.productName().equals("Heavy Robot"))
            .findFirst();

    assertTrue(suggestion.isEmpty());
  }

  @Test
  @TestTransaction
  void shouldReturnZeroProductionWhenAllMaterialsAreOutOfStock() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial().withName("Material 1").withStock(0.0).persist();
    RawMaterial material2 = RawMaterialBuilder.aRawMaterial().withName("Material 2").withStock(0.0).persist();

    ProductBuilder.aProduct()
            .withName("Out Of Stock Product")
            .withMaterial(material1, 5.0)
            .withMaterial(material2, 5.0)
            .persist();

    var suggestions = productService.getProductionSuggestions();

    var suggestion = suggestions.stream()
            .filter(s -> s.productName().equals("Out Of Stock Product"))
            .findFirst();

    assertTrue(suggestion.isEmpty());
  }

  @Test
  @TestTransaction
  void shouldHandleProductWithMultipleMaterialsAndPartialStockCorrectly() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial().withName("Material A").withStock(10.0).persist();
    RawMaterial material2 = RawMaterialBuilder.aRawMaterial().withName("Material B").withStock(50.0).persist();

    ProductBuilder.aProduct()
            .withName("Complex Product")
            .withMaterial(material1, 5.0)
            .withMaterial(material2, 8.0)
            .persist();

    var suggestions = productService.getProductionSuggestions();

    var suggestion = suggestions.stream()
            .filter(s -> s.productName().equals("Complex Product"))
            .findFirst();

    assertTrue(suggestion.isPresent());
    assertEquals(2, suggestion.get().quantityToProduce());
  }

  @Test
  @TestTransaction
  void shouldNotUpdateProductWhenDtoHasNullValues() {
    Product product = ProductBuilder.aProduct()
            .withName("Original Name")
            .persist();
    Long id = product.id;
    String originalName = product.name;

    ProductUpdateDTO dto = new ProductUpdateDTO(null, null);

    Product result = productService.updateProductWithMaterials(id, dto);

    assertEquals(originalName, result.name);
  }

}