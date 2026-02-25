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

import java.util.List;

@Path("/api/product-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductMaterialResource {

  @Inject
  ProductMaterialService productMaterialService;

  @POST
  @Path("/{productId}")
  public Response add(Long productId, @Valid MaterialAmountDTO dto) {
    Product product = productMaterialService.addMaterialToProduct(productId, dto);
    return Response.status(Response.Status.CREATED).entity(product).build();
  }

  @PUT
  @Path("/{productId}")
  public Response update(Long productId, @Valid ProductMaterialUpdateDTO dto) {
    List<ProductMaterial> pm = productMaterialService.updateMaterialInProduct(productId, dto);
    return Response.status(Response.Status.OK).entity(pm).build();
  }

  @DELETE
  @Path("/{productId}/{materialId}")
  public Response remove(Long productId, Long materialId) {
    productMaterialService.removeMaterialFromProduct(productId, materialId);
    return Response.noContent().build();
  }
}
