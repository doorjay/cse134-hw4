// global array to track all errors across attempts
const form_errors = []; 

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupViewTransions();
    setupContactFormJS();
}); 

// Contact Form Validation
function setupContactFormJS() {
    const form = document.querySelector('#contact-form'); 
    if (!form) return; // Not on the JS form page

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email'); 
    const messageField = form.querySelector('#message'); 
    const errorOutput = form.querySelector('#error-output');
    const infoOutput = form.querySelector('#info-output');

    // reset output initially
    if (errorOutput) errorOutput.textContent = '';
    if (infoOutput) infoOutput.textContent = '';

    // masking to prevent illegal characters based on pattern
    nameField.addEventListener('input', () => {
        const pattern = new RegExp(nameField.pattern);
        const value = nameField.value;

        // If the whole value no longer matches the allowed pattern
        if (!pattern.test(value)) {
            // Remove the last typed character
            nameField.value = value.slice(0, -1);

            // Flash field (visual feedback)
            nameField.classList.add('field-flash');
            setTimeout(() => {
                nameField.classList.remove('field-flash');
            }, 200);

            // Show message
            errorOutput.textContent = "Only letters, spaces, hyphens, and apostrophes are allowed.";
        }
    });

    // Helper to set a custom message based on validity state
    function setMessageForField(field) {
        field.setCustomValidity(''); // clear old message

        if (field === nameField) {
            if (field.validity.valueMissing) {
                field.setCustomValidity('Please enter your name.');
            }
            else if (field.validity.tooShort) {
                field.setCustomValidity('Name must be at least 2 characters long.'); 
            }
        }

        if (field === emailField) {
            if (field.validity.valueMissing) {
                field.setCustomValidity('Email is required.');
            }
            else if (field.validity.tooShort) {
                field.setCustomValidity('Please enter a valid email adress.'); 
            }
        }

        if (field === messageField) {
            if (field.validity.valueMissing) {
                field.setCustomValidity('Please enter a message.');
            }
            else if (field.validity.tooShort) {
                field.setCustomValidity('Message is too short. Please write a bit more.'); 
            }
        }
    }

    // Helper to show the message for the first invalid field in errorOutput
    function showFirstErrorMessage() {
        if (!errorOutput) return;

        // Order matters: name → email → message
        const fields = [nameField, emailField, messageField];

        for (const field of fields) {
            if (!field.checkValidity()) {
                errorOutput.textContent = field.validationMessage;
                return;
            }
        }   

        // If everything is valid, clear the error area
        errorOutput.textContent = '';
    }

    // Validate each field when it loses focus
    [nameField, emailField, messageField].forEach(field => {
        field.addEventListener('blur', () => {
            setMessageForField(field);
            field.checkValidity();
            showFirstErrorMessage();
        });

        // Also respond while typing (so messages go away as they fix issues)
        field.addEventListener('input', () => {
            setMessageForField(field);
            field.checkValidity();
            showFirstErrorMessage();
        });
    });

    // Handle submit
    form.addEventListener('submit', (event) => {
        // Make sure all fields get their custom messages
        [nameField, emailField, messageField].forEach(setMessageForField);

        // If form is invalid, prevent submit and show first error
        if (!form.checkValidity()) {
            event.preventDefault();
            showFirstErrorMessage();
        }

    });

}

function setupThemeToggle() {

}

function setupViewTransions() {

}