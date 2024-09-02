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