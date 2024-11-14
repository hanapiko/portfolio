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
