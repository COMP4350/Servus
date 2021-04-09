describe('book appointment', () => {
    it('Logs into the test account.', () => {
        cy.visit('http://localhost:3000/');
        cy.clearCookies();

        cy.get('[data-cy=username]')
            .type('zimbakor')
            .should('have.value', 'zimbakor');

        cy.get('[data-cy=password]')
            .type('zimbakor')
            .should('have.value', 'zimbakor');

        // Click login
        cy.get('[data-cy=login]').click();
    });

    it('Loads the home page.', () => {
        // Map should be visible.
        cy.get('[data-cy=map]').should('be.visible');

        // Username on the header should match one used.
        cy.get('[data-cy=header_username] > .MuiButton-label > .MuiTypography-root')
            .should('have.html', 'zimbakor');

    })

    it('Selected a service.', () => {
        // Map should be visible.
        cy.get('[data-cy=service_2]').click();
    })

    it('Select Book and Choose Dates', () => {
        
        //select the book button and opens up serviceWindow
        cy.get('[data-cy=book]').click();

        //checks to make sure provider, title are correct
        cy.get('[data-cy=title]').should('have.html', "Chef Risto's Quick Eats!");
        cy.get('[data-cy=provider]').should('have.html', '@zimbakor');

        //clicks on the date and opens up bookWindow
        cy.get('[data-cy=dates]').click();

        //checks to make sure title still matches from before
        cy.get('[data-cy=book-title]').should('have.html', "Chef Risto's Quick Eats!");

        //clicks open to set the first available date
        cy.get('.MuiDialogActions-root > :nth-child(2)').click();

        //selects the appointment time and clicks on time 9:36 available time 
        cy.get('[data-cy=appt-time]').click();
        cy.get('[data-value="09:36"]').click();

        //confirms selection and books appointment
        cy.get('[data-cy=confirm] > .MuiButton-label').click();
    })

});