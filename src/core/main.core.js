const {formatBaseURL} = require("../utils/url.utils");
const {crawlPage} = require("./crowl.core");
const {printReport} = require("./reports.core");

async function main() {
    if (process.argv.length < 3) {
        console.log('No website provided');
        process.exit(1);
    }

    if (process.argv.length > 3) {
        console.log('Too many command args');
        process.exit(1);
    }

    const baseURL = formatBaseURL(process.argv[2]);
    const pages = await crawlPage(baseURL, baseURL, {});

    printReport(pages);
}

module.exports = {
    main
}
