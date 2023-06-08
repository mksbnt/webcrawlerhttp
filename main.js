const { crawlPage } = require('./crowl')

async function main() {
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

   const pages = await crawlPage(baseURL, baseURL, {});

   for (const page of Object.entries(pages)) {
       console.log(page);
   }
}

main();
