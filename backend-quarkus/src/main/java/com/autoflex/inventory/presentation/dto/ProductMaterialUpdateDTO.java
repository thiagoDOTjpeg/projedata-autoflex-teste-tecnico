package com.autoflex.inventory.presentation.dto;

import java.util.List;

public record ProductMaterialUpdateDTO(
        List<MaterialAmountDTO> materials
) {
}
