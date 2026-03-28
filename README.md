# Hackathon
MeetingGhost is an AI-powered Chrome Extension that turns messy meeting transcripts into clean summaries, action items, and ready-to-send follow-up emails — in seconds. You stay in control: review, edit, approve, then send with one click.

The Problem
Every meeting ends the same way. Someone says "I'll send a recap" — and it never happens. Action items get forgotten, decisions get lost, and the follow-up email that should take 2 minutes never gets written.

The Solution
Paste your transcript → MeetingGhost analyzes it with AI → You get a clean summary, action items, key decisions, and a draft email. Review it, edit if you want, hit send. Done.

Features
Smart Summarization, Action Item Extraction, Decision Tracking, AI Email Drafting, Review Before Sending, One-Click Gmail Send, Google Meet Integration


Tech Stack:
Chrome 
HTML
CSS
JavaScript
Python + Flask
OpenAI GPT-4o-mini
Gmail Compose API

Prerequisites:
Python 3.10+
Google Chrome
OpenAI API key https://platform.openai.com/api-keys

Step 1 — Clone the repo
bashgit clone https://github.com/webodox/Hackathon.git
cd Hackathon
Step 2 — Set up the backend
bashcd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

Step 3 — Add your OpenAI API key
Open backend/ai.py and replace:
pythonapi_key="YOUR_OPENAI_API_KEY_HERE"
with your actual key

Step 4 — Start the backend
python app.py
* Running on http://127.0.0.1:5000
Keep this terminal running while you use the extension.
Step 5 — Load the Chrome Extension

Open Chrome and go to chrome://extensions
Toggle Developer Mode ON (top right)
Click Load unpacked
Select the extension/ folder
Click the puzzle piece in Chrome toolbar, pin, MeetingGhost


How to Use:

Click the MeetingGhost icon in Chrome
Paste your meeting transcript (or click Grab from Google Meet)
Click Analyze Meeting
Review your Summary, Action Items, and Key Decisions
Click Draft Follow-Up Email 
Edit the email if needed
Enter recipient email Click Send Email
Gmail opens pre-filled Hit send!
