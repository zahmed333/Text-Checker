// background.js
// Background script to handle the selected text: this should replace the ar query = request.query; line of code
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'selectedText') {
    // Process the selected text and prepare results (subject, summary, sources, errors)
    const results = processSelectedText(message.selectedText);

    // Send the results to the popup script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: sendResultsToPopup,
        args: [results],
      });
    });
  }
});

// Function to process selected text (we need to implement this)
function processSelectedText(selectedText) {
  // Implement the text processing logic here
  const subject = 'Your Subject'; // Example subject
  const summary = 'Summary of the selected text'; // Example summary
  const sources = ['Source 1', 'Source 2']; // Example sources
  const errors = []; // Example errors

  return { subject, summary, sources, errors };
}

// Function to send the results to the popup script
function sendResultsToPopup(results) {
  chrome.runtime.sendMessage({ type: 'updatePopupUI', results });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var query = request.query;
   
    // Send a request to the PaLM API
    var paLMRequest = new XMLHttpRequest();
    paLMRequest.open('POST', 'https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/publishers/google/models/text-bison:predict', true);
    paLMRequest.setRequestHeader('Authorization', 'Bearer ' + YOUR_ACCESS_TOKEN);
    paLMRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    paLMRequest.onload = function() {
    if (paLMRequest.status >= 200 && paLMRequest.status < 400) {
      var paLMResponse = JSON.parse(paLMRequest.responseText);
      var paLMQuery = paLMResponse.generatedText;
   
      // Send a request to SerpAPI
      var scholarRequest = new XMLHttpRequest();
      scholarRequest.open('GET', 'https://serpapi.com/search?engine=google_scholar&q=' + encodeURIComponent(paLMQuery), true);
      scholarRequest.setRequestHeader('Authorization', 'Bearer ' + YOUR_SERPAPI_KEY);
      scholarRequest.onload = function() {
        if (scholarRequest.status >= 200 && scholarRequest.status < 400) {
          var scholarResponse = JSON.parse(scholarRequest.responseText);
          // Parse the response to get the links to the scholarly articles
          var articles = scholarResponse.organic_results;
          for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            console.log(article.link);
          }
        }
      };
      scholarRequest.send();
    }
    };
    paLMRequest.send(JSON.stringify({
    "instances": [
      { "prompt": query }
    ],
    "parameters": {
      "temperature": 0.2,
      "maxOutputTokens": 256,
      "topK": 40,
      "topP": 0.95
    }
    }));
   });
   