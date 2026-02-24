package com.autoflex.inventory.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;

public record ProductRequestDTO(
        @NotBlank(message = "The product name cannot be empty")
        String name,

        @NotNull(message = "The price is mandatory")
        @Positive(message = "The price must be greater than zero")
        BigDecimal price,

        @NotEmpty(message = "The product must have at least one material")
        List<@Valid MaterialAmountDTO> materials
) {}