package main

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"html/template"
)

func serveStaticFiles() {
	// Serve static files from the parent directory (outside the contact-form-backend folder)
	http.Handle("/", http.FileServer(http.Dir("../"))) // "../" points to the parent directory
}

// Function to send email
func sendEmail(to string, subject string, body string) error {
	// SMTP server setup (replace with your own credentials)
	smtpHost := "smtp.gmail.com" // Gmail SMTP server
	smtpPort := "587"            // TLS port
	smtpUser := os.Getenv("SMTP_USER")   // Get email from environment variable
	smtpPassword := os.Getenv("SMTP_PASSWORD") // Get app password from environment variable

	// Set up the authentication information
	auth := smtp.PlainAuth("", smtpUser, smtpPassword, smtpHost)

	// Email headers and body content
	from := smtpUser
	toAddresses := []string{to} // recipient email
	subjectLine := "Subject: " + subject + "\r\n"
	bodyContent := "\r\n" + body + "\r\n"

	// Message format
	msg := []byte(subjectLine + bodyContent)

	// Send the email
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, toAddresses, msg)
	if err != nil {
		return fmt.Errorf("Error sending email: %v", err)
	}

	return nil
}

// Contact form handler
func contactHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		// Get form values
		name := r.FormValue("name")
		email := r.FormValue("email")
		message := r.FormValue("message")

		// Prepare email subject and body
		subject := "Contact Form Submission"
		body := fmt.Sprintf("Name: %s\nEmail: %s\nMessage: %s", name, email, message)

		// Send the email
		err := sendEmail("apikojuma94@gmail.com", subject, body) // Replace with your email address
		if err != nil {
			http.Error(w, "Error sending email: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Redirect to a "Thank You" page after successful form submission
		http.Redirect(w, r, "/thank-you", http.StatusSeeOther)
	} else {
		// Serve the contact form page
		tmpl, err := template.ParseFiles("index.html")
		if err != nil {
			log.Println("Error loading template:", err)
			http.Error(w, "Unable to load page", http.StatusInternalServerError)
			return
		}
		tmpl.Execute(w, nil)
	}
}

func main() {
	// Serve static files
	serveStaticFiles()

	// Route to handle the contact form submission
	http.HandleFunc("/send", contactHandler)

	// Route to handle the "Thank You" page
	http.HandleFunc("/thank-you", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Thank you for your message!")
	})

	// Start the server
	fmt.Println("Server started at http://localhost:8090")
	log.Fatal(http.ListenAndServe(":8090", nil))
}
