// background.js
// Function to send the results to the popup script
function sendResultsToPopup(results) {
  chrome.runtime.sendMessage({ type: "updatePopupUI", results });
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
  if (info.menuItemId === "lookupResource" && info.selectionText) {
    getArticles(info.selectionText);
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      })
      .catch((error) => {
        // Handle any errors that occur during script injection
        console.error("Error injecting script:", error);
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
    // console.log("Fetched data:", articles);
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
