const {JSDOM} = require('jsdom');

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === '/') {
            // relative
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (e) {
                console.log(`Error with relative URL: ${e.message}`);
            }
        } else {
            // absolute
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (e) {
                console.log(`Error with absolute URL: ${e.message}`);
            }
        }
    }

    return urls;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = urlObj.hostname + urlObj.pathname;

    return hostPath.endsWith('/') ? hostPath.slice(0, -1) : hostPath;
}

module.exports = {
    normalizeURL, getURLsFromHTML,
}
