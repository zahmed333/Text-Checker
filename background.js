const paLM_API_KEY = "AIzaSyBMkoVhbGmiu_Vn8kfJxg-dBYTFt7Uh6TA";

chrome.runtime.onInstalled.addListener(() => {
  // Set up context menu at install time.
  chrome.contextMenus.create({
    id: "Scholarly",
    title: "Enlighten Me!",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "Scholarly" && info.selectionText) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contents/loading.js"],
    });

    const selectedText = info.selectionText;
    let generatedText, articles, summarizedText;

    try {
      generatedText = await generateSearchQuery(selectedText);
    } catch (error) {
      console.log("Error:", error);
      return;
    }

    try {
      articles = await getArticles(generatedText);
    } catch (error) {
      console.log("Error:", error);
      return;
    }
    // articles = [{ title: "title", link: "link" }];

    try {
      summarizedText = await summarizeText(generatedText);
    } catch (error) {
      console.log("Error:", error);
      return;
    }

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["contents/content.js"],
      })
      .then(() => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            generatedText,
            summarizedText,
            articles,
          });
        }
      })
      .catch((error) => {
        console.error("Error injecting script:", error);
      });
  }
});

async function generateSearchQuery(selectedText) {
  const promptPrefix =
    "I will be using the response to this prompt to query Google Scholar. Given the following text, provide a search query related to the content of the text: ";
  const promptPostfix =
    "Generate only the search query and don't provide any descriptions or elaborations on the search query.";
  const prompt = promptPrefix + selectedText + promptPostfix;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${paLM_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ prompt: { text: prompt } }),
      }
    );

    if (!response.ok) {
      throw new Error("API key is not valid or another error occurred.");
    }

    const data = await response.json();
    return data.candidates[0].output.trim();
  } catch (error) {
    console.error("Error:", error);
    throw error; // or return a default value
  }
}

function summarizeText(selectedText) {
  const prefix2 =
    "Examine the highlighted text. If the text is straightforward and the concept is self-evident, provide an explanation that addresses any potential misconceptions directly and clarifies the concept comprehensively. If the text is complex or abstract, identify the key concepts and provide detailed explanations for each, ensuring the context is adequately elaborated upon to facilitate a clear understanding. Avoid breaking down the sentence into smaller parts unless necessary for the explanation. Highlighted Text: ";
  const prompt2 = prefix2 + selectedText;

  return fetch(
    `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${paLM_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ prompt: { text: prompt2 } }),
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("API key is not valid.");
      }
    })
    .then((data) => data.candidates[0].output.trim());
}

async function getArticles(text) {
  const searchQuery = text;
  const apiKey =
    "d1f10ececbc17ac8c3c08e63296a0f476c7fd0326d0da29ea8da97d545d3ac5c";
  const url = `https://serpapi.com/search.json?engine=google_scholar&q=${encodeURIComponent(
    searchQuery
  )}&api_key=${apiKey}`;

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
    return simplifiedResults;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
