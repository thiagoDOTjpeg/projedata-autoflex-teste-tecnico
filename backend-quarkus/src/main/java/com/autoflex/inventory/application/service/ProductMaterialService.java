package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductMaterialUpdateDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductMaterialService {

  @Transactional
  public Product addMaterialToProduct(Long productId, MaterialAmountDTO dto) {
    Product product = Product.findByIdWithMaterials(productId);
    if (product == null) throw new NotFoundException("Product not found");

    RawMaterial rm = RawMaterial.findById(dto.materialId());
    if (rm == null) throw new NotFoundException("Material not found");

    ProductMaterial pm = new ProductMaterial();
    pm.product = product;
    pm.rawMaterial = rm;
    pm.requiredQuantity = dto.quantity();
    pm.id.productId = productId;
    pm.id.materialId = rm.id;

    product.materials.add(pm);
    product.persist();
    return product;
  }

  @Transactional
  public List<ProductMaterial> updateMaterialInProduct(Long productId, ProductMaterialUpdateDTO dto) {
    List<ProductMaterial> currentPms = ProductMaterial.findAllByProductId(productId);

    Product product = Product.findById(productId);
    if (product == null) throw new NotFoundException("Product not found");

    Map<Long, ProductMaterial> existingMap = currentPms.stream()
            .collect(Collectors.toMap(pm -> pm.rawMaterial.id, pm -> pm));

    Set<Long> incomingIds = dto.materials().stream()
            .map(MaterialAmountDTO::materialId)
            .collect(Collectors.toSet());

    currentPms.removeIf(pm -> {
      if (!incomingIds.contains(pm.rawMaterial.id)) {
        pm.delete();
        return true;
      }
      return false;
    });

    for (MaterialAmountDTO ma : dto.materials()) {
      ProductMaterial pm = existingMap.get(ma.materialId());

      if (pm != null) {
        pm.requiredQuantity = ma.quantity();
      } else {
        RawMaterial rm = RawMaterial.findById(ma.materialId());
        if (rm == null) throw new NotFoundException("Material " + ma.materialId() + " not found");

        ProductMaterial newPm = new ProductMaterial();
        newPm.product = product;
        newPm.rawMaterial = rm;
        newPm.requiredQuantity = ma.quantity();
        newPm.id.productId = productId;
        newPm.id.materialId = rm.id;
        newPm.persist();
      }
    }
    return ProductMaterial.findAllByProductId(productId);
  }

  @Transactional
  public void removeMaterialFromProduct(Long productId, Long materialId) {
    ProductMaterial.removeAssociation(productId, materialId);
  }
}
