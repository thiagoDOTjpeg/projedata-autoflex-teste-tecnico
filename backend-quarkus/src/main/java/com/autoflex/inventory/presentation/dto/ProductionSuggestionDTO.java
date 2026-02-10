package com.autoflex.inventory.presentation.dto;

import java.math.BigDecimal;

public record ProductionSuggestionDTO(
        String productName,
        Integer quantityToProduce,
        BigDecimal unitPrice,
        BigDecimal totalValue
) {
}
