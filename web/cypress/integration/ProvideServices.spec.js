describe('Provide service', () => {
    before(() => {
        cy.clearCookies();

        cy.request('http://localhost:5000/test/empty');
        cy.request('http://localhost:5000/test/fill');
        cy.wait(1000);
        cy.visit('/');

        cy.get('[data-cy=username]')
            .type('testuser2')
            .should('have.value', 'testuser2');
        cy.get('[data-cy=password]')
            .type('testPassword')
            .should('have.value', 'testPassword');
        // Click login
        cy.get('[data-cy=login]').click();
    });
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('username');
    });

    it('Loads the home page.', () => {
        // Map should be visible.
        cy.get('[data-cy=map]').should('be.visible');

        // Username on the header should match one used.
        cy.get(
            '[data-cy=header_username] > .MuiButton-label > .MuiTypography-root'
        ).should('have.html', 'testuser2');
    });

    it('Moves to the user profile', () => {
        // Move to the user profile.
        cy.get('[data-cy=header_username]').click();
    });

    it('Adds a new service.', () => {
        // Click on the Add Service button.
        cy.get('[data-cy=add_new_service_div]').click();

        // Fill in the service name, description, and cost.
        cy.get('[data-cy=service_name]').type('Cypress Service Name');

        cy.get('[data-cy=service_description]').type(
            'Cypress Service Description'
        );

        cy.get('[data-cy=service_cost]').type('404 Cypress Test Dollars');

        // Change the duration (e.g., to 20 minutes).
        cy.get('[data-cy=service_duration]').click();
        cy.get('[data-value="20 minutes"]').click();

        // Utilize the autocomplete to fill a test location (e.g., the University of Manitoba).
        cy.get('[data-cy=search_address]')
            .click()
            .focused()
            .type('66 Chan{downarrow}{enter}', { delay: 300 });

        // Fill some availabilities. E.g., fill Tuesday, Wednesday, and Saturday.

        // Tuesday
        cy.get('[data-cy=weekday_button_2]').click();
        cy.get('[data-cy=add_availability_button]').click();
        cy.get('[data-cy=availability_start_0]').click().type('08:00');
        cy.get('[data-cy=availability_end_0]').click().type('16:00');

        // Wednesday
        cy.get('[data-cy=weekday_button_3]').click();
        cy.get('[data-cy=add_availability_button]').click();
        cy.get('[data-cy=availability_start_0]').click().type('09:00');
        cy.get('[data-cy=availability_end_0]').click().type('17:00');

        // Saturday
        cy.get('[data-cy=weekday_button_6]').click();
        cy.get('[data-cy=add_availability_button]').click();
        cy.get('[data-cy=availability_start_0]').click().type('07:00');
        cy.get('[data-cy=availability_end_0]').click().type('15:00');

        // Set three tags.
        cy.get('[data-cy=service_tags]').click();
        cy.get('[data-value="Construction"]').click();
        cy.get('[data-value="Lessons"]').click();
        cy.get('[data-value="Performance"]').click().type('{esc}'); // Exit out of the tags select.

        // Submit and add to db.
        cy.get('[data-cy=submit_add_service]').click();
    });

    it('Contains the newly-added service', () => {
        cy.wait(2000);
        // Check that the service appears on the side.
        cy.contains('Cypress Service Name');
    });
});
