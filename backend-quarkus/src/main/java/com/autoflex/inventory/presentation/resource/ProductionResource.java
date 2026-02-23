package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.ProductService;
import com.autoflex.inventory.presentation.dto.ProductionSuggestionDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

  @Inject
  ProductService productService;

  @GET
  @Path("/suggestions")
  public List<ProductionSuggestionDTO> getProductionSuggestions() {
    return productService.getProductionSuggestions();
  }
}
