## Konverter animert PNG til GIF

APNG lagrer flere bilderuter i én PNG-fil. Konverter filen til GIF når en
chatteapp, et forum eller dokumentasjon krever GIF for animasjoner. Animerte
filer kan ha filendelsen `.apng` eller `.png`. Konvertereren leser animasjonen
i filen og behandler den på enheten din.

### Slik konverterer du APNG til GIF

1. Klikk på **Velg fil**, eller slipp en animert PNG i verktøyet.
2. Velg **Lag GIF** for å konvertere bilderutene med de opprinnelige målene.
3. Velg **Spill av** for å sjekke GIF-en, og lagre den med **Last ned GIF**.

### Hva skjer med visningstiden og antallet avspillinger?

Hver bilderute beholder sin egen visningstid, avrundet til GIF-formatets
trinn på 10 ms og med minst 20 ms per bilderute. Hvis én bilderute vises i
100 ms og den neste i 250 ms, beholdes for eksempel begge tidene. GIF-en
beholder kildens antall avspillinger, enten animasjonen spilles av én gang,
flere ganger eller i en uendelig sløyfe. GIF støtter opptil 65 536 avspillinger
totalt når animasjonen har et fast antall avspillinger.

### Hvordan håndterer GIF gjennomsiktighet og farger?

APNG støtter delvis gjennomsiktighet og bilderuter med full fargedybde. GIF
bruker en indeksert palett med opptil 256 oppføringer per bilderute og én
gjennomsiktig oppføring. Myke kanter og skygger kan se skarpere ut, og jevne
fargeoverganger kan få synlige trinn. Sjekk GIF-forhåndsvisningen før du deler
filen. Hvis målplattformen støtter animert PNG, kan du bruke kildefilen for
å beholde full fargedybde og delvis gjennomsiktighet.

### Vanlige spørsmål

#### Kan jeg konvertere en vanlig PNG?

Verktøyet krever at PNG-filen inneholder animasjonsdata. Også en fil med
endelsen `.png` kan være animert. Hvis animasjonen har et eget reservebilde
for PNG-visere som bare viser stillbilder, starter GIF-en med animasjonens
første bilderute.

#### Blir GIF-en mindre enn APNG-filen?

Filstørrelsen avhenger av bildemålene, antallet bilderuter og detaljnivået.
GIF-en kan bli større, særlig når APNG-filen bare lagrer små områder som
endrer seg mellom bilderutene. Størrelsen på den ferdige filen vises ved
GIF-forhåndsvisningen.

### Beslektede animasjonsverktøy

Bruk [GIF til APNG](/no/tools/gif-to-apng-converter/) for å konvertere den
andre veien, eller [Animert WebP til GIF](/no/tools/animated-webp-to-gif-converter/)
hvis kildefilen er i WebP-format.
