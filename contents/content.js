(async function () {
  // Avoid duplicates
  // if (document.getElementById("my-extension-widget")) return;
  if (document.getElementById("my-loading-widget")) {
    document.getElementById("my-loading-widget").remove();
  }

  // Inject CSS
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.type = "text/css";
  styleLink.href = chrome.runtime.getURL("../widget/styles.css");
  document.head.appendChild(styleLink);

  try {
    // Fetch the HTML content from the HTML file
    const response = await fetch(
      chrome.runtime.getURL("../widget/widget.html")
    );
    const html = await response.text();

    // Create a container for the widget and set its innerHTML
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "my-extension-widget";
    widgetContainer.innerHTML = html;

    // Append the widget to the body
    document.body.appendChild(widgetContainer);

    // Close button functionality
    const closeButton = document.getElementById("my-widget-close");
    if (closeButton) {
      closeButton.onclick = function () {
        widgetContainer.remove();
      };
      //TODO: clear search button
    }
  } catch (error) {
    console.error("Failed to fetch widget HTML: ", error);
  }

  // Update widget content with data received from the background script
  function updateWidgetContent(generatedText, summarizedText, articles) {
    const generatedTextEl = document.getElementById("query-placeholder");
    const summarizedTextEl = document.getElementById("summary-placeholder");
    const articlesEl = document.getElementById("hyperlinks-placeholder");

    if (generatedTextEl && generatedText) {
      generatedTextEl.textContent = generatedText;
    }

    if (summarizedTextEl && summarizedText) {
      summarizedTextEl.textContent = summarizedText;
    }

    if (articlesEl && articles) {
      articlesEl.innerHTML = "";
      articles.forEach((article) => {
        const listItem = document.createElement("li");
        // Create an anchor element for the link
        const link = document.createElement("a");
        link.href = article.link;
        link.textContent = article.title;
        link.target = "_blank"; // To open the link in a new tab
        // Append the anchor to the list item
        listItem.appendChild(link);
        // Append the list item to the unordered list
        articlesEl.appendChild(listItem);
      });
    }
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.generatedText || message.summarizedText || message.articles) {
      // Now you have access to the variables in the content script

      updateWidgetContent(
        message.generatedText,
        message.summarizedText,
        message.articles
      );
    }
  });
})();
