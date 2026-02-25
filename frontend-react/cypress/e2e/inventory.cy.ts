/// <reference types="cypress" />

describe('Industrial Inventory System - E2E & Integration', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/raw-materials*').as('getRawMaterials');
    cy.intercept('POST', '**/raw-materials').as('createRawMaterial');
    cy.intercept('DELETE', '**/raw-materials/*').as('deleteRawMaterial');

    cy.intercept('GET', '**/products*').as('getProducts');
    cy.intercept('POST', '**/products').as('createProduct');
    cy.intercept('DELETE', '**/products/*').as('deleteProduct');

    cy.intercept('GET', '**/production/suggestions*').as('getSuggestions');

    cy.visit('/');
  });

  const getDynamicNames = () => {
    const timestamp = Date.now();
    return {
      materialName: `Material_${timestamp}`,
      productName: `Product_${timestamp}`
    };
  };

  it("Happy Path: Create material, product and validate production suggestion", () => {
    const { materialName, productName } = getDynamicNames();

    cy.get('[role="tab"]').contains('Raw Materials').click();
    cy.wait('@getRawMaterials');

    cy.contains('button', 'New Raw Material').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="name"]').type(materialName);
      cy.get('input[name="stockQuantity"]').type('100');
      cy.contains('button[type="submit"]', 'Create').click();
    });

    cy.wait('@createRawMaterial').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.get('[data-sonner-toast]').contains('successfully').should('be.visible');

    cy.get('[role="tab"]').contains('Products').click();
    cy.wait('@getProducts');

    cy.contains('button', 'New Product').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="name"]').type(productName);
      cy.get('input[name="price"]').clear().type('500');

      cy.get('select#material').find('option').contains(materialName).then((option) => {
        cy.get('select#material').select(option.val() as string);
      });
      cy.get('input#quantity').type('10');
      cy.contains('button', 'Add').click();

      cy.get('table').contains('td', materialName).should('be.visible');

      cy.contains('button[type="submit"]', 'Create Product').click();
    });

    cy.wait('@createProduct').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.get('[data-sonner-toast]').contains('successfully').should('be.visible');

    cy.get('[role="tab"]').contains('Production').click();
    cy.wait('@getSuggestions');

    cy.contains('td', productName).should('be.visible');
    cy.contains('td', productName)
      .parent('tr')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', '10');
      });
  });

  it("Edge Case Error (Integration): Validate RFC 7807 Error flow on Form", () => {
    cy.intercept('POST', '**/raw-materials', {
      statusCode: 400,
      headers: {
        'content-type': 'application/problem+json',
      },
      body: {
        title: 'Validation Error',
        status: 400,
        detail: 'Field value cannot be accepted',
        errors: [
          {
            field: 'name',
            message: 'Must not be blank',
          },
        ],
      },
    }).as('createRawMaterialError');

    cy.get('[role="tab"]').contains('Raw Materials').click();
    cy.wait('@getRawMaterials');

    cy.contains('button', 'New Raw Material').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="name"]').type('   ');
      cy.get('input[name="stockQuantity"]').type('50');
      cy.contains('button[type="submit"]', 'Create').click();
    });

    cy.wait('@createRawMaterialError').its('response.statusCode').should('eq', 400);

    cy.get('[role="dialog"]').within(() => {
      cy.contains('Must not be blank').should('be.visible');
    });
  });

  it("Persistence Test: Verify data is restored correctly after a refresh", () => {
    cy.get('[role="tab"]').contains('Raw Materials').click();
    cy.wait('@getRawMaterials');

    cy.get('table tbody tr').should('have.length.greaterThan', 0);

    cy.reload();
    cy.get('[role="tab"]').contains('Raw Materials').click();
    cy.wait('@getRawMaterials');

    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it("Consistency Test: Verify Delete Cascade on associated entities", () => {
    const { materialName, productName } = getDynamicNames();

    cy.get('[role="tab"]').contains('Raw Materials').click();
    cy.wait('@getRawMaterials');

    cy.contains('button', 'New Raw Material').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="name"]').type(materialName);
      cy.get('input[name="stockQuantity"]').type('200');
      cy.contains('button[type="submit"]', 'Create').click();
    });

    cy.wait('@createRawMaterial').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.get('[role="tab"]').contains('Products').click();
    cy.wait('@getProducts');

    cy.contains('button', 'New Product').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="name"]').type(productName);
      cy.get('input[name="price"]').clear().type('300');

      cy.get('select#material').find('option').contains(materialName).then((option) => {
        cy.get('select#material').select(option.val() as string);
      });
      cy.get('input#quantity').type('5');
      cy.contains('button', 'Add').click();

      cy.contains('button[type="submit"]', 'Create Product').click();
    });

    cy.wait('@createProduct').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.get('[role="tab"]').contains('Raw Materials').click();
    cy.wait('@getRawMaterials');

    cy.contains('tr', materialName).within(() => {
      cy.get('button[aria-label*="Delete"]').click();
    });

    cy.get('[role="dialog"]').within(() => {
      cy.contains('button', 'Delete').click();
    });

    cy.wait('@deleteRawMaterial').its('response.statusCode').should('be.oneOf', [200, 204]);

    cy.get('[role="tab"]').contains('Production').click();
    cy.wait('@getSuggestions');

    cy.contains('td', productName).should('not.exist');
  });
});
