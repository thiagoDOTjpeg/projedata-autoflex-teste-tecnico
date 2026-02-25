package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.ProductMaterialService;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.domain.ProductMaterial;
import com.autoflex.inventory.presentation.dto.MaterialAmountDTO;
import com.autoflex.inventory.presentation.dto.ProductMaterialUpdateDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import com.autoflex.inventory.infrastructure.handlers.ProblemDetail;

import java.util.List;

@Path("/api/product-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Product Materials", description = "Manage materials in products")
public class ProductMaterialResource {

  @Inject
  ProductMaterialService productMaterialService;

  @POST
  @Path("/{productId}")
  @Operation(summary = "Add a material to a product", description = "Adds a new material to an existing product")
  @APIResponse(
          responseCode = "201",
          description = "Material added successfully",
          content = @Content(schema = @Schema(implementation = Product.class))
  )
  @APIResponse(
          responseCode = "400",
          description = "Validation Error",
          content = @Content(schema = @Schema(implementation = ProblemDetail.class))
  )
  public Response add(
          @Parameter(description = "Product ID", required = true) @PathParam("productId") Long productId,
          @Valid MaterialAmountDTO dto) {
    Product product = productMaterialService.addMaterialToProduct(productId, dto);
    return Response.status(Response.Status.CREATED).entity(product).build();
  }

  @PUT
  @Path("/{productId}")
  @Operation(summary = "Update a material in a product", description = "Updates material information for a product")
  @APIResponse(
          responseCode = "200",
          description = "Material updated successfully",
          content = @Content(schema = @Schema(implementation = ProductMaterial.class))
  )
  @APIResponse(
          responseCode = "400",
          description = "Validation Error",
          content = @Content(schema = @Schema(implementation = ProblemDetail.class))
  )
  public Response update(
          @Parameter(description = "Product ID", required = true) @PathParam("productId") Long productId,
          @Valid ProductMaterialUpdateDTO dto) {
    List<ProductMaterial> pm = productMaterialService.updateMaterialInProduct(productId, dto);
    return Response.status(Response.Status.OK).entity(pm).build();
  }

  @DELETE
  @Path("/{productId}/{materialId}")
  @Operation(summary = "Remove a material from a product", description = "Removes a specific material from a product")
  @APIResponse(
          responseCode = "204",
          description = "Material removed successfully"
  )
  public Response remove(
          @Parameter(description = "Product ID", required = true) @PathParam("productId") Long productId,
          @Parameter(description = "Material ID", required = true) @PathParam("materialId") Long materialId) {
    productMaterialService.removeMaterialFromProduct(productId, materialId);
    return Response.noContent().build();
  }
}
