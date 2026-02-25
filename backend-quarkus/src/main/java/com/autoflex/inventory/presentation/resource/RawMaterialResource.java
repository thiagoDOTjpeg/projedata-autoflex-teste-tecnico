package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.RawMaterialService;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.infrastructure.handlers.ProblemDetail;
import com.autoflex.inventory.presentation.dto.RawMaterialRequestDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;

import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Raw Materials", description = "Manage raw materials")
public class RawMaterialResource {

  @Inject
  RawMaterialService rawMaterialService;

  @POST
  @Operation(summary = "Create a new raw material", description = "Creates a new raw material with the provided data")
  @APIResponse(
          responseCode = "201",
          description = "Material Created",
          content = @Content(schema = @Schema(implementation = RawMaterial.class))
  )
  @APIResponse(
          responseCode = "400",
          description = "Validation Error",
          content = @Content(schema = @Schema(implementation = ProblemDetail.class))
  )
  public Response create(@Valid RawMaterialRequestDTO dto) {
    RawMaterial material = rawMaterialService.saveRawMaterial(dto);
    return Response.status(Response.Status.CREATED).entity(material).build();
  }

  @GET
  @Operation(summary = "List all raw materials", description = "Retrieves a list of all available raw materials")
  @APIResponse(
          responseCode = "200",
          description = "List of materials retrieved successfully",
          content = @Content(schema = @Schema(type = SchemaType.ARRAY, implementation = RawMaterial.class))
  )
  public Response listAll(){
    List<RawMaterial> materials = rawMaterialService.getAllRawMaterials();
    return Response.status(Response.Status.OK).entity(materials).build();
  }

  @PUT
  @Path("/{id}")
  @Operation(summary = "Update a raw material", description = "Updates an existing raw material by ID")
  @APIResponse(
          responseCode = "200",
          description = "Material updated successfully",
          content = @Content(schema = @Schema(implementation = RawMaterial.class))
  )
  @APIResponse(
          responseCode = "400",
          description = "Validation Error",
          content = @Content(schema = @Schema(implementation = ProblemDetail.class))
  )
  public Response update(
          @Parameter(description = "Material ID", required = true) @PathParam("id") Long id,
          @Valid RawMaterialRequestDTO dto) {
    RawMaterial material = rawMaterialService.updateRawMaterial(id, dto);
    return Response.status(Response.Status.OK).entity(material).build();
  }

  @GET
  @Path("/{id}")
  @Operation(summary = "Get a raw material by ID", description = "Retrieves a raw material by its unique identifier")
  @APIResponse(
          responseCode = "200",
          description = "Material retrieved successfully",
          content = @Content(schema = @Schema(implementation = RawMaterial.class))
  )
  public Response getById(@Parameter(description = "Material ID", required = true) @PathParam("id") Long id) {
    RawMaterial material = rawMaterialService.getRawMaterialById(id);
    return Response.status(Response.Status.OK).entity(material).build();
  }

  @DELETE
  @Path("/{id}")
  @Operation(summary = "Delete a raw material", description = "Deletes a raw material by its ID")
  @APIResponse(
          responseCode = "204",
          description = "Material deleted successfully"
  )
  public Response delete(@Parameter(description = "Material ID", required = true) @PathParam("id") Long id) {
    rawMaterialService.deleteRawMaterialById(id);
    return Response.noContent().build();
  }

}
