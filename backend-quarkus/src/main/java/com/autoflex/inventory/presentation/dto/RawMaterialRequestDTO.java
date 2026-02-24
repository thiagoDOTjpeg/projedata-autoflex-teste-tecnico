package com.autoflex.inventory.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record RawMaterialRequestDTO(
        @NotBlank(message = "The raw material name cannot be empty")
        String name,

        @NotNull(message = "The stock quantity is mandatory")
        @PositiveOrZero(message = "The stock quantity cannot be negative")
        Double stockQuantity
) {}