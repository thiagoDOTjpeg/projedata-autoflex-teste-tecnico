package com.autoflex.inventory.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "product_materials")
public class ProductMaterial extends PanacheEntityBase {

  @EmbeddedId
  @JsonIgnore
  public ProductMaterialId id = new ProductMaterialId();

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("productId")
  @JoinColumn(name = "product_id")
  @JsonIgnore
  public Product product;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("materialId")
  @JoinColumn(name = "material_id")
  public RawMaterial rawMaterial;

  @Column(name = "required_quantity", columnDefinition = "NUMBER(19,2)")
  public Double requiredQuantity;

  public static ProductMaterial findByProductAndMaterial(Long productId, Long materialId) {
    return find("from ProductMaterial pm " +
                    "left join fetch pm.product " +
                    "left join fetch pm.rawMaterial " +
                    "where pm.product.id = ?1 and pm.rawMaterial.id = ?2",
            productId, materialId).firstResult();
  }

  public static void removeAssociation(Long productId, Long materialId) {
    delete("product.id = ?1 and rawMaterial.id = ?2", productId, materialId);
  }
}