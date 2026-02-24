package com.autoflex.inventory.presentation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MaterialAmountDTO(
        @NotNull(message = "Material ID is required")
        Long materialId,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than zero")
        Double quantity
) {}
