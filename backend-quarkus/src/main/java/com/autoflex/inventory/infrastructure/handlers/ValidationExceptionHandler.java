package com.autoflex.inventory.infrastructure.handlers;

import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@Provider
public class ValidationExceptionHandler implements ExceptionMapper<ConstraintViolationException> {

  @Context
  UriInfo uriInfo;

  @Override
  public Response toResponse(ConstraintViolationException exception) {

    List<ProblemDetail.Violation> violations = exception.getConstraintViolations().stream()
            .map(cv -> new ProblemDetail.Violation(
                    cv.getPropertyPath().toString(),
                    cv.getMessage()
            ))
            .collect(Collectors.toList());

    ProblemDetail problem = new ProblemDetail(
            URI.create("https://autoflex.com/errors/validation-failed"),
            "Validation Error",
            Response.Status.BAD_REQUEST.getStatusCode(),
            "Your request contains invalid data. Please check the 'errors' list.",
            uriInfo.getAbsolutePath(),
            violations
    );

    return Response.status(Response.Status.BAD_REQUEST)
            .type("application/problem+json")
            .entity(problem)
            .build();
  }
}