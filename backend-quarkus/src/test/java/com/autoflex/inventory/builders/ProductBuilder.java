package com.autoflex.inventory.builders;

import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.domain.RawMaterial;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ProductBuilder {
  private String name = "Industrial Robot";
  private BigDecimal price = BigDecimal.valueOf(50000.00);
  private List<ProductMaterial> materials = new ArrayList<>();

  public static ProductBuilder aProduct() {
    return new ProductBuilder();
  }

  public ProductBuilder withName(String name) {
    this.name = name;
    return this;
  }

  public ProductBuilder withMaterial(RawMaterial material, Double quantity) {
    ProductMaterial pm = new ProductMaterial();
    pm.rawMaterial = material;
    pm.requiredQuantity = quantity;
    this.materials.add(pm);
    return this;
  }

  public Product build() {
    Product p = new Product();
    p.name = this.name;
    p.price = this.price;
    this.materials.forEach(pm -> {
      pm.product = p;
      pm.id.productId = p.id;
      pm.id.materialId = pm.rawMaterial.id;
    });
    p.materials = this.materials;
    return p;
  }

  public Product persist() {
    Product p = build();
    p.persist();
    return p;
  }

  public List<Product> persistList(int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> {
              this.name = "Product " + i;
              return persist();
            })
            .collect(Collectors.toList());
  }
}