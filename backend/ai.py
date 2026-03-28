from openai import OpenAI
import json

client = OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content.strip()

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

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

    return response.choices[0].message.content.strip()