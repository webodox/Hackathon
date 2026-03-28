import google.generativeai as genai
import os
import json


genai.configure(api_key= "AIzaSyCP_YCfDTwsplbWKP5xbB5TKlb-I28CWZ4")

model = genai.GenerativeModel("gemini-2.0-flash")

def process_transcript(transcript: str) -> dict:
    prompt = f"""You are MeetingGhost, an AI that analyzes meeting transcripts.

Given this meeting transcript, extract:
1. A concise summary (3-5 sentences max)
2. A list of clear action items (who does what, by when if mentioned)
3. Key decisions made
4. List of attendees/speakers mentioned

Return ONLY valid JSON in this exact format with no markdown or code blocks:
{{
  "summary": "...",
  "action_items": ["Person A will do X by Friday", "Person B will send Y"],
  "decisions": ["Decision 1", "Decision 2"],
  "attendees": "John, Sarah, Mike"
}}

TRANSCRIPT:
{transcript}"""

    response = model.generate_content(prompt)
    content = response.text.strip()

    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]

    return json.loads(content)


def draft_email(summary: str, action_items: list, attendees: str) -> str:
    action_list = "\n".join(f"- {item}" for item in action_items)

    prompt = f"""You are MeetingGhost. Draft a concise, professional meeting follow-up email.

Meeting Summary: {summary}

Action Items:
{action_list}

Attendees: {attendees}

Write a follow-up email that:
- Has a clear subject line on the first line starting with "Subject: "
- Is professional but friendly
- Recaps the key points briefly
- Lists action items clearly
- Is short (under 200 words)
- Ends with a signature placeholder "[Your Name]"

Return ONLY the email text, nothing else."""

    response = model.generate_content(prompt)
    return response.text.strip()