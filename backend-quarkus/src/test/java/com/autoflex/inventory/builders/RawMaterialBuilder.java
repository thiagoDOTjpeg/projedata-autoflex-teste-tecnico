package com.autoflex.inventory.builders;

import com.autoflex.inventory.domain.RawMaterial;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class RawMaterialBuilder {
  private String name = "Default Material";
  private Double stockQuantity = 100.0;

  public static RawMaterialBuilder aRawMaterial() {
    return new RawMaterialBuilder();
  }

  public RawMaterialBuilder withName(String name) {
    this.name = name;
    return this;
  }

  public RawMaterialBuilder withStock(Double quantity) {
    this.stockQuantity = quantity;
    return this;
  }

  public RawMaterial build() {
    RawMaterial rm = new RawMaterial();
    rm.name = this.name;
    rm.stockQuantity = this.stockQuantity;
    return rm;
  }

  public RawMaterial persist() {
    RawMaterial rm = build();
    rm.persist();
    return rm;
  }

  public List<RawMaterial> persistList(int count) {
    return IntStream.range(0, count)
            .mapToObj(i -> {
              this.name = "Material " + i;
              return persist();
            })
            .collect(Collectors.toList());
  }
}