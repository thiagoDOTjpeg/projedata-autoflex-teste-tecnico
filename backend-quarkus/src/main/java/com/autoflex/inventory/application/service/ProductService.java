package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

  public List<Product> getAllProducts() {
    return Product.listAllWithMaterials();
  }

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
      product.materials.add(pm);
      pm.persist();
    }

    return product;
  }

  @Transactional
  public Product updateProductWithMaterials(Long id, ProductRequestDTO dto) {
    Product product = Product.findById(id);
    if (product == null) {
      throw new NotFoundException("Product not found");
    }

    if (dto.name() != null) product.name = dto.name();
    if (dto.price() != null) product.price = dto.price();

    if (dto.materials() != null) {
      Map<Long, ProductMaterial> currentMaterialsMap = product.materials.stream()
              .collect(Collectors.toMap(pm -> pm.id.materialId, pm -> pm));

      Set<Long> incomingIds = dto.materials().stream()
              .map(MaterialAmountDTO::materialId)
              .collect(Collectors.toSet());

      product.materials.removeIf(pm -> !incomingIds.contains(pm.id.materialId));

      for (MaterialAmountDTO maDto : dto.materials()) {
        ProductMaterial existing = currentMaterialsMap.get(maDto.materialId());

        if (existing != null) {
          existing.requiredQuantity = maDto.quantity();
        } else {
          RawMaterial rm = RawMaterial.findById(maDto.materialId());
          if (rm == null) throw new NotFoundException("Material " + maDto.materialId() + " not found");

          ProductMaterial newPm = new ProductMaterial();
          newPm.product = product;
          newPm.rawMaterial = rm;
          newPm.requiredQuantity = maDto.quantity();

          newPm.id.productId = product.id;
          newPm.id.materialId = rm.id;

          product.materials.add(newPm);
        }
      }
    }

    return product;
  }

  public void deleteProductById(Long id) {
    Product product = Product.findById(id);
    if (product == null) {
      throw new NotFoundException("Product not found");
    }
    product.delete();
  }
}
