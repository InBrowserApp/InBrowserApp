## Opprett en CAR-fil fra filer eller en mappe

Velg filer eller en mappe, og velg deretter **Opprett CAR**. Kopier rot-CID-en og lagre `.car`-arkivet. Nettleseren leser utvalget lokalt og pakker det som et CARv1-arkiv med en UnixFS-rot. Du kan beholde arkivet som sikkerhetskopi eller importere det til en IPFS-node eller lagringstjeneste.

## Slik bevarer arkivet filene dine

Én enkelt fil blir roten. Flere filer deler en mapperot, og en valgt mappe beholder filstiene sine. Nettleserens mappevelger gir tilgang til filene og stiene deres. Dra inn en mappe for å ta med tomme undermapper hvis nettleseren støtter å dra og slippe mapper.

## Hva rot-CID-en betyr

Rot-CID-en identifiserer den pakkede filen eller mappen. Verktøyet bruker de samme standardinnstillingene for CIDv1 som IPFS CID-kalkulatoren, slik at samme inndatastruktur gir samme innholdsidentifikator. For å legge til arkivet i Kubo kjører du `ipfs dag import archive.car` med navnet på den nedlastede filen. [Kubo-kommandoreferanse](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
