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