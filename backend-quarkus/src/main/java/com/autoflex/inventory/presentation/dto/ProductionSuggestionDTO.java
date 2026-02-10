package com.autoflex.inventory.presentation.dto;

public record ProductionSuggestionDTO(
        String productName,
        Integer quantityToProduce,
        Double unitPrice,
        Double totalValue
) {
}
