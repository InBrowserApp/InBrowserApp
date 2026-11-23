## Konverter animert WebP til GIF

Animert WebP lagrer flere bilderuter i én `.webp`-fil. Konverter filen til GIF
når en chatteapp, et dokumentasjonsnettsted eller en annen målplattform krever
GIF for animasjoner. Du kan konvertere både tapskomprimerte og tapsfrie
WebP-animasjoner. Behandlingen skjer på enheten din.

### Slik konverterer du animert WebP til GIF

1. Klikk på **Velg fil**, eller slipp en animert WebP i verktøyet.
2. Velg **Lag GIF** for å konvertere bilderutene med de opprinnelige målene.
3. Velg **Spill av** for å sjekke GIF-en, og lagre den med **Last ned GIF**.

### Hva skjer med visningstiden og antallet avspillinger?

Hver bilderute beholder sin egen visningstid, avrundet til GIF-formatets trinn
på 10 ms og med minst 20 ms per bilderute. Hvis én bilderute vises i 100 ms og
den neste i 250 ms, beholdes for eksempel begge tidene. Har WebP-filen et
fast antall avspillinger, beholder GIF-en dette antallet. Når WebP-filen
spilles av i en uendelig sløyfe, gjør GIF-en det samme.

### Hvordan håndterer GIF gjennomsiktighet og farger?

GIF bruker en indeksert palett med opptil 256 oppføringer per bilderute og én
gjennomsiktig oppføring. WebP kan lagre delvis gjennomsiktighet, så
halvgjennomsiktige skygger og utjevnede kanter kan se annerledes ut i GIF-en.
I fargerike bilderuter kan fargeovergangene også få synlige trinn. Se på
forhåndsvisningen mot bakgrunnen du vil bruke.

### Vanlige spørsmål

#### Kan jeg konvertere et stillbilde i WebP-format?

Verktøyet krever bilderuter fra en animasjon. Både stillbilder og animerte
bilder kan ha filendelsen `.webp`. Vil du lage en animasjon fra flere
stillbilder, kan du bruke [Lag GIF](/no/tools/gif-maker/).

#### Hvorfor er GIF-en større enn WebP-filen?

WebP komprimerer farger og områder som endrer seg mellom bilderutene,
effektivt. En GIF kan bli større selv med samme bildemål og visningstid. Sjekk
filstørrelsen ved forhåndsvisningen hvis målplattformen begrenser
opplastingsstørrelsen.

### Beslektede animasjonsverktøy

Bruk [GIF til animert WebP](/no/tools/gif-to-animated-webp-converter/)
for å konvertere den andre veien, eller
[APNG til GIF](/no/tools/apng-to-gif-converter/) hvis kildefilen er en animert PNG.
