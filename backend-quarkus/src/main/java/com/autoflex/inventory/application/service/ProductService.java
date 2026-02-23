package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import com.autoflex.inventory.presentation.dto.ProductUpdateDTO;
import com.autoflex.inventory.presentation.dto.ProductionSuggestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

  public List<Product> getAllProducts() {
    return Product.listAllWithMaterials();
  }

  public Product getProductById(Long id) {
    Product product = Product.findByIdWithMaterials(id);
    if (product == null) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  @Transactional
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
  public Product updateProductWithMaterials(Long id, ProductUpdateDTO dto) {
    Product product = Product.findByIdWithMaterials(id);
    if (product == null) {
      throw new NotFoundException("Product not found");
    }
    if (dto.name() != null) product.name = dto.name();
    if (dto.price() != null) product.price = dto.price();

    return product;
  }

  public List<ProductionSuggestionDTO> getProductionSuggestions() {
    List<Product> products = Product.listAllWithMaterials();

    Map<Long, Double> availableStock = RawMaterial.<RawMaterial>listAll().stream()
            .collect(Collectors.toMap(rm -> rm.id, rm -> rm.stockQuantity));

    List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

    for (Product p : products) {
      long maxUnitsForProduct = Long.MAX_VALUE;

      if (p.materials.isEmpty()) continue;

      for (ProductMaterial formula : p.materials) {
        double inStock = availableStock.getOrDefault(formula.rawMaterial.id, 0.0);
        double required = formula.requiredQuantity;

        if (required > 0) {
          long possibleWithThisMaterial = (long) Math.floor(inStock / required);
          maxUnitsForProduct = Math.min(maxUnitsForProduct, possibleWithThisMaterial);
        }
      }

      if (maxUnitsForProduct > 0) {
        for (ProductMaterial formula : p.materials) {
          double totalUsed = formula.requiredQuantity * maxUnitsForProduct;
          availableStock.merge(formula.rawMaterial.id, -totalUsed, Double::sum);
        }

        BigDecimal quantity = BigDecimal.valueOf(maxUnitsForProduct);

        suggestions.add(new ProductionSuggestionDTO(
                p.name,
                (int) maxUnitsForProduct,
                p.price,
                p.price.multiply(quantity)
        ));
      }
    }
    return suggestions;
  }

  @Transactional
  public void deleteProductById(Long id) {
    Product product = Product.findById(id);
    if (product == null) {
      throw new NotFoundException("Product not found");
    }
    product.delete();
  }
}
