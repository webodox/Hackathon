const BACKEND_URL = 'http://localhost:5000';

let meetingData = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

document.getElementById('btn-grab').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.includes('meet.google.com')) {
      showError('Please open a Google Meet tab first.');
      return;
    }
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const captions = document.querySelectorAll('[jsname="tgaKEf"], .iTTPOb');
        if (captions.length === 0) return null;
        return Array.from(captions).map(el => el.innerText).join('\n');
      }
    });
    const transcript = results[0]?.result;
    if (transcript) {
      document.getElementById('transcript-input').value = transcript;
    } else {
      showError('No captions found. Make sure captions are enabled in your meeting.');
    }
  } catch (err) {
    showError('Could not access the meeting tab.');
  }
});

document.getElementById('btn-process').addEventListener('click', async () => {
  const transcript = document.getElementById('transcript-input').value.trim();
  if (!transcript) {
    showError('Please paste a transcript first.');
    return;
  }
  hideError();
  showScreen('screen-loading');

  try {
    const processRes = await fetch(`${BACKEND_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });
    if (!processRes.ok) throw new Error('Failed to process transcript');
    meetingData = await processRes.json();

    const emailRes = await fetch(`${BACKEND_URL}/draft-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: meetingData.summary,
        action_items: meetingData.action_items,
        attendees: meetingData.attendees
      })
    });
    if (!emailRes.ok) throw new Error('Failed to draft email');
    const emailData = await emailRes.json();

    populateResults(meetingData, emailData.email);
    showScreen('screen-results');

  } catch (err) {
    showScreen('screen-home');
    showError(`Error: ${err.message}. Is the backend running?`);
  }
});

function populateResults(data, email) {
  document.getElementById('result-summary').textContent = data.summary;

  const actionsList = document.getElementById('result-actions');
  actionsList.innerHTML = '';
  (data.action_items || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    actionsList.appendChild(li);
  });

  const decisionsList = document.getElementById('result-decisions');
  decisionsList.innerHTML = '';
  (data.decisions || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    decisionsList.appendChild(li);
  });

  const lines = email.split('\n');
  let subject = '';
  let body = email;
  const subjectLine = lines.find(l => l.toLowerCase().startsWith('subject:'));
  if (subjectLine) {
    subject = subjectLine.replace(/^subject:\s*/i, '').trim();
    body = lines.filter(l => !l.toLowerCase().startsWith('subject:')).join('\n').trim();
  }
  document.getElementById('email-subject').value = subject;
  document.getElementById('email-body').value = body;
}

document.getElementById('btn-go-email').addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="email"]').classList.add('active');
  document.getElementById('tab-email').classList.add('active');
});

document.getElementById('btn-copy').addEventListener('click', () => {
  const subject = document.getElementById('email-subject').value;
  const body = document.getElementById('email-body').value;
  navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
  const btn = document.getElementById('btn-copy');
  btn.textContent = '✅ Copied!';
  setTimeout(() => btn.textContent = '📋 Copy', 2000);
});

document.getElementById('btn-send').addEventListener('click', () => {
  const to = document.getElementById('email-to').value.trim();
  const subject = document.getElementById('email-subject').value.trim();
  const body = document.getElementById('email-body').value.trim();
  if (!to) {
    showSendStatus('Please enter a recipient email address.', 'fail');
    return;
  }
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  chrome.tabs.create({ url: gmailUrl });
  showSendStatus('✅ Gmail opened with your draft ready to send!', 'success');
});

document.getElementById('btn-back').addEventListener('click', () => {
  showScreen('screen-home');
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideError() {
  document.getElementById('error-msg').classList.add('hidden');
}

function showSendStatus(msg, type) {
  const el = document.getElementById('send-status');
  el.textContent = msg;
  el.className = `send-status ${type}`;
}