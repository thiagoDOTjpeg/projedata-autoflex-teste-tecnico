package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductMaterialUpdateDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

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
  public ProductMaterial updateMaterialInProduct(Long productId, Long materialId, ProductMaterialUpdateDTO dto) {
    ProductMaterial pm = ProductMaterial.findByProductAndMaterial(productId, materialId);
    if (pm == null) throw new NotFoundException("Product-Material association not found");

    pm.requiredQuantity = dto.quantity();
    pm.persist();
    return pm;
  }

  @Transactional
  public void removeMaterialFromProduct(Long productId, Long materialId) {
    ProductMaterial.removeAssociation(productId, materialId);
  }
}
