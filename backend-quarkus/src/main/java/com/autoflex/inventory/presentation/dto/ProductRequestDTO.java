package com.autoflex.inventory.presentation.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequestDTO(
        String name,
        BigDecimal price,
        List<MaterialAmountDTO> materials
) {
}
