## Een CID voor een bestand of map berekenen

Kies een lokaal bestand of een lokale map en selecteer **CID berekenen**. Kopieer de contentidentifier (CID) om deze in een manifest vast te leggen of met een eerdere IPFS-import te vergelijken. De berekening vindt plaats in je browser. Je bestanden blijven op je apparaat en worden niet op IPFS gepubliceerd.

## Waarom kan hetzelfde bestand verschillende IPFS-CID’s hebben?

IPFS kan een bestand in blokken verdelen en de onderlinge koppelingen met UnixFS opslaan. De root-CID hangt af van hoe die blokken worden verdeeld, gecodeerd en gerangschikt. Gebruik dezelfde chunkgrootte, instelling voor raw leaf-blokken en mapstructuur als bij de oorspronkelijke import om een CID te reproduceren. Een map-CID bevat ook de namen van de items in de map. De mapkiezer van de browser laat lege submappen weg. De mapkiezer kan ook symbolische koppelingen overslaan.

## De CID reproduceren met Kubo

Open **Importinstellingen** om de CID-versie, chunkgrootte, instelling voor raw leaf-blokken of het verpakken in een map te wijzigen. CIDv1 is de standaard. Gebruik CIDv0 om een oudere import te evenaren die deze versie gebruikte. **In een map verpakken** voegt een bovenliggende map toe, zodat je het bestand onder de root-CID op naam kunt adresseren.

Kopieer de weergegeven opdracht `ipfs add --only-hash` om de berekening voor hetzelfde bestand of dezelfde map in Kubo te reproduceren. Heb je een CID van een eerdere import, plak die dan in het vergelijkingsveld. Een equivalente CIDv0 en CIDv1 komen overeen omdat ze hetzelfde blok identificeren. [IPFS-documentatie over contentidentifiers](https://docs.ipfs.tech/concepts/content-addressing/)
