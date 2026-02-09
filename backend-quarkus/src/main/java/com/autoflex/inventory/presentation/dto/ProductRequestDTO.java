package com.autoflex.inventory.presentation.dto;

import java.util.List;

public record ProductRequestDTO(
        String name,
        Double price,
        List<MaterialAmountDTO> materials
) {
}
