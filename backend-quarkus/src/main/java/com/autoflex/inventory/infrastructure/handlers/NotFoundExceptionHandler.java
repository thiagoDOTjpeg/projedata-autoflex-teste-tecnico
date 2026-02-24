package com.autoflex.inventory.infrastructure.handlers;

import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.net.URI;

@Provider
public class NotFoundExceptionHandler implements ExceptionMapper<NotFoundException> {

  @Context
  UriInfo uriInfo;

  @Override
  public Response toResponse(NotFoundException exception) {
    ProblemDetail problem = new ProblemDetail(
            URI.create("https://autoflex.com/errors/not-found"),
            "Resource Not Found",
            Response.Status.NOT_FOUND.getStatusCode(),
            exception.getMessage(),
            uriInfo.getAbsolutePath(),
            null
    );

    return Response.status(Response.Status.NOT_FOUND)
            .type("application/problem+json")
            .entity(problem)
            .build();
  }
}