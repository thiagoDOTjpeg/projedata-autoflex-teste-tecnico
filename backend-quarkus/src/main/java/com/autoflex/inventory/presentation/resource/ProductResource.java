package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.ProductService;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import com.autoflex.inventory.presentation.dto.ProductUpdateDTO;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

  @Inject
  ProductService productService;

  @GET
  public Response listAll() {
    List<Product> products = productService.getAllProducts();
    return Response.status(Response.Status.OK).entity(products).build();
  }

  @GET
  @Path("/{id}")
  public Response getById(Long id) {
    Product product = productService.getProductById(id);
    return Response.status(Response.Status.OK).entity(product).build();
  }

  @POST
  public Response create(@Valid ProductRequestDTO dto) {
    Product product = productService.saveProductWithMaterials(dto);
    return Response.status(Response.Status.CREATED).entity(product).build();
  }

  @PUT
  @Path("/{id}")
  public Response update(Long id, @Valid ProductUpdateDTO dto) {
    Product product = productService.updateProductWithMaterials(id, dto);
    return Response.status(Response.Status.OK).entity(product).build();
  }

  @DELETE
  @Path("/{id}")
  public Response delete(Long id) {
    productService.deleteProductById(id);
    return Response.noContent().build();
  }

}
