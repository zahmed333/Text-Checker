function sendResultsToPopup(results) {
    chrome.runtime.sendMessage({ type: 'updatePopupUI', results });
  }

chrome.runtime.onInstalled.addListener(() => {
    // Set up context menu at install time.
    chrome.contextMenus.create({
      id: "lookupResource",
      title: "Look for resources",
      contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookupResource") {
        var selectedText = info.selectionText;
        var paLM_API_KEY = 'AIzaSyBMkoVhbGmiu_Vn8kfJxg-dBYTFt7Uh6TA';

        var promptPrefix = "I will be using the response to this prompt to query Google Scholar. given the following text, provide a search query related to the content of the text: ";
        var promptPostfix = "Generate only the search query and don't provide any descriptions or elaborations on the search query.";
        var prompt = promptPrefix + selectedText + promptPostfix;

        fetch('https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=' + paLM_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                "prompt": {
                    "text": prompt
                }
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("API key is not valid.");
            }
        })
        .then(data => {
            var generatedText = data.candidates[0].output.trim();
            console.log("Generated text:", generatedText);
            
            // Call the getArticles function
            getArticles(generatedText);

            var prefix2 = "Examine the highlighted text. If the text is straightforward and the concept is self-evident, provide an explanation that addresses any potential misconceptions directly and clarifies the concept comprehensively. If the text is complex or abstract, identify the key concepts and provide detailed explanations for each, ensuring the context is adequately elaborated upon to facilitate a clear understanding. Avoid breaking down the sentence into smaller parts unless necessary for the explanation. Highlighted Text: ";
            var prompt2 = prefix2 + selectedText

            // Summarize the generated text
            fetch('https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=' + paLM_API_KEY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    "prompt": {
                        "text": prompt2
                    }
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("API key is not valid.");
                }
            })
            .then(data => {
                var summarizedText = data.candidates[0].output.trim();
                console.log("Summarized text:", summarizedText);
            })
            .catch(error => {
                console.log("Error:", error);
            });
        })
        .catch(error => {
            console.log("Error:", error);
        });
    }
});

async function getArticles(text) {
    const searchQuery = text;
    const apiKey =
      "0767298fd222b2cf5a66270610c6cd8cd894b725cf8f87dad2a90f2490635350";
    const url = `https://serpapi.com/search.json?engine=google_scholar&q=${encodeURIComponent(
      searchQuery
    )}&api_key=${apiKey}`;
  
    try {
      const articles = await fetchData(url);
      console.log("Fetched data:", articles);
    } catch (error) {
      console.error("Error in caller function:", error);
    }
  }
  
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const simplifiedResults = data.organic_results.map((result) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
      }));
      return simplifiedResults; // This will return a Promise that resolves to simplifiedResults
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }