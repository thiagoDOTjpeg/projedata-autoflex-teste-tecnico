package com.autoflex.inventory.presentation.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.Map;

@Path("/api/health")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Health", description = "Health check endpoints")
public class HealthResource {

  @GET
  @Operation(summary = "Health check", description = "Verifies if the API is running")
  @APIResponse(
          responseCode = "200",
          description = "API is up and running"
  )
  public Response healthCheck() {
    return Response.ok().entity("{\"status\": \"UP\"}").build();
  }

  @GET
  @Path("/whoami")
  @Operation(summary = "Get pod information", description = "Returns the pod or hostname where the API is running")
  @APIResponse(
          responseCode = "200",
          description = "Pod information retrieved successfully"
  )
  public Map<String, String> whoAmI() {
    return Map.of("pod", System.getenv().getOrDefault("HOSTNAME", "local-dev"));
  }
}
