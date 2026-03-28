let captionLog = [];

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        const captionEl = node.querySelector?.('[jsname="tgaKEf"]') || 
                          node.closest?.('[jsname="tgaKEf"]');
        if (captionEl) {
          const text = captionEl.innerText?.trim();
          if (text && text !== captionLog[captionLog.length - 1]) {
            captionLog.push(text);
          }
        }
      }
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTranscript') {
    sendResponse({ transcript: captionLog.join('\n') });
  }
});