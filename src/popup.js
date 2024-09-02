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

    document.getElementById('giveConsent').addEventListener('click', function() {
        chrome.storage.sync.set({userConsent: true}, function() {
            consentElement.style.display = 'none';
            contentElement.style.display = 'block';
            // Proceed with normal extension functionality
        });
    });

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
    document.addEventListener('DOMContentLoaded', function() {
        const loadingElement = document.getElementById('loading');
        const contentElement = document.getElementById('content');
        const errorElement = document.getElementById('error');
        const consentElement = document.getElementById('consent');
    
        loadingElement.style.display = 'block';
        contentElement.style.display = 'none';
        errorElement.style.display = 'none';
    
        chrome.storage.sync.get(['userConsent'], function(result) {
            if (result.userConsent) {
                consentElement.style.display = 'none';
                contentElement.style.display = 'block';
                // Proceed with normal extension functionality
            } else {
                consentElement.style.display = 'block';
                contentElement.style.display = 'none';
            }
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'GET_PAGE_INFO'}, function(response) {
                loadingElement.style.display = 'none';
                if (response && response.data) {
                    contentElement.style.display = 'block';
                    displayPageInfo(response.data);
                } else if (response && response.type === 'ERROR') {
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'Error: ' + response.message;
                } else {
                    errorElement.style.display = 'block';
                    errorElement.textContent = 'Error: Unable to retrieve page information';
                }
            });
        });
    });

    

    updateProspectList();
});