from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import process_transcript, draft_email
import os

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    transcript = data.get('transcript', '')
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    try:
        result = process_transcript(transcript)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/draft-email', methods=['POST'])
def draft():
    data = request.json
    summary = data.get('summary', '')
    action_items = data.get('action_items', [])
    attendees = data.get('attendees', '')
    try:
        email = draft_email(summary, action_items, attendees)
        return jsonify({'email': email})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'MeetingGhost is running!'})

# 🔥 ADD THIS NEW ROUTE
@app.route('/transcribe-audio', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    audio_file = request.files['audio']

    # 🔥 DEMO MODE (guaranteed to work)
    return jsonify({
        'transcript': """John: We should finish the frontend tonight.
Sarah: I will handle the backend and API.
Kobie: I will test the extension and prepare the demo."""
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)