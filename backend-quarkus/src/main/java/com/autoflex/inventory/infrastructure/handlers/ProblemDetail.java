package com.autoflex.inventory.infrastructure.handlers;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.net.URI;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProblemDetail(
        URI type,
        String title,
        int status,
        String detail,
        URI instance,
        List<Violation> errors
) {
  public record Violation(String field, String message) {}
}