describe('book appointment', () => {
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
            .type('testpassword')
            .should('have.value', 'testpassword');
        // Click login
        cy.get('[data-cy=login]').click();
        cy.wait(1500);
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

    it('Selected a service.', () => {
        // Map should be visible.
        cy.get('[data-cy=service_2]').click();
    });

    it('Select Book and Choose Dates', () => {
        //select the book button and opens up serviceWindow
        cy.get('[data-cy=book]').click();

        //checks to make sure provider, title are correct
        cy.get('[data-cy=title]').should('have.html', 'testservice3');
        cy.get('[data-cy=provider]').should('have.html', '@testuser1');

        //clicks on the date and opens up bookWindow
        cy.get('[data-cy=dates]').click();

        //checks to make sure title still matches from before
        cy.get('[data-cy=book-title]').should('have.html', 'testservice3');

        //clicks open to set the first available date
        cy.get('.MuiDialogActions-root > :nth-child(2)').click();

        //selects the appointment time and clicks on time 9:36 available time
        cy.get('[data-cy=appt-time]').click();
        cy.get('[data-value="11:30"]').click();

        //confirms selection and books appointment
        cy.get('[data-cy=confirm] > .MuiButton-label').click();
    });

    it('Displays service on calendar', () => {
        //navigate to appointments page and find the service
        cy.visit('http://localhost:3000/appointment');
        cy.contains('testservice3');

        cy.get('[data-cy=appointment_block]').click();
    });
});
