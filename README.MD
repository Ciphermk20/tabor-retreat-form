Tabor Ashram Registration Portal
A fast, responsive, and highly dynamic web application designed to handle attendee registrations for Tabor Ashram. Built with pure HTML, Tailwind CSS, and Vanilla JavaScript, this portal ensures blazing-fast load times and seamless cross-device compatibility.

Currently, the application is connected to a Google Apps Script backend that organizes data into Google Sheets and saves digital signatures securely to Google Drive.

✨ Key Features
Dynamic Participant Handling: Users can add multiple additional participants on the fly without reloading the page.

Digital Signature Pad: Integrated mobile-friendly signature canvas that supports both touchscreens and mouse inputs. Automatically preserves the signature even if the mobile keyboard resizes the viewport.

Smart Consent Generation: Extracts the main applicant's first name in real-time to generate a personalized, legally binding consent statement.

Google Sheets Automation: Instantly generates sequential Registration Numbers (e.g., REG-001), creates individual rows for every participant, and auto-formats cell dimensions so signatures are clearly visible.

Vercel Web Analytics: Built-in tracking to monitor page views and live visitor counts.

Zero Heavy Frameworks: Built without React or large JS libraries, ensuring immediate page rendering and maximum performance.

🛠️ Tech Stack
Frontend: HTML5, Vanilla JavaScript

Styling: Tailwind CSS (via CDN)

Libraries: Signature Pad (for drawing signatures)

Backend: Google Apps Script / Google Sheets API

Hosting: Vercel