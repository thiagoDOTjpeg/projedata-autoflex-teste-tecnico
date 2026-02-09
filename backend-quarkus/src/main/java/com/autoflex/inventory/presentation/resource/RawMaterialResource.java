package com.autoflex.inventory.presentation.resource;

import com.autoflex.inventory.domain.RawMaterial;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {
  @GET
  public List<RawMaterial> listAll(){
    return RawMaterial.listAll();
  }
}
