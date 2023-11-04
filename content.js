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

    // Create a container for the widget
    const widgetContainer = document.createElement("div");
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
})();
