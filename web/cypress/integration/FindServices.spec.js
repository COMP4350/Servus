describe('find service on map', () => {
    it('Logs into the test account.', () => {
        cy.visit('/');
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
        cy.get(
            '[data-cy=header_username] > .MuiButton-label > .MuiTypography-root'
        ).should('have.html', 'zimbakor');
    });

    it('Find service on a map.', () => {
        //select an icon from the map by clicking
        cy.get('[tabindex="0"] > img').click();

        //close that service window
        cy.get('.gm-style-iw > .gm-ui-hover-effect').click();
    });

    it('Find service on a sidebar.', () => {
        //select an service on the sidebar by clicking
        cy.get('[data-cy=service_4]').click();

        //close that service window
        cy.get('.gm-style-iw > .gm-ui-hover-effect').click();

        //select another service from the side bar by clicking
        cy.get('[data-cy=service_5]').click();

        //close that service window
        cy.get('.gm-style-iw > .gm-ui-hover-effect').click();
    });
});
