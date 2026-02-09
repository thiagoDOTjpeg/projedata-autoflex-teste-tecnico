package com.autoflex.inventory.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductMaterialId implements Serializable {
  @Column(name = "product_id")
  public Long productId;

  @Column(name = "material_id")
  public Long materialId;

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) return false;
    ProductMaterialId that = (ProductMaterialId) o;
    return Objects.equals(productId, that.productId) && Objects.equals(materialId, that.materialId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(productId, materialId);
  }
}