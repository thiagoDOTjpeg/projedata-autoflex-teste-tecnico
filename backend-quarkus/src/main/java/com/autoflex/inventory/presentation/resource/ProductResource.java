package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.ProductService;
import com.autoflex.inventory.domain.Product;
import com.autoflex.inventory.presentation.dto.ProductRequestDTO;
import com.autoflex.inventory.presentation.dto.ProductUpdateDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import com.autoflex.inventory.infrastructure.handlers.ProblemDetail;

import java.util.List;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Products", description = "Manage products and their materials")
public class ProductResource {

  @Inject
  ProductService productService;

  @GET
  @Operation(summary = "List all products", description = "Retrieves a list of all available products")
  @APIResponse(
          responseCode = "200",
          description = "List of products retrieved successfully",
          content = @Content(schema = @Schema(type = SchemaType.ARRAY, implementation = Product.class))
  )
  public Response listAll() {
    List<Product> products = productService.getAllProducts();
    return Response.status(Response.Status.OK).entity(products).build();
  }

  @GET
  @Path("/{id}")
  @Operation(summary = "Get a product by ID", description = "Retrieves a product by its unique identifier")
  @APIResponse(
          responseCode = "200",
          description = "Product retrieved successfully",
          content = @Content(schema = @Schema(implementation = Product.class))
  )
  public Response getById(@Parameter(description = "Product ID", required = true) @PathParam("id") Long id) {
    Product product = productService.getProductById(id);
    return Response.status(Response.Status.OK).entity(product).build();
  }

  @POST
  @Operation(summary = "Create a new product", description = "Creates a new product with materials")
  @APIResponse(
          responseCode = "201",
          description = "Product created successfully",
          content = @Content(schema = @Schema(implementation = Product.class))
  )
  @APIResponse(
          responseCode = "400",
          description = "Validation Error",
          content = @Content(schema = @Schema(implementation = ProblemDetail.class))
  )
  public Response create(@Valid ProductRequestDTO dto) {
    Product product = productService.saveProductWithMaterials(dto);
    return Response.status(Response.Status.CREATED).entity(product).build();
  }

  @PUT
  @Path("/{id}")
  @Operation(summary = "Update a product", description = "Updates an existing product with materials")
  @APIResponse(
          responseCode = "200",
          description = "Product updated successfully",
          content = @Content(schema = @Schema(implementation = Product.class))
  )
  @APIResponse(
          responseCode = "400",
          description = "Validation Error",
          content = @Content(schema = @Schema(implementation = ProblemDetail.class))
  )
  public Response update(
          @Parameter(description = "Product ID", required = true) @PathParam("id") Long id,
          @Valid ProductUpdateDTO dto) {
    Product product = productService.updateProductWithMaterials(id, dto);
    return Response.status(Response.Status.OK).entity(product).build();
  }

  @DELETE
  @Path("/{id}")
  @Operation(summary = "Delete a product", description = "Deletes a product by its ID")
  @APIResponse(
          responseCode = "204",
          description = "Product deleted successfully"
  )
  public Response delete(@Parameter(description = "Product ID", required = true) @PathParam("id") Long id) {
    productService.deleteProductById(id);
    return Response.noContent().build();
  }

}
