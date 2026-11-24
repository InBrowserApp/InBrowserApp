## Åpne en IPFS- eller Filecoin-CAR-fil på nett

Velg en `.car`-fil fra enheten din. Verktøyet leser arkivet lokalt og viser rot-CID-en. Hvis arkivet inneholder flere røtter, velger du den du ønsker. Disse arkivene er Content Addressable aRchives som brukes av IPFS og Filecoin. Apples ressurskataloger bruker et annet format med samme filendelse.

## Pakk ut filer eller konverter en CAR-mappe til ZIP

Åpne en mappe for å se innholdet. Velg en fil, og velg deretter **Last ned fil** for å lagre de opprinnelige bytene. Velg **Last ned ZIP** for å eksportere en mappe sammen med undermappene. ZIP-filen bevarer UnixFS-mappestrukturen.

## Hva betyr en manglende blokk?

En CAR lagrer innhold som blokker identifisert med CID-er. En rot kan lenke til blokker som ligger utenfor et ufullstendig arkiv. Hvis et element trenger en blokk som mangler, kan du hente en fullstendig eksport fra kilden eller laste ned et element der blokkene er tilgjengelige. CAR-filer kan også inneholde data i andre IPLD-formater. Her brukes UnixFS til å pakke ut filer og mapper. [IPLDs CAR-format](https://ipld.io/specs/transport/car/)
