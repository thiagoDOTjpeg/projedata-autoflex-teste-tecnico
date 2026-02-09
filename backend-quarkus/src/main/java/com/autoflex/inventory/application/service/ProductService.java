package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class ProductService {
  public Product saveProductWithMaterials(ProductRequestDTO dto) {
    Product product = new Product();
    product.name = dto.name();
    product.price = dto.price();
    product.persist();

    for (MaterialAmountDTO mDto : dto.materials()) {
      RawMaterial material = RawMaterial.findById(mDto.materialId());
      if (material == null) throw new NotFoundException("Material not found");

      ProductMaterial pm = new ProductMaterial();
      pm.product = product;
      pm.rawMaterial = material;
      pm.requiredQuantity = mDto.quantity();
      pm.persist();
    }

    return product;
  }
}
