package com.autoflex.inventory.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "raw_materials")
public class RawMaterial extends PanacheEntityBase {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public String name;

  @Column(name = "stock_quantity", columnDefinition = "NUMBER(19,2)")
  public Double stockQuantity;

  public static RawMaterial findByName(String name) {
    return find("name", name).firstResult();
  }
}