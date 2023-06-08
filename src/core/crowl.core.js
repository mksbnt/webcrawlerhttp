const {JSDOM} = require('jsdom');
const {formatURL, normalizeURL} = require("../utils/url.utils");

async function crawlPage(baseURL, currentURL, pages) {
    const currentUrlObj = new URL(currentURL);
    const baseUrlObj = new URL(baseURL);
    if (currentUrlObj.hostname !== baseUrlObj.hostname) {
        return pages;
    }

    const normalizedURL = normalizeURL(currentURL);

    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }

    pages[normalizedURL] = 1;

    const formattedURL = formatURL(currentURL);

    try {
        console.log(`Crawling ${formattedURL}`);
        const resp = await fetch(formattedURL);
        if (resp.status > 399) {
            console.log(`HTTP error with status code: ${resp.status}`);
            return pages;
        }
        const contentType = resp.headers.get('content-type');
        if (!contentType.includes('text/html')) {
            console.log(`Non-HTML response: ${contentType}`);
            return pages;
        }
        const htmlBody = await resp.text();

        const nextURLs = getURLsFromHTML(htmlBody, baseURL);
        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    } catch (err) {
        console.log(err.message);
    }

    return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        const href = linkElement.href;
        try {
            const urlObj = new URL(href, baseURL);
            urls.push(urlObj.href);
        } catch (e) {
            console.log(`Error with URL: ${e.message}`);
        }
    }

    return urls;
}

module.exports = {
    normalizeURL, getURLsFromHTML, crawlPage,
};
