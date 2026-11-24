## Een Piece CID berekenen uit een CAR-archief of bestand

Kies precies het bestand dat je naar een Filecoin-opslagprovider wilt sturen. Selecteer **Piece CID berekenen** en kopieer de identifier die je workflow verwacht. Het hulpmiddel toont ook de opgevulde piece-grootte in bytes. Je browser leest het bestand lokaal en verwerkt het in delen, zodat de inhoud op je apparaat blijft.

## Welk formaat moet ik gebruiken?

**Piece CID (v2)** volgt [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Deze begint meestal met `bafkzci` en bevat de informatie over de payloadgrootte die nieuwere Filecoin-tools nodig hebben. **Oudere CommP (v1)** begint meestal met `baga6ea4` en wordt gebruikt in traditionele Filecoin-opslagdeals. Als je workflow om een oudere Piece CID en de opgevulde piece-grootte vraagt, kopieer dan het oudere commitment en gebruik de grootte die erbij staat. Je kunt beide formaten plakken om een bestaand commitment met je bestand te vergelijken.

## Waarom ziet mijn IPFS-CID er anders uit?

Een IPFS-root-CID identificeert een blok of de root van een bestand of map. Een Filecoin Piece CID is een commitment aan de exacte bytes van de opslagpayload nadat de padding- en hashregels van Filecoin zijn toegepast. Als je payload een CAR-archief is, bereken je het commitment uit het archief zelf. Twee CAR-archieven kunnen dezelfde IPFS-root-CID hebben maar blokken in een andere volgorde opslaan, waardoor de Piece CID kan veranderen. Gebruik exact hetzelfde bestand als bij de berekening voordat je een deal indient.

Zie de [Filecoin Piece-specificatie](https://spec.filecoin.io/systems/filecoin_files/piece/) voor de formaat- en paddingregels.
