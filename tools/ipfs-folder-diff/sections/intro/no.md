## Sammenlign to IPFS-mappe-CID-er

Lim inn den opprinnelige mappen i **Tidligere mappe** og den oppdaterte i **Senere mappe**, og velg deretter **Sammenlign mapper**. Hvert felt godtar en CID, en `ipfs://`-adresse eller en HTTP-gatewaylenke. Ta med en sti for å sammenligne to undermapper. Åpne et resultat for å se CID-ene, filtrer listen etter sti eller last ned JSON for å lagre sammenligningen.

## Hva regnes som en lagt til, fjernet eller endret sti?

En sti som bare finnes i én av mappene, er lagt til eller fjernet. En hel undermappe som er lagt til eller fjernet, vises som én sti. Når begge versjonene inneholder en undermappe med ulike CID-er, sammenligner verktøyet stiene inni den. Listen over endringer omfatter filer eller symbolske lenker med ulike CID-er og stier der elementtypen har endret seg. Filer som er importert med ulike innstillinger for oppdeling eller koding, kan ha ulike CID-er selv om det synlige innholdet er likt.

## Sammenlign IPFS-øyeblikksbilder uten å laste ned hver fil

Nettleseren leser verifiserte IPFS-blokker fra offentlige gatewayer og hopper over grener der CID-ene allerede samsvarer. Dermed kan du sammenligne versjoner av et nettsted, et publisert datasett eller en sikkerhetskopi ved hjelp av uforanderlige mappeadresser. Endrede lenker kan sammenlignes uten å laste ned hele filene. Hvis et mappeelement ikke er tilgjengelig, viser resultatet hvilke stier som ikke kunne sammenlignes.

Les mer om [innholdsadressering og datasettversjoner](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
