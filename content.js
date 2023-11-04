document.onmouseup = function() {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      // Send the selected text to the background script
      chrome.runtime.sendMessage({query: selectedText});
    }
   };
   