## Beregn en Piece CID fra et CAR-arkiv eller en fil

Velg nøyaktig filen du planlegger å sende til en Filecoin-lagringsleverandør. Velg **Beregn Piece CID**, og kopier deretter identifikatoren arbeidsflyten krever. Verktøyet viser også utfylt piece-størrelse i byte. Nettleseren leser filen lokalt og behandler den i deler, slik at innholdet blir på enheten din.

## Hvilket format bør jeg bruke?

**Piece CID (v2)** følger [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Den begynner vanligvis med `bafkzci` og inneholder informasjon om størrelsen på nyttelasten som nyere Filecoin-verktøy trenger. **Eldre CommP (v1)** begynner vanligvis med `baga6ea4` og brukes i tradisjonelle Filecoin-lagringsavtaler. Hvis arbeidsflyten krever en eldre Piece CID og utfylt piece-størrelse, kopierer du den eldre commitmenten og bruker størrelsen som vises ved siden av. Du kan lime inn begge formatene for å kontrollere en eksisterende commitment mot filen. En eldre CommP kan samsvare for filer som bare skiller seg i antall avsluttende nuller.

## Hvorfor ser IPFS-CID-en min annerledes ut?

En IPFS rot-CID identifiserer en blokk eller roten til en fil eller mappe. En Filecoin Piece CID er en commitment til de nøyaktige bytene i lagringsnyttelasten etter at Filecoins regler for utfylling og hashing er brukt. Hvis nyttelasten er et CAR-arkiv, beregner du commitmenten fra selve arkivet. To CAR-arkiver kan ha samme IPFS rot-CID, men lagre blokker i ulik rekkefølge, noe som kan endre Piece CID-en. Bruk nøyaktig samme fil som du beregnet tidligere før du sender inn en avtale.

Se [Filecoins Piece-spesifikasjon](https://spec.filecoin.io/systems/filecoin_files/piece/) for reglene for format og utfylling.
