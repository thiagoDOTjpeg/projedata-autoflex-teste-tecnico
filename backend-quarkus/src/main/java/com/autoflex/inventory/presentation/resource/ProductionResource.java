package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.ProductService;
import com.autoflex.inventory.presentation.dto.ProductionSuggestionDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;

@Path("/api/production")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Production", description = "Get production suggestions")
public class ProductionResource {

  @Inject
  ProductService productService;

  @GET
  @Path("/suggestions")
  @Operation(summary = "Get production suggestions", description = "Retrieves production suggestions based on inventory levels")
  @APIResponse(
          responseCode = "200",
          description = "Production suggestions retrieved successfully",
          content = @Content(schema = @Schema(implementation = ProductionSuggestionDTO.class))
  )
  public List<ProductionSuggestionDTO> getProductionSuggestions() {
    return productService.getProductionSuggestions();
  }
}
