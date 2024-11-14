// Wait for the DOM to be ready before adding event listeners
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
});

// Select the form element
const form = document.getElementById('contact-form');

// Select the response div where we show the success or error message
const messageResponse = document.getElementById('message-response');

// Add an event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Create a FormData object to easily collect form values
    const formData = new FormData(form);
    
    // Convert FormData into a plain object (optional)
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send the data to the backend using fetch
    fetch('https://contact-form-backend-lalec9onb-hanapikos-projects.vercel.app/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // We send data as JSON
        },
        body: JSON.stringify(data),  // Send the form data as a JSON string
    })
    .then(response => response.json())  // Parse the JSON response from the server
    .then(data => {
        // Show success or error message based on the response
        if (data.success) {
            messageResponse.innerHTML = "<p>Your message has been sent successfully!</p>";
            messageResponse.style.color = "green"; // Green for success
        } else {
            messageResponse.innerHTML = "<p>There was an error sending your message. Please try again later.</p>";
            messageResponse.style.color = "red";  // Red for error
        }
    })
    .catch(error => {
        // If there's an error in the request, show an error message
        console.error("Error:", error);
        messageResponse.innerHTML = "<p>There was an error submitting your message. Please try again.</p>";
        messageResponse.style.color = "red";  // Red for error
    });
});

