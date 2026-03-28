console.log("👻 MeetingGhost content script loaded (Smart Scraping Mode)");

let captionLog = [];

// Helper function to detect if newText is just a growing/corrected version of oldText
function isUpdate(oldText, newText) {
    // If one contains the other entirely, it's definitely an update
    if (newText.includes(oldText) || oldText.includes(newText)) return true;

    // Remove punctuation and split into words for comparison
    let oldClean = oldText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);
    let newClean = newText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);

    let checkLen = Math.min(3, oldClean.length, newClean.length);
    if (checkLen === 0) return false;

    // Check how many of the first few words match
    let matchCount = 0;
    for (let i = 0; i < checkLen; i++) {
        if (oldClean[i] === newClean[i]) matchCount++;
    }

    // If it's a 1-word string and it matches, or a longer string and at least 2 words match
    if (checkLen === 1 && matchCount === 1) return true;
    if (checkLen > 1 && matchCount >= 2) return true;

    return false;
}

function collectCaptions() {
  const selectors = [
    '.ygicle.VbkSUe',
    '.ygicle',
    '.VbkSUe',
    '[jsname="tgaKEf"]',
    '.iTTPOb'
  ];

  let currentTexts = [];

  // 1. Gather all text currently visible on screen
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      const text = el.innerText?.trim();
      if (text) {
        text.split('\n').forEach(line => {
          const cleanLine = line.trim();
          if (cleanLine) currentTexts.push(cleanLine);
        });
      }
    });
  });

  // 2. Process the gathered texts smartly
  currentTexts.forEach(newText => {
     if (captionLog.length === 0) {
         captionLog.push(newText);
         return;
     }

     // Look at the last 5 items in our log to see if this is an update to an ongoing sentence
     let searchDepth = Math.min(5, captionLog.length);
     let updatedExisting = false;

     for (let i = 1; i <= searchDepth; i++) {
         let logIndex = captionLog.length - i;
         let oldText = captionLog[logIndex];

         if (isUpdate(oldText, newText)) {
             // It's the same sentence growing or being corrected by Meet's AI. Overwrite it.
             captionLog[logIndex] = newText;
             updatedExisting = true;
             break; 
         }
     }

     // If it wasn't an update to a recent sentence, and we don't already have it, it's new
     if (!updatedExisting && !captionLog.includes(newText)) {
         captionLog.push(newText);
         console.log("👻 MeetingGhost saved new line:", newText);
     }
  });
}

// Watch the webpage for new captions appearing
const observer = new MutationObserver(() => {
  collectCaptions();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Backup timer just in case the observer misses something
setInterval(() => {
  collectCaptions();
}, 1000);

// Listen for the "Grab from Google Meet" button click
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTranscript") {
    collectCaptions();
    console.log("👻 MeetingGhost transcript sent to popup:", captionLog);
    sendResponse({ transcript: captionLog.join("\n") });
  }
});