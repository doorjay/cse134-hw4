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


    // ERROR LOGGER
    const errorLogField = document.querySelector('#form-errors-field');

    function logError(field, message) {
        form_errors.push({
            field: field.name || field.id,
            value: field.value,
            message: message,
            time: new Date().toISOString()
        });
    }



    // MASKING
    // prevent illegal characters based on pattern
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

            logError(nameField, "Illegal character typed");
        }
    });


    // Character count warning in message field
    const charCountSpan = document.querySelector('#char-count');
    const maxChars = messageField.maxLength;

    function updateCharacterCount() {
        const currentLength = messageField.value.length;
        const remaining = maxChars - currentLength;

        // Update the label's inline countdown
        charCountSpan.textContent = `(${remaining} left)`;

        // Warning when near limit
        if (remaining <= 50) {
            charCountSpan.style.color = "crimson";
            charCountSpan.style.fontWeight = "600";
        } else {
            charCountSpan.style.color = "";
            charCountSpan.style.fontWeight = "";
        }

        // Prevent exceeding the limit (copy/paste)
        if (currentLength > maxChars) {
            messageField.value = messageField.value.slice(0, maxChars);
        }
    }

    // Update on input
    messageField.addEventListener('input', updateCharacterCount);

    // Show initial value on load
    updateCharacterCount();


    // VALIDATION
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
            if (!field.checkValidity()) {
                logError(field, field.validationMessage);
            }
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

            [nameField, emailField, messageField].forEach(field => {
                if (!field.checkValidity()) {
                    logError(field, field.validationMessage);
                }
            });

            showFirstErrorMessage();
        }

        // if form is valid, save error history into hidden field
        if (errorLogField) {
            errorLogField.value = JSON.stringify(form_errors);
        }

    });

}

function setupThemeToggle() {
    const toggle = document.querySelector('#theme-toggle'); 
    if (!toggle) return; 

    const savedTheme = localStorage.getItem('preferred-theme');

    if (savedTheme === 'dark') {
        toggle.checked = true; 
    }
    else if (savedTheme === 'light') {
        toggle.checked = false;
    }

    toggle.addEventListener('change', () => {
        const theme = toggle.checked ? 'dark' : 'light';
        localStorage.setItem('preferred-theme', theme);
    });
}

function setupViewTransions() {

}