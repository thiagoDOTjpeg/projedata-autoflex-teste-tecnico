package com.autoflex.inventory.presentation.dto;

public record RawMaterialRequestDTO(
        String name,
        Double stockQuantity
) {
}
