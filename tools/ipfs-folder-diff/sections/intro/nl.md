## Twee IPFS-map-CID’s vergelijken

Plak de oorspronkelijke map in **Eerdere map** en de bijgewerkte map in **Latere map**. Selecteer daarna **Mappen vergelijken**. Elk invoerveld accepteert een CID, een `ipfs://`-adres of een HTTP-gatewaylink. Voeg een pad toe om twee submappen te vergelijken. Open een resultaat om de CID’s te bekijken, filter de lijst op pad of download JSON om de vergelijking op te slaan.

## Wanneer is een pad toegevoegd, verwijderd of gewijzigd?

Een pad dat maar in één map bestaat, is toegevoegd of verwijderd. Een volledig toegevoegde of verwijderde submap verschijnt als één pad. Als beide versies een submap met verschillende CID’s bevatten, vergelijkt het hulpmiddel de paden daarbinnen. De lijst met wijzigingen bevat bestanden of symbolische links met verschillende CID’s en paden waarvan het itemtype is veranderd. Bestanden die met verschillende chunking- of coderingsinstellingen zijn geïmporteerd, kunnen verschillende CID’s hebben, ook als hun zichtbare inhoud gelijk is.

## IPFS-momentopnamen vergelijken zonder elk bestand te downloaden

De browser leest geverifieerde IPFS-blokken van openbare gateways en slaat takken over waarvan de CID’s al overeenkomen. Zo kun je versies van een website, een gepubliceerde dataset of een back-up vergelijken via hun onveranderlijke mapadressen. Gewijzigde links kunnen worden vergeleken zonder de volledige bestanden te downloaden. Als een mapitem niet beschikbaar is, vermeldt het resultaat welke paden niet konden worden vergeleken.

Lees meer over [contentadressering en datasetversies](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
