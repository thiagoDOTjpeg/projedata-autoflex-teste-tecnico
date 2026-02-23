package com.autoflex.inventory.presentation.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {

  @GET
  public Response healthCheck() {
    return Response.ok().entity("{\"status\": \"UP\"}").build();
  }

  @GET
  @Path("/whoami")
  public Map<String, String> whoAmI() {
    return Map.of("pod", System.getenv().getOrDefault("HOSTNAME", "local-dev"));
  }
}
