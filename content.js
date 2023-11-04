(async function () {
  // Avoid duplicates
  if (document.getElementById("my-extension-widget")) return;

  // Inject CSS
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.type = "text/css";
  styleLink.href = chrome.runtime.getURL("widget/styles.css");
  document.head.appendChild(styleLink);

  try {
    // Fetch the HTML content from the HTML file
    const response = await fetch(chrome.runtime.getURL("widget/widget.html"));
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
    }
  } catch (error) {
    console.error("Failed to fetch widget HTML: ", error);
  }

  // Update widget content with data received from the background script
  function updateWidgetContent(generatedText, summarizedText) {
    const generatedContentEl = document.getElementById("generated-content");
    const summarizedContentEl = document.getElementById("summarized-content");

    if (generatedContentEl && generatedText) {
      generatedContentEl.textContent = generatedText;
    }

    if (summarizedContentEl && summarizedText) {
      summarizedContentEl.textContent = summarizedText;
    }
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.generatedText || message.summarizedText || message.articles) {
      // Now you have access to the variables in the content script
      const generatedText = message.generatedText;
      const articles = message.articles;
      const summarizedText = message.summarizedText;
      //   updateWidgetContent(message.generatedText, message.summarizedText);
      articles.forEach((article) => {
        // const listItem = document.createElement("li");
        // // Create an anchor element for the link
        // const link = document.createElement("a");
        // link.href = article.link;
        // link.textContent = article.title;
        // link.target = "_blank"; // To open the link in a new tab
        // // Append the anchor to the list item
        // listItem.appendChild(link);
        // // Append the list item to the unordered list
        // articlesList.appendChild(listItem);
        console.log(article.title, article.link);
      });
    }
  });
})();
