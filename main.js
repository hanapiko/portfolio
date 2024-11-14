document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    // Add click event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Get the target section ID
            const target = link.getAttribute('data-target');

            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'none';
            });

            // Show the selected section
            document.getElementById(target).style.display = 'block';
        });
    });

    // Wait for the DOM to be ready before handling input events
    const emailInput = document.querySelector('#email');
    let debounceTimer;  // Timer to delay validation

    // Add input event listener for email input
    emailInput.addEventListener('input', function(event) {
        clearTimeout(debounceTimer);  // Clear the previous debounce timer

        // Set a new timer for debouncing
        debounceTimer = setTimeout(() => {
            validateEmailAsync(event.target.value);  // Call validation function
        }, 500);  // 500ms delay after the user stops typing
    });

    async function validateEmailAsync(email) {
        console.log('Validating email:', email);
        
        try {
            const response = await fetch(`/validate-email?email=${email}`);  // Example API call
            const result = await response.json();
            if (result.isValid) {
                console.log('Email is valid');
            } else {
                console.log('Email is invalid');
            }
        } catch (error) {
            console.error('Error validating email:', error);
        }
    }

    // Select the form element
    const form = document.getElementById('contact-form');

    // Select the response div where we show the success or error message
    const messageResponse = document.getElementById('message-response');

    // Add an event listener for form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Create a FormData object to easily collect form values
        const formData = new FormData(form);
        
        // Convert FormData into a plain object (optional)
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send the data to the backend using fetch
        try {
            const response = await fetch('https://contact-form-backend-lalec9onb-hanapikos-projects.vercel.app/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // We send data as JSON
                },
                body: JSON.stringify(data),  // Send the form data as a JSON string
            });

            const result = await response.json();  // Parse the JSON response from the server

            // Show success or error message based on the response
            if (result.success) {
                messageResponse.innerHTML = "<p>Your message has been sent successfully!</p>";
                messageResponse.style.color = "green"; // Green for success
            } else {
                messageResponse.innerHTML = "<p>There was an error sending your message. Please try again later.</p>";
                messageResponse.style.color = "red";  // Red for error
            }
        } catch (error) {
            // If there's an error in the request, show an error message
            console.error("Error:", error);
            messageResponse.innerHTML = "<p>There was an error submitting your message. Please try again.</p>";
            messageResponse.style.color = "red";  // Red for error
        }
    });
});
