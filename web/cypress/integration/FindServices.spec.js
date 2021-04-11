describe('find service on map', () => {
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
            '[data-cy=headerUsername] > .MuiButton-label > .MuiTypography-root'
        ).should('have.html', 'testuser2');
    });

    it('Find service on a map.', () => {
        //select an icon from the map by clicking
        cy.get('[tabindex="0"] > img').click();

        //close that service window
        cy.get('.gm-style-iw > .gm-ui-hover-effect').click();
    });

    it('Find service on a sidebar.', () => {
        //select an service on the sidebar by clicking
        cy.get('[data-cy=service-1]').click();

        //close that service window
        cy.get('.gm-style-iw > .gm-ui-hover-effect').click();

        //select another service from the side bar by clicking
        cy.get('[data-cy=service-2]').click();

        //close that service window
        cy.get('.gm-style-iw > .gm-ui-hover-effect').click();
    });
});
