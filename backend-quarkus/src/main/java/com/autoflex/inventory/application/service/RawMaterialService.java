package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.RawMaterialRequestDTO;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class RawMaterialService {

  public List<RawMaterial> getAllRawMaterials() {
    return RawMaterial.listAll();
  }

  public RawMaterial getRawMaterialById(Long id) {
    RawMaterial material = RawMaterial.findById(id);
    if (material == null) {
      throw new NotFoundException("Raw material not found");
    }
    return material;
  }

  @Transactional
  public RawMaterial saveRawMaterial(RawMaterialRequestDTO dto) {
    RawMaterial material = new RawMaterial();
    material.name = dto.name();
    material.stockQuantity = dto.stockQuantity();
    material.persist();

    return material;
  }

  @Transactional
  public RawMaterial updateRawMaterial(Long id, RawMaterialRequestDTO dto) {
    RawMaterial material = RawMaterial.findById(id);
    if(material == null) {
      throw new NotFoundException("Raw material not found");
    }

    if(dto.name() != null) material.name = dto.name();
    if(dto.stockQuantity() != null) material.stockQuantity = dto.stockQuantity();

    return material;
  }

  @Transactional
  public void deleteRawMaterialById(Long id) {
    RawMaterial.findByIdOptional(id)
            .ifPresentOrElse(PanacheEntityBase::delete, () -> Log.warn("WARNING: Attempted to delete non-existent raw material with id " + id));
  }

}
