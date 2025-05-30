🏠 Zillow Property Scraper Extension

This Chrome extension allows users to scrape real estate listing data directly from Zillow property pages and send the data to a DynamoDB table associated with their Cognito-authenticated user account. It powers seamless integration with your Rental Cash Flow App, removing the need for manual entry of property details.

⸻

🚀 Features
	•	One-click scraping of Zillow property listings
	•	Extracts:
	•	Listing price
	•	Full street address
	•	Page URL
	•	Sends scraped data to AWS DynamoDB via Lambda (Cognito-authenticated)
	•	Designed for real-time importing into a rental property analysis dashboard
	•	Works in the background with a popup interface

⸻

📦 Project Structure

zillow-scraper-extension/
├── content.js               # Scrapes Zillow listing data from the page
├── background.js            # Handles messaging and communication to Lambda
├── popup.html               # Extension popup UI
├── popup.js                 # Logic for the popup UI
├── manifest.json            # Chrome extension metadata
├── styles.css               # Popup styling
└── README.md


⸻

🛠 Installation
	1.	Clone or download this repo.
	2.	In Chrome, go to chrome://extensions.
	3.	Enable Developer Mode (top right).
	4.	Click Load unpacked and select the zillow-scraper-extension folder.

⸻

🧪 How to Use
	1.	Navigate to a Zillow property listing page (e.g., https://www.zillow.com/homedetails/...).
	2.	Click the Zillow Scraper extension icon.
	3.	Click “Scrape this page” in the popup.
	4.	The extension will extract data and send it to your AWS backend.
	5.	Check your connected app to view the imported listing.

⸻

☁️ AWS Integration
	•	Auth via Amazon Cognito
	•	Data stored in Amazon DynamoDB
	•	Lambda function receives and processes data
	•	IAM permissions scoped per user for secure writes

⸻

🧩 Scraping Logic

If direct data-testid selectors fail due to changes in Zillow’s DOM:
	•	A fallback method uses visible text content patterns to extract data.

⸻

🧠 Future Enhancements
	•	Extract additional fields like:
	•	Beds, baths, square footage, lot size, HOA, and Zestimate
	•	Add visual confirmation of what was scraped
	•	Handle Zillow redirects and region locks
	•	Error logging via CloudWatch

⸻

⚠️ Legal Disclaimer

This tool is for educational and personal productivity use. Always review and comply with Zillow’s Terms of Service before scraping their content.

⸻

🧑‍💻 Author

Built by Reny Carr
