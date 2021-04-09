import 'cypress-file-upload';

describe('advertise past work', () => {
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
    });

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

    it('Upload an image from the user profile.', () => {
        cy.wait(1500);
        // Move to the user profile.
        cy.get('[data-cy=header_username]').click();

        cy.wait(1500);

        // Test uploading an imageboard picture.
        cy.get('[data-cy=upload-image]').click();
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
        cy.fixture('testPicture.png').then(fileContent => {
            cy.get('input[type="file"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: 'testPicture.png',
                mimeType: 'image/png',
            });
        });
        cy.wait(1500);
        cy.get('[data-cy=image-3]').should('be.visible');
    });
});
