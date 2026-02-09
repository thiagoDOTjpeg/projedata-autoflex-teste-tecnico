package com.autoflex.inventory.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends PanacheEntityBase {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;
  public String name;
  @Column(columnDefinition = "NUMBER(19,2)")
  public Double price;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  public List<ProductMaterial> materials = new ArrayList<>();

  public static List<Product> listAllWithMaterials() {
    return find("select distinct p from Product p " +
            "left join fetch p.materials m " +
            "left join fetch m.rawMaterial " +
            "order by p.price desc").list();
  }
}
