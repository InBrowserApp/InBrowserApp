## Beregn en CID for en fil eller mappe

Velg en lokal fil eller mappe, og velg deretter **Beregn CID**. Kopier innholdsidentifikatoren (CID) for å lagre den i et manifest eller sammenligne den med en tidligere IPFS-import. Beregningen skjer i nettleseren. Filene blir på enheten din og publiseres ikke på IPFS.

## Hvorfor kan samme fil ha ulike IPFS-CID-er?

IPFS kan dele en fil i blokker og lagre lenker mellom dem med UnixFS. Rot-CID-en avhenger av hvordan blokkene deles opp, kodes og organiseres. For å gjenskape en CID må du bruke samme chunkstørrelse, innstilling for rå bladblokker og mappestruktur som ved den opprinnelige importen. En mappes CID inneholder også navnene på elementene i mappen. Nettleserens mappevelger utelater tomme undermapper.

## Gjenskap CID-en med Kubo

Åpne **Importinnstillinger** for å endre CID-versjon, chunkstørrelse, innstillingen for rå bladblokker eller innpakking i en mappe. CIDv1 er standard. Bruk CIDv0 når du vil samsvare med en eldre import som brukte denne versjonen. **Pakk inn i en mappe** legger til en ytre mappe, slik at du kan adressere filen etter navn under rot-CID-en.

Kopier kommandoen `ipfs add --only-hash` som vises, for å gjenskape beregningen for samme fil eller mappe i Kubo. Hvis du har en CID fra en tidligere import, limer du den inn i sammenligningsfeltet. En tilsvarende CIDv0 og CIDv1 samsvarer fordi de identifiserer samme blokk. [IPFS-dokumentasjon om innholdsidentifikatorer](https://docs.ipfs.tech/concepts/content-addressing/)
