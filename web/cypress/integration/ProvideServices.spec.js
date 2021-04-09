describe('add service', () => {

    // cy.viewport('1280, 720');

    it('visits the page', () => {
        cy.visit('http://localhost:3000/');

        cy.get('[data-cy=username]')
            .type('andy')
            .should('have.value', 'andy');

        cy.get('[data-cy=password]')
            .type('andy')
            .should('have.value', 'andy')

        // Click login
        cy.get('[data-cy=login]').click()

        // Map should be visible.
        cy.get('[data-cy=map]').should('be.visible');

        // Username on the header should match one used.
        cy.get('[data-cy=header_username] > .MuiButton-label > .MuiTypography-root')
            .should('have.html', 'andy');

        //cy.getByLabelText('andy').should('exist');

        // Move to the user profile.
        cy.get('[data-cy=header_username]').click();

        // Click on the Add Service button.
        cy.get('[data-cy=add_new_service_div]').click();

        // Fill in the service name, description, and cost.
        cy.get('[data-cy=service_name]')
            .type('Cypress Service Name');

        cy.get('[data-cy=service_description]')
            .type('Cypress Service Description');

        cy.get('[data-cy=service_cost]')
            .type('404 Cypress Test Dollars');

        // Change the duration (e.g., to 20 minutes).
        cy.get('[data-cy=service_duration]').click();
        cy.get('[data-value="20 minutes"]').click();

        // Utilize the autocomplete to fill a test location (e.g., the University of Manitoba).
        cy.get('[data-cy=search_address]')
            .click().focused().type('66 Chan{downarrow}{enter}', {delay: 250});
        
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
        cy.get('[data-value="Performance"]').click();

    });

    // Create an account


    // Log in


    // Add a service
    //cy.get('[data-cy=service_name]').click()

    // 
});
