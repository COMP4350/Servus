import 'cypress-file-upload';

describe('advertise past work', () => {
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

    it('Moves to the user profile', () => {
        // Move to the user profile.
        cy.get('[data-cy=header_username]').click();
    });

    it('Upload an image from the user profile.', () => {
        cy.wait(1500);

        // Test uploading an imageboard picture.
        cy.fixture('testPicture.png').then(fileContent => {
            cy.get('input[type="file"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: 'testPicture.png',
                mimeType: 'image/png',
            });
        });
        cy.wait(1500);
        cy.get('[data-cy=image-0]').should('be.visible');
        cy.fixture('testPicture.png').then(fileContent => {
            cy.get('input[type="file"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: 'testPicture.png',
                mimeType: 'image/png',
            });
        });
        cy.wait(1500);
        cy.get('[data-cy=image-1]').should('be.visible');
        cy.fixture('testPicture.png').then(fileContent => {
            cy.get('input[type="file"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: 'testPicture.png',
                mimeType: 'image/png',
            });
        });
        cy.wait(1500);
        cy.get('[data-cy=image-2]').should('be.visible');
    });
});
