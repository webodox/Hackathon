# Hackathon
MeetingGhost
AI-powered Chrome Extension that summarizes meetings, extracts action items, and drafts follow-up emails in seconds.

1. Backend
bashcd backend
python -m venv venv

# Terminal
venv\Scripts\activate
pip install -r requirements.txt
python app.py
Server runs at http://127.0.0.1:5000

2. Add your OpenAI API key
In backend/ai.py:
pythonclient = OpenAI(api_key="your-key-here")
3. Load the Chrome Extension

Go to chrome://extensions
Enable Developer Mode
Click Load unpacked then select the extension/ folder
Pin MeetingGhost to your toolbar


How to Use

Click the extenstion icon in Chrome
Paste your meeting transcript
Click Analyze Meeting
Review summary and action items
Edit the draft email Then click Send
Or
In a google meeting click grab from google meet
Click Analyze Meeting
Review summary and action items
