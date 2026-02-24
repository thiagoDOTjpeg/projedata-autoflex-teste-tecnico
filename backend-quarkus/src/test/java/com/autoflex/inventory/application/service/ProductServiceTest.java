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

}