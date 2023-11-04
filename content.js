// content.js

// Function to create a context menu item when text is selected
function createContextMenu() {
  chrome.contextMenus.create({
    id: "scholarly-verifier",
    title: "Verify with Scholarly Verifier",
    contexts: ["selection"],
  });
}

// Listen for text selection and create the context menu item
document.addEventListener("mouseup", (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText !== "") {
    createContextMenu();
  }
});

// Handle the context menu item click
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "scholarly-verifier") {
    // Implement what you want to do when the menu item is clicked, e.g., open your extension's popup.
    // You can send the selected text to your extension's popup for processing.
  }
});
