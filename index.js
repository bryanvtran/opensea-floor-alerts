const axios = require("axios");
const open = require('open');

async function getFloorPrice(slug) {
    try {
        const url = `https://api.opensea.io/collection/${slug}/stats`;
        const response = await axios.get(url);
        return response.data.stats.floor_price;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function main() {
    const SLUG = "wulfz-official";
    const THRESHOLD = .23;
    const SLEEP_TIME = 5 * 60 * 1000;

    console.log("Slug: ", SLUG);
    console.log("Threshold: ", THRESHOLD);
    console.log("Sleep time: ", SLEEP_TIME);

    (async () => {
        let looping = true;
        while (looping) {
            try {
                const floor_price = await getFloorPrice(SLUG);
                console.log("Current floor is %d.", floor_price);
                if (floor_price <= THRESHOLD) {
                    const collection_url = `https://opensea.io/collection/${SLUG}`;
                    open(collection_url);
                    looping = false;
                    break;
                }
                else {
                    console.log("Floor is below threshold, sleeping for %d seconds.", SLEEP_TIME/1000);
                }
                await sleep(SLEEP_TIME);
            } catch (e) {
                // Deal with the fact the chain failed
                looping = false;
            }
        }
    })();
}

if (require.main === module) {
    main();
}