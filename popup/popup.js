// Example code to toggle layouts
const welcomeLayout = document.querySelector('.welcome-layout');
const resultLayout = document.querySelector('.result-layout');

// Function to switch to the Results layout
function showResultsLayout() {
  welcomeLayout.style.display = 'none';
  resultLayout.style.display = 'block';
}

// Function to switch to the Welcome layout
function showWelcomeLayout() {
  welcomeLayout.style.display = 'block';
  resultLayout.style.display = 'none';
}

// Implement the code to clear the search when the "Clear Search" button is clicked
const clearButton = document.querySelector('.clear-btn');
clearButton.addEventListener('click', () => {
  // Clear the UI and show the Welcome layout
  showWelcomeLayout();
  // You can also implement the logic to clear any stored data or perform other actions.
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updatePopupUI') {
    const results = message.results;
    updatePopupUI(results);
  }
});

// Function to update the popup UI with data
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