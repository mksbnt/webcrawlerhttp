function formatBaseURL(input) {
    return (input.replace(/\//g, '')) + '/';
}

function formatPage(input) {
    return input.replace(/\/\//g, '/');
}

function formatURL(input) {
    const output = input.replace(/([^:]\/)\/+/g, "$1");

    if (output.match('//')) {
        return output;
    }

    const colonIndex = output.indexOf(":");

    if (colonIndex !== -1) {
        const protocol = output.substring(0, colonIndex + 1);
        const domain = output.substring(colonIndex + 1);
        return protocol + "//" + domain;
    }

    return output;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    return (urlObj.hostname + urlObj.pathname).replace(/\/+/g, "/");
}

module.exports = {
    formatBaseURL, formatPage, formatURL, normalizeURL
}
