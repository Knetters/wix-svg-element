import wixData from 'wix-data';

$w.onReady(function () {
    wixData.query("huizen")
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const houseData = results.items.reduce((obj, item) => {
                    obj[item.title] = {
                        unit: item.unit,
                        type: item.type,
                        oppervlakte: item.oppervlakte,
                        lagen: item.lagen,
                        parkeerplaatsen: item.parkeerplaatsen,
                        vraagprijs: formatPrice(item.vraagprijs),
                        status: item.status
                    };
                    return obj;
                }, {});

                console.log("House data:", houseData);

                updateSvgElements(houseData);
            } else {
                console.log("No items found in the huizen collection.");
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

function updateSvgElements(houseData) {
    const htmlComponent = $w('#svg');
    htmlComponent.postMessage('getSvgGIds');

    htmlComponent.onMessage((event) => {
        if (event.data.type === 'svgGIds') {
            const gIds = event.data.data;

            console.log("SVG gIds:", gIds);

            const statusUpdates = gIds.map((gId) => {
                const houseTitle = gId; // Directly use the gId as the title

                const houseDetails = houseData[houseTitle] || {
                    unit: 'unknown',
                    status: 'unknown',
                    type: 'unknown',
                    oppervlakte: 'unknown',
                    lagen: 'unknown',
                    parkeerplaatsen: 'unknown',
                    vraagprijs: 'unknown'
                };

                return { id: gId, details: houseDetails };
            });

            console.log("Status updates:", statusUpdates);

            htmlComponent.postMessage({ type: 'updateStatuses', data: statusUpdates });
        }
    });
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
