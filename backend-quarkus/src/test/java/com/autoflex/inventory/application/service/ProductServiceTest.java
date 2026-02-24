package com.autoflex.inventory.application.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class ProductServiceTest {
  @Inject
  ProductService productService;

  @Test
  void testCalculateProductSuggestion() {
  }
}
