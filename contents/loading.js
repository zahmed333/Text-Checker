(async function () {
  if (document.getElementById("my-extension-widget")) {
    document.getElementById("my-extension-widget").remove();
  }
  // Inject CSS
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.type = "text/css";
  styleLink.href = chrome.runtime.getURL("../loading/styles.css");
  document.head.appendChild(styleLink);

  try {
    // Fetch the HTML content from the HTML file
    const response = await fetch(
      chrome.runtime.getURL("../loading/loading.html")
    );
    const html = await response.text();

    // Create a container for the widget and set its innerHTML
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "my-loading-widget";
    widgetContainer.innerHTML = html;

    // Append the widget to the body
    document.body.appendChild(widgetContainer);
    console.log("sucess");
  } catch (error) {
    console.error("Failed to fetch widget HTML: ", error);
  }
  console.log(chrome.runtime.getURL("../images/loading.gif"));

  document.getElementById("loading-img").src = chrome.runtime.getURL(
    "../images/loading.gif"
  );

  document.getElementById("loading-logo").src = chrome.runtime.getURL(
    "../images/logo_128.png"
  );
})();
