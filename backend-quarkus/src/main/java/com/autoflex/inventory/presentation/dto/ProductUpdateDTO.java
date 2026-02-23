package com.autoflex.inventory.presentation.dto;

import java.math.BigDecimal;

public record ProductUpdateDTO(
        String name,
        BigDecimal price
) {
}
