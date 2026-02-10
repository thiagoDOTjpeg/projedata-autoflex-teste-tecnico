package com.autoflex.inventory.application.service;

import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.RawMaterialRequestDTO;
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
      throw new RuntimeException("Raw material not found");
    }
    return material;
  }

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

  public void deleteRawMaterialById(Long id) {
    RawMaterial material = getRawMaterialById(id);
    if(material == null) {
      throw new NotFoundException("Raw material not found");
    }
    material.delete();
  }

}
