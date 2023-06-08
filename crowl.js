const {JSDOM} = require('jsdom');
const fetch = require('isomorphic-fetch');
const {HttpsProxyAgent} = require('https-proxy-agent');

const proxyAPI = 'https://www.proxyscan.io/api/proxy?type=http&level=transparent'; // todo: can be a list

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL =  normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`Actively crawling ${currentURL}`);

    try {
        const response = await fetch(proxyAPI);
        const proxy = await response.json();

        console.log(proxy);

        if (!proxy) {
            console.log('No proxies available');
            return;
        }

        const proxyIp = proxy[0].Ip;
        const proxyPort = proxy[0].Port;
        const proxyType = String(proxy[0].Type[0]).toLowerCase();

        console.log(proxy);

        const proxyURL = `${proxyType}://${proxyIp}:${proxyPort}`;

        console.log(proxyURL);

        const agent = new HttpsProxyAgent(proxyURL);
        const resp = await fetch(currentURL, {agent});


        if (resp.status > 399) {
            console.log(`Error in fetch with status code: ${resp.status}, on page: ${currentURL}`);
            return pages;
        }

        const contentType = resp.headers.get("content-type");

        if (!contentType.includes('text/html')) {
            console.log(`Non HTML response: ${contentType}, on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await resp.text();

        const nextUrls = getURLsFromHTML(htmlBody, baseURL)

        for (const  nextUrl of  nextUrls) {
            pages = await crawlPage(baseURL, nextUrl, pages);
        }
    } catch (e) {
        console.log(`Error in fetch: ${e.message}, on page: ${currentURL}`);
        // await crawlPage(baseURL, baseURL, pages);
    }

    return pages;
}

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
    normalizeURL, getURLsFromHTML, crawlPage,
}
