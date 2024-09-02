I'd be happy to outline the steps for creating an extension with the functionality you've described. This will be a high-level overview without diving into programming specifics. Here's a step-by-step guide for a user using Visual Studio Code:

1. Set up the development environment:
   - Install Visual Studio Code (VS Code) if not already installed.
   - Install Node.js and npm (Node Package Manager) from nodejs.org.
   - Install Git from git-scm.com.

2. Create a new project folder:
   - Open VS Code.
   - Create a new folder for your extension project.
   - Open this folder in VS Code.

3. Initialize the project:
   - Open the terminal in VS Code (View > Terminal).
   - Run `npm init -y` to create a package.json file.

4. Install necessary tools:
   - Run `npm install --save-dev webpack webpack-cli copy-webpack-plugin`
   - Run `npm install --save-dev @types/chrome`

5. Set up the extension structure:
   - Create a `src` folder for your source code.
   - Create a `public` folder for static assets.
   - In the `public` folder, create:
     - `manifest.json` (extension configuration)
     - `popup.html` (extension popup)
     - `icon.png` (extension icon)

6. Create the main extension files:
   - In the `src` folder, create:
     - `content.js` (for website interaction)
     - `popup.js` (for popup functionality)
     - `background.js` (for background tasks)

7. Implement the extension functionality:
   - In `content.js`, write code to:
     - Find email addresses on the page
     - Extract domain details
     - Find LinkedIn links
     - Identify person names
     - Determine the business market
   - In `popup.js`, create the user interface for:
     - Displaying found information
     - Managing prospect lists
     - Showing intuitive buttons and modern UX
   - In `background.js`, handle any background tasks

8. Design the user interface:
   - Use HTML and CSS in `popup.html` to create a modern, intuitive interface
   - Implement buttons for various functions

9. Configure the extension:
   - Set up the `manifest.json` file with necessary permissions and script declarations

10. Build the extension:
    - Create a `webpack.config.js` file to configure the build process
    - Add a build script to `package.json`
    - Run `npm run build` to build the extension
    "scripts": {
        "build": "webpack --config webpack.config.js"
    }

11. Test the extension:
    - In Chrome/Edge, go to the extensions page
    - Enable "Developer mode"
    - Click "Load unpacked" and select your extension's build folder

12. Debug and refine:
    - Use the browser's developer tools to debug the extension
    - Make adjustments to the code as needed

13. Prepare for distribution:
    - Create a `.zip` file of your extension's build folder
    - For Chrome: Submit to the Chrome Web Store
    - For Edge: Submit to the Microsoft Edge Add-ons store

Additional software needed:
- Node.js and npm (installation steps provided earlier)
- Git (installation steps provided earlier)
- A modern web browser (Chrome or Edge) for testing

This outline provides a general roadmap for creating the extension. Each step would require more detailed implementation, including writing the actual code for the functionality you described. If you need more specific guidance on any particular step, please let me know, and I'd be happy to elaborate further.


content.js
// content.js
(function() {
    function findEmails() {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const bodyText = document.body.innerText;
        return bodyText.match(emailRegex) || [];
    }

    function findLinkedInLinks() {
        const links = Array.from(document.getElementsByTagName('a'));
        return links.filter(link => link.href.includes('linkedin.com')).map(link => link.href);
    }

    function identifyNames() {
        // This is a simplistic approach and may need refinement
        const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/g;
        const bodyText = document.body.innerText;
        return bodyText.match(nameRegex) || [];
    }

    function getDomainInfo() {
        return {
            domain: window.location.hostname,
            protocol: window.location.protocol,
            fullUrl: window.location.href
        };
    }

    function identifyBusinessMarket() {
        // This is a placeholder. In reality, you'd need a more sophisticated algorithm or API
        const keywords = ['tech', 'finance', 'health', 'education', 'retail'];
        const bodyText = document.body.innerText.toLowerCase();
        return keywords.find(keyword => bodyText.includes(keyword)) || 'Unknown';
    }

    const pageInfo = {
        emails: findEmails(),
        linkedInLinks: findLinkedInLinks(),
        names: identifyNames(),
        domainInfo: getDomainInfo(),
        businessMarket: identifyBusinessMarket()
    };

    chrome.runtime.sendMessage({type: 'PAGE_INFO', data: pageInfo});
})();

// popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'GET_PAGE_INFO'}, function(response) {
            if (response && response.data) {
                displayPageInfo(response.data);
            }
        });
    });

    function displayPageInfo(info) {
        document.getElementById('emails').textContent = info.emails.join(', ');
        document.getElementById('linkedin').textContent = info.linkedInLinks.join(', ');
        document.getElementById('names').textContent = info.names.join(', ');
        document.getElementById('domain').textContent = JSON.stringify(info.domainInfo);
        document.getElementById('market').textContent = info.businessMarket;
    }

    document.getElementById('addProspect').addEventListener('click', function() {
        const name = document.getElementById('prospectName').value;
        const email = document.getElementById('prospectEmail').value;
        if (name && email) {
            chrome.storage.sync.get(['prospects'], function(result) {
                const prospects = result.prospects || [];
                prospects.push({name, email});
                chrome.storage.sync.set({prospects: prospects}, function() {
                    updateProspectList();
                });
            });
        }
    });

    function updateProspectList() {
        chrome.storage.sync.get(['prospects'], function(result) {
            const prospects = result.prospects || [];
            const list = document.getElementById('prospectList');
            list.innerHTML = '';
            prospects.forEach(function(prospect) {
                const li = document.createElement('li');
                li.textContent = `${prospect.name}: ${prospect.email}`;
                list.appendChild(li);
            });
        });
    }

    updateProspectList();
});

// background.js - public
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'PAGE_INFO') {
        chrome.storage.local.set({lastPageInfo: request.data});
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {type: 'PAGE_LOADED'});
    }
});


{
  "manifest_version": 2,
  "name": "Email and Business Finder",
  "version": "1.0",
  "description": "Finds emails, LinkedIn links, and business information on websites",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "browser_action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}

<!DOCTYPE html> --- public
<html>
<head>
    <title>Email and Business Finder</title>
    <style>
        body { width: 300px; font-family: Arial, sans-serif; }
        .section { margin-bottom: 10px; }
        h3 { margin-bottom: 5px; }
        input { width: 100%; margin-bottom: 5px; }
        button { width: 100%; }
    </style>
</head>
<body>
    <div class="section">
        <h3>Emails Found:</h3>
        <p id="emails"></p>
    </div>
    <div class="section">
        <h3>LinkedIn Links:</h3>
        <p id="linkedin"></p>
    </div>
    <div class="section">
        <h3>Names Found:</h3>
        <p id="names"></p>
    </div>
    <div class="section">
        <h3>Domain Info:</h3>
        <p id="domain"></p>
    </div>
    <div class="section">
        <h3>Business Market:</h3>
        <p id="market"></p>
    </div>
    <div class="section">
        <h3>Add Prospect:</h3>
        <input type="text" id="prospectName" placeholder="Name">
        <input type="email" id="prospectEmail" placeholder="Email">
        <button id="addProspect">Add Prospect</button>
    </div>
    <div class="section">
        <h3>Prospects:</h3>
        <ul id="prospectList"></ul>
    </div>
    <script src="popup.js"></script>
</body>
</html>

//webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/popup.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
      ],
    }),
  ],
};

npm install --save-dev @babel/core @babel/preset-env babel-loader
