package com.autoflex.inventory.builders;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ProductMaterialBuilder {
  private Product product;
  private RawMaterial rawMaterial;
  private Double quantity = 1.0;

  public static ProductMaterialBuilder aProductMaterial() {
    return new ProductMaterialBuilder();
  }

  public ProductMaterialBuilder forProduct(Product product) {
    this.product = product;
    return this;
  }

  public ProductMaterialBuilder withMaterial(RawMaterial rawMaterial) {
    this.rawMaterial = rawMaterial;
    return this;
  }

  public ProductMaterialBuilder withQuantity(Double quantity) {
    this.quantity = quantity;
    return this;
  }

  public ProductMaterial build() {
    ProductMaterial pm = new ProductMaterial();
    pm.product = this.product;
    pm.rawMaterial = this.rawMaterial;
    pm.requiredQuantity = this.quantity;

    if (product != null) pm.id.productId = product.id;
    if (rawMaterial != null) pm.id.materialId = rawMaterial.id;

    return pm;
  }

  public ProductMaterial persist() {
    ProductMaterial pm = build();
    pm.persist();
    return pm;
  }

  public List<ProductMaterial> buildList(int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> build())
            .collect(Collectors.toList());
  }
}