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

const paLM_API_KEY = 'AIzaSyBMkoVhbGmiu_Vn8kfJxg-dBYTFt7Uh6TA';

function generateSearchQuery(selectedText) {
    const promptPrefix = "I will be using the response to this prompt to query Google Scholar. Given the following text, provide a search query related to the content of the text: ";
    const promptPostfix = "Generate only the search query and don't provide any descriptions or elaborations on the search query.";
    const prompt = promptPrefix + selectedText + promptPostfix;

    return fetch(`https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${paLM_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ "prompt": { "text": prompt } })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("API key is not valid.");
        }
    })
    .then(data => data.candidates[0].output.trim());
}

function summarizeText(selectedText) {
    const prefix2 = "Examine the highlighted text. If the text is straightforward and the concept is self-evident, provide an explanation that addresses any potential misconceptions directly and clarifies the concept comprehensively. If the text is complex or abstract, identify the key concepts and provide detailed explanations for each, ensuring the context is adequately elaborated upon to facilitate a clear understanding. Avoid breaking down the sentence into smaller parts unless necessary for the explanation. Highlighted Text: ";
    const prompt2 = prefix2 + selectedText;

    return fetch(`https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${paLM_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ "prompt": { "text": prompt2 } })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("API key is not valid.");
        }
    })
    .then(data => data.candidates[0].output.trim());
}

// Usage example:
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookupResource" && info.selectionText) {
        const selectedText = info.selectionText;

        generateSearchQuery(selectedText)
        .then(generatedText => {
            console.log("Generated text:", generatedText);
            // Call the getArticles function and process further as needed
            getArticles(generatedText).then(articles => {
                // Do something with the articles
                sendResultsToPopup(articles);
            });

            // Now we can also summarize the text
            return summarizeText(selectedText);
        })
        .then(summarizedText => {
            console.log("Summarized text:", summarizedText);
            // Process the summarized text as needed
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