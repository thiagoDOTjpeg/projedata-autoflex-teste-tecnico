package com.autoflex.inventory.application.service;

import com.autoflex.inventory.builders.ProductBuilder;
import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductMaterialUpdateDTO;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class ProductMaterialServiceTest {

  @Inject
  ProductMaterialService productMaterialService;

  @Test
  @TestTransaction
  void shouldAddMaterialToProductWhenBothExist() {
    Product product = ProductBuilder.aProduct().withName("Industrial Robot").persist();
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();

    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 10.0);

    Product result = productMaterialService.addMaterialToProduct(product.id, dto);

    assertNotNull(result);
    assertEquals(1, result.materials.size());
    assertEquals("Steel", result.materials.getFirst().rawMaterial.name);
    assertEquals(10.0, result.materials.getFirst().requiredQuantity);
  }

  @Test
  @TestTransaction
  void shouldAddMultipleMaterialsToSameProduct() {
    Product product = ProductBuilder.aProduct().withName("Complex Machine").persist();
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    RawMaterial aluminum = RawMaterialBuilder.aRawMaterial().withName("Aluminum").withStock(50.0).persist();

    productMaterialService.addMaterialToProduct(product.id, new MaterialAmountDTO(steel.id, 5.0));
    productMaterialService.addMaterialToProduct(product.id, new MaterialAmountDTO(aluminum.id, 3.0));

    Product refreshed = Product.findByIdWithMaterials(product.id);

    assertEquals(2, refreshed.materials.size());
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenAddMaterialToNonExistentProduct() {
    Long nonExistentProductId = 9999L;
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Steel").persist();

    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 10.0);

    assertThrows(NotFoundException.class, () -> {
      productMaterialService.addMaterialToProduct(nonExistentProductId, dto);
    });
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenAddNonExistentMaterialToProduct() {
    Product product = ProductBuilder.aProduct().withName("Robot").persist();
    Long nonExistentMaterialId = 9999L;

    MaterialAmountDTO dto = new MaterialAmountDTO(nonExistentMaterialId, 10.0);

    assertThrows(NotFoundException.class, () -> {
      productMaterialService.addMaterialToProduct(product.id, dto);
    });
  }

  @Test
  @TestTransaction
  void shouldAllowAddingMaterialWhenQuantityIsZero() {
    Product product = ProductBuilder.aProduct().withName("Test Product").persist();
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Test Material").persist();

    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 0.0);

    Product result = productMaterialService.addMaterialToProduct(product.id, dto);

    assertNotNull(result);
    assertEquals(0.0, result.materials.getFirst().requiredQuantity);
  }

  @Test
  @TestTransaction
  void shouldPersistMaterialCorrectlyWhenQuantityIsExtremelyLarge() {
    Product product = ProductBuilder.aProduct().withName("Test Product").persist();
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Test Material").persist();

    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 10000.99);

    Product result = productMaterialService.addMaterialToProduct(product.id, dto);

    assertEquals(10000.99, result.materials.getFirst().requiredQuantity);
  }


  @Test
  @TestTransaction
  void shouldUpdateExistingMaterialQuantity() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(steel.id, 15.0))
    );

    List<ProductMaterial> result = productMaterialService.updateMaterialInProduct(product.id, dto);

    assertEquals(1, result.size());
    assertEquals(15.0, result.getFirst().requiredQuantity);
  }

  @Test
  @TestTransaction
  void shouldAddNewMaterialDuringUpdate() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    RawMaterial aluminum = RawMaterialBuilder.aRawMaterial().withName("Aluminum").withStock(50.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(
                    new MaterialAmountDTO(steel.id, 5.0),
                    new MaterialAmountDTO(aluminum.id, 3.0)
            )
    );

    List<ProductMaterial> result = productMaterialService.updateMaterialInProduct(product.id, dto);

    assertEquals(2, result.size());
  }

  @Test
  @TestTransaction
  void shouldUpdateMultipleMaterialsSimultaneously() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    RawMaterial aluminum = RawMaterialBuilder.aRawMaterial().withName("Aluminum").withStock(50.0).persist();
    RawMaterial copper = RawMaterialBuilder.aRawMaterial().withName("Copper").withStock(30.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Complex Robot")
            .withMaterial(steel, 5.0)
            .withMaterial(aluminum, 3.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(
                    new MaterialAmountDTO(steel.id, 10.0),
                    new MaterialAmountDTO(copper.id, 2.0)
            )
    );

    Product.getEntityManager().clear();
    List<ProductMaterial> result = productMaterialService.updateMaterialInProduct(product.id, dto);

    assertEquals(2, result.size());
    assertTrue(result.stream().anyMatch(pm -> pm.rawMaterial.id.equals(steel.id) && pm.requiredQuantity.equals(10.0)));
    assertTrue(result.stream().anyMatch(pm -> pm.rawMaterial.id.equals(copper.id) && pm.requiredQuantity.equals(2.0)));
    assertFalse(result.stream().anyMatch(pm -> pm.rawMaterial.id.equals(aluminum.id)));
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenUpdateMaterialForNonExistentProduct() {
    Long nonExistentProductId = 9999L;
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Steel").persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(material.id, 10.0))
    );

    assertThrows(NotFoundException.class, () -> {
      productMaterialService.updateMaterialInProduct(nonExistentProductId, dto);
    });
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenUpdateWithNonExistentMaterial() {
    Product product = ProductBuilder.aProduct().withName("Robot").persist();
    Long nonExistentMaterialId = 9999L;

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(nonExistentMaterialId, 10.0))
    );

    assertThrows(NotFoundException.class, () -> {
      productMaterialService.updateMaterialInProduct(product.id, dto);
    });
  }

  @Test
  @TestTransaction
  void shouldHandleUpdateWithMixOfExistingAndNewMaterials() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    RawMaterial aluminum = RawMaterialBuilder.aRawMaterial().withName("Aluminum").withStock(50.0).persist();
    RawMaterial copper = RawMaterialBuilder.aRawMaterial().withName("Copper").withStock(30.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(
                    new MaterialAmountDTO(steel.id, 8.0),
                    new MaterialAmountDTO(aluminum.id, 4.0),
                    new MaterialAmountDTO(copper.id, 2.0)
            )
    );

    List<ProductMaterial> result = productMaterialService.updateMaterialInProduct(product.id, dto);

    assertEquals(3, result.size());
    assertTrue(result.stream().anyMatch(pm -> pm.rawMaterial.id.equals(steel.id) && pm.requiredQuantity.equals(8.0)));
    assertTrue(result.stream().anyMatch(pm -> pm.rawMaterial.id.equals(aluminum.id)));
    assertTrue(result.stream().anyMatch(pm -> pm.rawMaterial.id.equals(copper.id)));
  }

  @Test
  @TestTransaction
  void shouldUpdateMaterialQuantityToZero() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(steel.id, 0.0))
    );

    List<ProductMaterial> result = productMaterialService.updateMaterialInProduct(product.id, dto);

    assertEquals(1, result.size());
    assertEquals(0.0, result.getFirst().requiredQuantity);
  }

  @Test
  @TestTransaction
  void shouldRemoveMaterialFromProduct() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .persist();

    productMaterialService.removeMaterialFromProduct(product.id, steel.id);

    List<ProductMaterial> materials = ProductMaterial.findAllByProductId(product.id);
    assertEquals(0, materials.size());
  }

  @Test
  @TestTransaction
  void shouldRemoveOnlySpecifiedMaterialFromProduct() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    RawMaterial aluminum = RawMaterialBuilder.aRawMaterial().withName("Aluminum").withStock(50.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .withMaterial(aluminum, 3.0)
            .persist();

    productMaterialService.removeMaterialFromProduct(product.id, steel.id);

    List<ProductMaterial> materials = ProductMaterial.findAllByProductId(product.id);
    assertEquals(1, materials.size());
    assertEquals(aluminum.id, materials.getFirst().rawMaterial.id);
  }

  @Test
  @TestTransaction
  void shouldRemoveAllMaterialsFromProductOneByOne() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();
    RawMaterial aluminum = RawMaterialBuilder.aRawMaterial().withName("Aluminum").withStock(50.0).persist();
    RawMaterial copper = RawMaterialBuilder.aRawMaterial().withName("Copper").withStock(30.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Complex Robot")
            .withMaterial(steel, 5.0)
            .withMaterial(aluminum, 3.0)
            .withMaterial(copper, 2.0)
            .persist();

    productMaterialService.removeMaterialFromProduct(product.id, steel.id);
    productMaterialService.removeMaterialFromProduct(product.id, aluminum.id);
    productMaterialService.removeMaterialFromProduct(product.id, copper.id);

    List<ProductMaterial> materials = ProductMaterial.findAllByProductId(product.id);
    assertEquals(0, materials.size());
  }

  @Test
  @TestTransaction
  void shouldHandleDecimalQuantitiesCorrectly() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Precision Material").persist();
    Product product = ProductBuilder.aProduct().withName("Precision Product").persist();

    MaterialAmountDTO dto = new MaterialAmountDTO(material.id, 3.14159);

    Product result = productMaterialService.addMaterialToProduct(product.id, dto);

    assertEquals(3.14159, result.materials.getFirst().requiredQuantity, 0.00001);
  }

  @Test
  @TestTransaction
  void shouldNotAffectOtherProductsWhenUpdatingMaterials() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();

    Product product1 = ProductBuilder.aProduct()
            .withName("Robot 1")
            .withMaterial(steel, 5.0)
            .persist();

    Product product2 = ProductBuilder.aProduct()
            .withName("Robot 2")
            .withMaterial(steel, 8.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(steel.id, 15.0))
    );

    productMaterialService.updateMaterialInProduct(product1.id, dto);

    List<ProductMaterial> product2Materials = ProductMaterial.findAllByProductId(product2.id);
    assertEquals(8.0, product2Materials.getFirst().requiredQuantity);
  }

  @Test
  @TestTransaction
  void shouldHandleUpdateWithSameQuantity() {
    RawMaterial steel = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();

    Product product = ProductBuilder.aProduct()
            .withName("Robot")
            .withMaterial(steel, 5.0)
            .persist();

    ProductMaterialUpdateDTO dto = new ProductMaterialUpdateDTO(
            List.of(new MaterialAmountDTO(steel.id, 5.0))
    );

    List<ProductMaterial> result = productMaterialService.updateMaterialInProduct(product.id, dto);

    assertEquals(1, result.size());
    assertEquals(5.0, result.getFirst().requiredQuantity);
  }
}

