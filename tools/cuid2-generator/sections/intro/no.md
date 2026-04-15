Generer CUID2-identifikatorer lokalt i nettleseren uten å sende den nåværende batchen til en annen tjeneste. Dette verktøyet er nyttig når du trenger kompakte offentlige ID-er for poster, URL-er, invitasjonslenker, testdata eller plassholdere på klientsiden, og vil styre både antall og lengde direkte.

## Hva Som Gjør CUID2 Annerledes

CUID2 er laget for å redusere kollisjoner i distribuerte systemer og samtidig være URL-vennlig. Hver verdi starter med en liten bokstav, bruker bare små base36-tegn og kombinerer tellere, vertsavtrykk og tilfeldig entropi før sluttresultatet hashes.

## Velg Antall Og Lengde

Bruk kortere utdata når du vil ha kompakte slugs til demoer, testdata eller midlertidige lenker. Øk lengden når du trenger mer spillerom for langlivede poster eller større distribuerte arbeidsmengder, og øk antallet når du vil lage en hel batch i ett steg.

## Kopier Eller Eksporter Sluttbatchen

Gå gjennom listen som er generert, og kopier eller last den ned som en tekstfil når formatet ser riktig ut. Siden alt skjer lokalt, blir identifikatorene værende i nettleseren til du bestemmer deg for å bruke eller dele dem.
