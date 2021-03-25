describe('find service on map', () => {
    it('visits the page', () => {
        cy.visit('http://localhost:3000/');
    });
    it('enters location', () => {
        cy.get('.makeStyles-addressContainer-10').type('Winnipeg');
        cy.get('#root').click();
        cy.get('#search-address').click();
    });
});
