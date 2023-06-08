const {formatPage} = require("../utils/url.utils");

function printReports(pages) {
    const updatedPages = {};
    for (const page in pages) {
        const updatedPage = formatPage(page);
        updatedPages[updatedPage] = pages[page];
    }

    console.log(updatedPages);

    const sortedPages = sortPages(pages);
    for (const page of sortedPages) {
        const url = page[0];
        const hits = page[1];
        console.log(`Found ${hits} links to page: ${url}`);
    }
}

function sortPages(pages) {
    return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}

module.exports = {
    sortPages, printReport: printReports,
}
