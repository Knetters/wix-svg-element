# Dynamic Overlay voor Huizenverkoop op SVG
Deze handleiding legt uit hoe je een dynamische overlay kunt creëren op een SVG-bestand met informatie over te koop staande huizen. Deze overlay wordt aangedreven door gegevens uit een Wix-database.

![Screenshot 2024-05-29 at 11 10 54](https://github.com/Knetters/wix-svg-element/assets/60781257/0febb2df-e4a7-4cba-a298-66dcfa87ae34)

## Inhoudsopgave
Beschrijving
Installatie
Gebruik
Stijlen en Interacties
Belangrijk om te weten

## Beschrijving
Deze toepassing haalt informatie op uit de Wix-databasekolom huizen en koppelt deze gegevens aan de id van de <g>-elementen in het SVG-bestand. Dit zorgt voor een dynamische overlay die informatie over huizen toont wanneer deze elementen worden aangeklikt.

## Installatie
Wix Data Import:
Voeg de volgende code toe aan je Wix-site om gegevens uit de database op te halen en te verwerken:

Klik op het knopje code om een globaal script bestand aan te maken.

![Screenshot 2024-05-27 at 13 06 44](https://github.com/Knetters/wix-svg-element/assets/60781257/f84ecc94-1cf8-4ad1-8a03-fa9e44247606)

Hier voeg je de volgende code aan toe. Met dit voorbeeld haal ik data op uit colom huizen.
```javascript
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
```

SVG Integratie:
Voeg een ifame element toe en zet daar de code van svg.html in.

![Screenshot 2024-05-27 at 13 08 47](https://github.com/Knetters/wix-svg-element/assets/60781257/be3c2ebd-80b0-430f-99b4-6d988a902d01)

Voeg je SVG-bestand toe in tussen de aangegeven commentaren en zorg ervoor dat de id's van de <g>-elementen overeenkomen met de titels in de database.
```html
<!-- Begin SVG -->
<svg id="svg" ...>
    <!-- SVG content here -->
</svg>
<!-- Einde SVG -->
```

## Gebruik
Wanneer de pagina wordt geladen, wordt de huizen database doorzocht en de gegevens worden gekoppeld aan de juiste SVG <g>-elementen. Wanneer een gebruiker op een van deze elementen klikt, wordt er een modale popup getoond met gedetailleerde informatie over het huis.

## Stijlen en Interacties
De CSS bevat stijlen voor verschillende huisstatussen (verkocht, in-optie, beschikbaar), evenals voor de modale popup en hover-effecten. Deze stijlen zorgen ervoor dat de SVG dynamisch en interactief is.

## Belangrijk om te weten
Databasekolommen: Zorg ervoor dat de kolommen in de huizen database exact overeenkomen met de verwachte namen (unit, type, oppervlakte, lagen, parkeerplaatsen, vraagprijs, status).
SVG id's: De id van elke <g>-element in de SVG moet exact overeenkomen met de title van de items in de database.
Wix Component ID: Het id van de Wix HTML-component moet #svg zijn om de communicatie tussen Wix en de SVG correct te laten verlopen.
Met deze setup kun je eenvoudig dynamische overlays maken voor vastgoedinformatie binnen je Wix-site.
