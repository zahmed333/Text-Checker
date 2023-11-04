// background.js
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
   