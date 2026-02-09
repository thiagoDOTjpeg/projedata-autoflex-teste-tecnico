package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.ProductService;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
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
  public List<Product> listAll() {
    return productService.getAllProducts();
  }

  @POST
  @Transactional
  public Response create(ProductRequestDTO dto) {
    Product product = productService.saveProductWithMaterials(dto);
    return Response.status(Response.Status.CREATED).entity(product).build();
  }

  @PUT
  @Path("/{id}")
  @Transactional
  public Response update(Long id, ProductRequestDTO dto) {
    Product product = productService.updateProductWithMaterials(id, dto);
    return Response.status(Response.Status.OK).entity(product).build();
  }

  @DELETE
  @Path("/{id}")
  @Transactional
  public Response delete(Long id) {
    productService.deleteProductById(id);
    return Response.noContent().build();
  }

}
