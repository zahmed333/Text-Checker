// Example code to toggle layouts
const welcomeLayout = document.querySelector('.welcome-layout');
const resultLayout = document.querySelector('.result-layout');

// Function to switch to the Results layout
function showResultsLayout() {
    welcomeLayout.style.display = 'none';    // blocl = show, none = hide
    resultLayout.style.display = 'block';
}

// Function to switch to the Welcome layout
function showWelcomeLayout() {
    welcomeLayout.style.display = 'block';
    resultLayout.style.display = 'none';
}

// Example: Show Results layout when text is highlighted (we need to implement this)
document.addEventListener('mouseup', (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText !== '') {
        showResultsLayout();
        // You can now proceed to fill the Results layout with data.
        sendHighlightedTextToBackground(selectedText);
    } else {
        showWelcomeLayout();
    }
});

// Implement code to fill the Results layout with data and handle the clear button.
function updatePopupUI(results) {
  const subjectElement = document.querySelector('.subject');
  const summaryElement = document.querySelector('.summary');
  const sourcesElement = document.querySelector('.sources');
  const errorsElement = document.querySelector('.errors');

  // Assuming results contain subject, summary, sources, and errors
  subjectElement.textContent = `Subject: ${results.subject}`;
  summaryElement.textContent = results.summary;
  sourcesElement.textContent = results.sources.join(', ');
  errorsElement.textContent = results.errors.join(', ');

  // Show the Results layout
  showResultsLayout();
}


// Example: Listen for text selection and send it to the background script
document.addEventListener('mouseup', (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText !== '') {
    sendHighlightedTextToBackground(selectedText);
  } else {
    // Handle the case when no text is selected
    showWelcomeLayout();
  }
});

// Implement the code to clear the search when the "Clear Search" button is clicked
const clearButton = document.querySelector('.clear-btn');
clearButton.addEventListener('click', () => {
  // Clear the UI and show the Welcome layout
  showWelcomeLayout();
  // You can also implement the logic to clear any stored data or perform other actions.
});
