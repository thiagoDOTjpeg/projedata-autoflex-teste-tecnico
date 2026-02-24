package com.autoflex.inventory.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ProductMaterialUpdateDTO(
        @NotNull(message = "The materials list cannot be null")
        @NotEmpty(message = "You must provide at least one material to update")
        List<@Valid MaterialAmountDTO> materials
) {}