const { crawlPage } = require('./crowl')

function main() {
    if (process.argv.length < 3) {
        console.log('No website provided');
        process.exit(1 );
    }

    if (process.argv.length > 3) {
        console.log('Too mane command args');
        process.exit(1 );
    }

    const baseURL = process.argv[2];

    console.log(`Start process on ${baseURL}`);

    crawlPage(baseURL);
}

main();
