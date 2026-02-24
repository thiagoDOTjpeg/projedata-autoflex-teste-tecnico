package com.autoflex.inventory.presentation.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductUpdateDTO(
        @Size(min = 1, message = "If provided, the name cannot be empty")
        String name,

        @Positive(message = "If provided, the price must be greater than zero")
        BigDecimal price
) {}