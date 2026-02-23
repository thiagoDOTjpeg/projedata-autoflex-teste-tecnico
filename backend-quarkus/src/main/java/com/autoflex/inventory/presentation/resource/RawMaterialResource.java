package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.application.service.RawMaterialService;
import com.autoflex.inventory.domain.RawMaterial;
import com.autoflex.inventory.presentation.dto.RawMaterialRequestDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

  @Inject
  RawMaterialService rawMaterialService;

  @POST
  public Response create(RawMaterialRequestDTO dto) {
    RawMaterial material = rawMaterialService.saveRawMaterial(dto);
    return Response.status(Response.Status.CREATED).entity(material).build();
  }

  @GET
  public Response listAll(){
    List<RawMaterial> materials = rawMaterialService.getAllRawMaterials();
    return Response.status(Response.Status.OK).entity(materials).build();
  }

  @PUT
  @Path("/{id}")
  public Response update(Long id, RawMaterialRequestDTO dto) {
    RawMaterial material = rawMaterialService.updateRawMaterial(id, dto);
    return Response.status(Response.Status.CREATED).entity(material).build();
  }

  @GET
  @Path("/{id}")
  public Response getById(Long id) {
    RawMaterial material = rawMaterialService.getRawMaterialById(id);
    return Response.status(Response.Status.OK).entity(material).build();
  }

  @DELETE
  @Path("/{id}")
  public Response delete(Long id) {
    rawMaterialService.deleteRawMaterialById(id);
    return Response.noContent().build();
  }

}
