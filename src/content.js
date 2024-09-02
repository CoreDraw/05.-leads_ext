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
        const nameRegex = /\b([A-Z][a-z]{1,30}\s[A-Z][a-z]{1,30})\b/g;
        const bodyText = document.body.innerText;
        const potentialNames = bodyText.match(nameRegex) || [];
         // List of common first names and last names (expand this list)
        const commonNames = ['John', 'Jane', 'Smith', 'Johnson', /* ... */];

        return potentialNames.filter(name => {
            const [firstName, lastName] = name.split(' ');
            return commonNames.includes(firstName) || commonNames.includes(lastName);
        });
    }

    function getDomainInfo() {
        return {
            domain: window.location.hostname,
            protocol: window.location.protocol,
            fullUrl: window.location.href
        };
    }
    
    try {
        const pageInfo = {
            emails: findEmails(),
            linkedInLinks: findLinkedInLinks(),
            names: identifyNames(),
            domainInfo: getDomainInfo(),
            businessMarket: identifyBusinessMarket()
        };
        chrome.runtime.sendMessage({type: 'PAGE_INFO', data: pageInfo});
    } catch (error) {
        chrome.runtime.sendMessage({type: 'ERROR', message: error.toString()});
    }

    function identifyBusinessMarket() {
        const industryKeywords = {
        'Technology': ['software', 'hardware', 'IT', 'artificial intelligence', 'machine learning', 'cloud computing'],
        'Finance': ['banking', 'investment', 'stocks', 'financial services', 'insurance', 'fintech'],
        'Healthcare': ['medical', 'hospital', 'pharmaceutical', 'healthcare', 'biotechnology', 'telemedicine'],
        'Education': ['school', 'university', 'e-learning', 'training', 'education technology', 'academic'],
        'Retail': ['e-commerce', 'shopping', 'consumer goods', 'retail', 'merchandise', 'point of sale']
        // Add more industries and keywords as needed
    };

    const bodyText = document.body.innerText.toLowerCase();
    let maxCount = 0;
    let identifiedIndustry = 'Unknown';

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
        const count = keywords.reduce((acc, keyword) => 
            acc + (bodyText.split(keyword).length - 1), 0);
        if (count > maxCount) {
            maxCount = count;
            identifiedIndustry = industry;
        }
    }

    return identifiedIndustry;
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