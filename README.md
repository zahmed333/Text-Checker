# Scholarly - A Chrome Browser Extension for Knowledge Enrichment

![Scholarly Logo](./images/logo.png)

## Introduction

In the academic world, students often need to navigate a sea of digital resources, including textbooks, articles, and various websites. Scholarly is a browser extension for Chromium-based browsers designed to simplify this process by providing a unified, one-click solution to enhance the learning experience. With Scholarly, users can highlight text, right-click, and choose "Enlighten Me" to receive explanations and access related scholarly articles conveniently through a pop-up widget. The extension leverages Google Cloud's PaLM AI and Google Scholar to provide knowledge enrichment.

## Installation

To install Scholarly, follow these steps:

1. **Clone the Repository:**

    `git clone https://github.com/your-username/scholarly-extension.git`

2. **Open Chrome:**
- Launch the Google Chrome web browser on your computer.

3. **Access Extension Settings:**
- Open a new tab in Chrome.
- Click the three-dot menu icon in the upper-right corner.
- Go to "More tools" and select "Extensions."

4. **Enable Developer Mode:**
- Ensure the "Developer mode" option in the upper-right corner is turned on.

5. **Load the Extension:**
- Click the "Load unpacked" button and select the root directory of this repository (where the manifest.json file is located).

6. **Extension Installed:**
- The extension should now be installed and visible in your Chrome toolbar.

## Directory Structure

The project is organized into the following directories and files:

- `/contents`: Contains scripts related to content manipulation.
    - `content.js`: JavaScript content script for the extension.
    - `loading.js`: JavaScript script for handling loading functionality.

- `/images`: This directory holds any images or assets required by the extension.

- `/loading`: Contains files related to the loading screen.
    - `loading.html`: HTML file for the loading screen.
    - `styles.css`: Cascading Style Sheet for styling the loading screen.

- `/popup`: Contains files related to the extension's popup interface.
- `/widget`: The widget directory contains the extension's widget interface.
    - `styles.css`: CSS file for styling the widget.
    - `widget.html`: HTML file for the widget interface.

- `background.js`: JavaScript file that serves as the background script making PaLM AI and SerpAPI calls for the extension.

## Accomplishments

We are proud of several accomplishments, including:

- Seamless API Integration: Successful integration of Google Cloud's PaLM AI and SERP APIs.

- Universal Interface: Designing a responsive and user-friendly user interface that works well on different devices.

- Mastering Chrome Extension Development: Navigating the complexities of Chrome extension development to create a powerful yet user-friendly tool.

- Resourcefulness Amidst Restrictions: Optimizing API requests to deliver maximum value while working within rate limits.

- The Power of Connection: Building a collaborative team and fostering connections during the development process.

## What We Learned

Our experience with Scholarly taught us the importance of handling asynchronous data, the value of user interface design, and the art of problem-solving within constraints. It also emphasized that technology development is as much about teamwork and collaboration as it is about writing code.

## What's Next for Scholarly

Scholarly will continue to evolve with features like user customization, integration of diverse databases and APIs, machine learning for content relevance, and community features. Our vision for Scholarly extends beyond being a tool; it's a growing community of curious minds and avid learners.

## Contributors

- [Zul Ahmed](https://github.com/zahmed333/)
- [Wael Mohamed](https://github.com/wmohamed24)
- [Nikoloz Bujiashvili](https://github.com/NBuji)
- [Thanh Dang](https://github.com/thanhdang2712)

Feel free to reach out if you have any questions or suggestions. Scholarly is designed to enrich your learning experience and simplify knowledge acquisition. Happy learning!


