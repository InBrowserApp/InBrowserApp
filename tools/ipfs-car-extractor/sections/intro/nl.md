## Een IPFS- of Filecoin-CAR-bestand online openen

Selecteer een `.car`-bestand op je apparaat. De extractor leest het archief lokaal en toont de root-CID. Als het archief meerdere roots bevat, kies je de gewenste root. Deze archieven zijn Content Addressable aRchives die door IPFS en Filecoin worden gebruikt. Apple-assetcatalogi gebruiken een ander formaat met dezelfde extensie.

## Bestanden uitpakken of een CAR-map naar ZIP converteren

Open een map om de inhoud te bekijken. Selecteer een bestand en kies **Bestand downloaden** om de oorspronkelijke bytes op te slaan. Kies **ZIP downloaden** om een map samen met de submappen te exporteren. De ZIP behoudt de UnixFS-mapstructuur.

## Wat betekent een ontbrekend blok?

Een CAR slaat inhoud op als blokken die door CID’s worden geïdentificeerd. Een root kan verwijzen naar blokken buiten een gedeeltelijk archief. Als voor een item een blok ontbreekt, vraag dan een volledige export op bij de bron of download een item waarvan de blokken beschikbaar zijn. CAR-bestanden kunnen ook gegevens in andere IPLD-formaten bevatten. Het uitpakken van bestanden en mappen gebruikt hier UnixFS. [IPLD CAR-formaat](https://ipld.io/specs/transport/car/)
