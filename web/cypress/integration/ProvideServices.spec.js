describe('Provide service', () => {

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('username');
    });
    it('Registers a test account.', () => {
        cy.visit('http://localhost:3000/');
        cy.clearCookies();

        // Fill in a new user registration form to create a test user.
        cy.get('[data-cy=signup]').click();

        cy.get('[data-cy=signup_first_name]')
            .type('TestFirstName')
            .should('have.value', 'TestFirstName');

        cy.get('[data-cy=signup_last_name]')
            .type('TestLastName')
            .should('have.value', 'TestLastName');

        cy.get('[data-cy=signup_username]')
            .type('TestUsername')
            .should('have.value', 'TestUsername');

        cy.get('[data-cy=signup_password]')
            .type('TestPassword')
            .should('have.value', 'TestPassword');

        cy.get('[data-cy=signup_confirm_password]')
            .type('TestPassword')
            .should('have.value', 'TestPassword');

            
        cy.get('[data-cy=create_account_button]').click();
        cy.wait(1500);
    })

    // Note: until this bug is fixed, this login section is necessary.
    // Logging in should not be necessary when an account is created,
    // since Servus automatically logs into newly created accounts.

    it('Logs into the test account.', () => {
        cy.get('[data-cy=header_username]').click();

        cy.get('[data-cy=username]')
            .type('TestUsername')
            .should('have.value', 'TestUsername');
        cy.get('[data-cy=password]')
            .type('TestPassword')
            .should('have.value', 'TestPassword');
        // Click login
        cy.get('[data-cy=login]').click();
    });

    it('Loads the home page.', () => {
        // Map should be visible.
        cy.get('[data-cy=map]').should('be.visible');

        // Username on the header should match one used.
        cy.get('[data-cy=header_username] > .MuiButton-label > .MuiTypography-root')
            .should('have.html', 'TestUsername');

        // Move to the user profile.
        cy.get('[data-cy=header_username]').click();
    })

    it('Adds a new service.', () => {
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
            .click().focused().type('66 Chan{downarrow}{enter}', {delay: 300});
        
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
        cy.get('[data-value="Performance"]').click()
            .type('{esc}'); // Exit out of the tags select.

        // Submit and add to db.
        cy.get('[data-cy=submit_add_service]').click();
    });
});
