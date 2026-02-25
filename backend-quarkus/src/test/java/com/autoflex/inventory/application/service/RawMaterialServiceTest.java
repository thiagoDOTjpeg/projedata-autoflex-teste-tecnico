package com.autoflex.inventory.application.service;

import com.autoflex.inventory.builders.RawMaterialBuilder;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.RawMaterialRequestDTO;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class RawMaterialServiceTest {

  @Inject
  RawMaterialService rawMaterialService;

  @Test
  @TestTransaction
  void shouldReturnAllRawMaterialsWhenDatabaseIsNotEmpty() {
    long initialCount = RawMaterial.count();
    RawMaterialBuilder.aRawMaterial().withName("Steel").persist();
    RawMaterialBuilder.aRawMaterial().withName("Aluminum").persist();
    RawMaterialBuilder.aRawMaterial().withName("Copper").persist();

    List<RawMaterial> result = rawMaterialService.getAllRawMaterials();

    assertEquals(initialCount + 3, result.size());
  }

  @Test
  @TestTransaction
  void shouldReturnEmptyListWhenDatabaseIsEmpty() {
    RawMaterial.deleteAll();

    List<RawMaterial> result = rawMaterialService.getAllRawMaterials();

    assertNotNull(result);
  }

  @Test
  @TestTransaction
  void shouldReturnRawMaterialWhenIdExists() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Steel").withStock(100.0).persist();

    RawMaterial result = rawMaterialService.getRawMaterialById(material.id);

    assertNotNull(result);
    assertEquals("Steel", result.name);
    assertEquals(100.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenIdDoesNotExist() {
    Long nonExistentId = 9999L;

    assertThrows(NotFoundException.class, () -> {
      rawMaterialService.getRawMaterialById(nonExistentId);
    });
  }

  @Test
  @TestTransaction
  void shouldReturnCorrectMaterialWithZeroStock() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Out of Stock").withStock(0.0).persist();

    RawMaterial result = rawMaterialService.getRawMaterialById(material.id);

    assertEquals(0.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldReturnCorrectMaterialWithLargeStock() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Large Stock").withStock(999999.99).persist();

    RawMaterial result = rawMaterialService.getRawMaterialById(material.id);

    assertEquals(999999.99, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldReturnCorrectMaterialWithSpecialCharactersInName() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Steel-Grade A@1").withStock(100.0).persist();

    RawMaterial result = rawMaterialService.getRawMaterialById(material.id);

    assertEquals("Steel-Grade A@1", result.name);
  }


  @Test
  @TestTransaction
  void shouldPersistRawMaterialWhenDtoIsValid() {
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Steel", 100.0);

    RawMaterial result = rawMaterialService.saveRawMaterial(dto);

    assertNotNull(result.id);
    assertNotNull(RawMaterial.findById(result.id));
    assertEquals("Steel", result.name);
    assertEquals(100.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldSaveMaterialWithZeroStock() {
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Empty Material", 0.0);

    RawMaterial result = rawMaterialService.saveRawMaterial(dto);

    assertEquals(0.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldSaveMaterialWithLargeStock() {
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Large Stock Material", 999999.99);

    RawMaterial result = rawMaterialService.saveRawMaterial(dto);

    assertEquals(999999.99, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldSaveMaterialWithDecimalStock() {
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Precision Material", 123.456);

    RawMaterial result = rawMaterialService.saveRawMaterial(dto);

    assertEquals(123.456, result.stockQuantity, 0.001);
  }

  @Test
  @TestTransaction
  void shouldSaveMaterialWithSingleCharacterName() {
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("X", 100.0);

    RawMaterial result = rawMaterialService.saveRawMaterial(dto);

    assertEquals("X", result.name);
  }

  @Test
  @TestTransaction
  void shouldSaveMaterialWithLongName() {
    String longName = "A".repeat(255);
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO(longName, 100.0);

    RawMaterial result = rawMaterialService.saveRawMaterial(dto);

    assertEquals(longName, result.name);
  }


  @Test
  @TestTransaction
  void shouldUpdateMaterialNameWhenProvided() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Old Name").persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("New Name", null);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals("New Name", result.name);
  }

  @Test
  @TestTransaction
  void shouldUpdateMaterialStockWhenProvided() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(100.0).persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO(null, 200.0);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals(200.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldUpdateBothNameAndStockWhenProvided() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial()
            .withName("Old Name")
            .withStock(100.0)
            .persist();

    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("New Name", 200.0);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals("New Name", result.name);
    assertEquals(200.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldNotUpdateNameWhenNameIsNull() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Original Name").persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO(null, 200.0);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals("Original Name", result.name);
  }

  @Test
  @TestTransaction
  void shouldNotUpdateStockWhenStockIsNull() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(100.0).persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("New Name", null);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals(100.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldThrowNotFoundExceptionWhenUpdatingNonExistentMaterial() {
    Long nonExistentId = 9999L;
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("New Name", 100.0);

    assertThrows(NotFoundException.class, () -> {
      rawMaterialService.updateRawMaterial(nonExistentId, dto);
    });
  }

  @Test
  @TestTransaction
  void shouldUpdateMaterialStockToZero() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(100.0).persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO(null, 0.0);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals(0.0, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldUpdateMaterialStockToLargeValue() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(100.0).persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO(null, 999999.99);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals(999999.99, result.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldPreserveMaterialIdAfterUpdate() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("Original").persist();
    Long originalId = material.id;

    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Updated", 200.0);
    RawMaterial result = rawMaterialService.updateRawMaterial(originalId, dto);

    assertEquals(originalId, result.id);
  }

  @Test
  @TestTransaction
  void shouldUpdateMultipleMaterialsIndependently() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial().withName("Material 1").withStock(100.0).persist();
    RawMaterial material2 = RawMaterialBuilder.aRawMaterial().withName("Material 2").withStock(50.0).persist();

    RawMaterialRequestDTO dto1 = new RawMaterialRequestDTO("Updated Material 1", 150.0);
    RawMaterialRequestDTO dto2 = new RawMaterialRequestDTO("Updated Material 2", 75.0);

    rawMaterialService.updateRawMaterial(material1.id, dto1);
    rawMaterialService.updateRawMaterial(material2.id, dto2);

    RawMaterial refreshed1 = rawMaterialService.getRawMaterialById(material1.id);
    RawMaterial refreshed2 = rawMaterialService.getRawMaterialById(material2.id);

    assertEquals("Updated Material 1", refreshed1.name);
    assertEquals(150.0, refreshed1.stockQuantity);
    assertEquals("Updated Material 2", refreshed2.name);
    assertEquals(75.0, refreshed2.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldUpdateMaterialWithDecimalStock() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(100.0).persist();
    RawMaterialRequestDTO dto = new RawMaterialRequestDTO(null, 123.456);

    RawMaterial result = rawMaterialService.updateRawMaterial(material.id, dto);

    assertEquals(123.456, result.stockQuantity, 0.001);
  }


  @Test
  @TestTransaction
  void shouldDeleteMaterialWhenIdExists() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withName("To Delete").persist();
    Long id = material.id;

    rawMaterialService.deleteRawMaterialById(id);

    assertNull(RawMaterial.findById(id));
  }

  @Test
  @TestTransaction
  void shouldNotThrowNotFoundExceptionWhenDeletingNonExistentMaterial() {
    Long nonExistentId = 9999L;

    assertDoesNotThrow(() -> {
      rawMaterialService.deleteRawMaterialById(nonExistentId);
    });
  }

  @Test
  @TestTransaction
  void shouldDeleteOnlySpecifiedMaterial() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial().withName("Material 1").persist();
    RawMaterial material2 = RawMaterialBuilder.aRawMaterial().withName("Material 2").persist();

    rawMaterialService.deleteRawMaterialById(material1.id);

    assertNull(RawMaterial.findById(material1.id));
    assertNotNull(RawMaterial.findById(material2.id));
  }

  @Test
  @TestTransaction
  void shouldDeleteMaterialMultipleTimes() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial().withName("Material 1").persist();
    RawMaterial material2 = RawMaterialBuilder.aRawMaterial().withName("Material 2").persist();
    RawMaterial material3 = RawMaterialBuilder.aRawMaterial().withName("Material 3").persist();

    rawMaterialService.deleteRawMaterialById(material1.id);
    rawMaterialService.deleteRawMaterialById(material2.id);
    rawMaterialService.deleteRawMaterialById(material3.id);

    assertNull(RawMaterial.findById(material1.id));
    assertNull(RawMaterial.findById(material2.id));
    assertNull(RawMaterial.findById(material3.id));
  }

  @Test
  @TestTransaction
  void shouldDeleteMaterialWithZeroStock() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(0.0).persist();
    Long id = material.id;

    rawMaterialService.deleteRawMaterialById(id);

    assertNull(RawMaterial.findById(id));
  }

  @Test
  @TestTransaction
  void shouldDeleteMaterialWithLargeStock() {
    RawMaterial material = RawMaterialBuilder.aRawMaterial().withStock(999999.99).persist();
    Long id = material.id;

    rawMaterialService.deleteRawMaterialById(id);

    assertNull(RawMaterial.findById(id));
  }


  @Test
  @TestTransaction
  void shouldHandleMultipleMaterialsWithDifferentStockLevels() {
    RawMaterialBuilder.aRawMaterial().withName("Low Stock").withStock(1.0).persist();
    RawMaterialBuilder.aRawMaterial().withName("Medium Stock").withStock(500.0).persist();
    RawMaterialBuilder.aRawMaterial().withName("High Stock").withStock(10000.0).persist();

    List<RawMaterial> result = rawMaterialService.getAllRawMaterials();

    assertTrue(result.stream().anyMatch(m -> m.name.equals("Low Stock") && m.stockQuantity.equals(1.0)));
    assertTrue(result.stream().anyMatch(m -> m.name.equals("Medium Stock") && m.stockQuantity.equals(500.0)));
    assertTrue(result.stream().anyMatch(m -> m.name.equals("High Stock") && m.stockQuantity.equals(10000.0)));
  }

  @Test
  @TestTransaction
  void shouldNotAffectOtherMaterialsWhenUpdatingOne() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial()
            .withName("Material 1")
            .withStock(100.0)
            .persist();

    RawMaterial material2 = RawMaterialBuilder.aRawMaterial()
            .withName("Material 2")
            .withStock(200.0)
            .persist();

    RawMaterialRequestDTO dto = new RawMaterialRequestDTO("Updated Material 1", 150.0);
    rawMaterialService.updateRawMaterial(material1.id, dto);

    RawMaterial refreshed2 = rawMaterialService.getRawMaterialById(material2.id);
    assertEquals("Material 2", refreshed2.name);
    assertEquals(200.0, refreshed2.stockQuantity);
  }

  @Test
  @TestTransaction
  void shouldNotAffectOtherMaterialsWhenDeletingOne() {
    RawMaterial material1 = RawMaterialBuilder.aRawMaterial().withName("Material 1").persist();
    RawMaterial material2 = RawMaterialBuilder.aRawMaterial().withName("Material 2").persist();

    rawMaterialService.deleteRawMaterialById(material1.id);

    assertNotNull(rawMaterialService.getRawMaterialById(material2.id));
  }
}

