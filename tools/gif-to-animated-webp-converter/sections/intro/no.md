Animert WebP kan beholde bevegelsen fra en GIF og samtidig ofte gi mindre filer
for nettsteder, produktforhåndsvisninger, dokumentasjon og ressurser som er
enkle å dele i chat. Denne konvertereren kjører lokalt og sender, når du
beholder standardinnstillingene for skalering, hastighet og løkke, den
opprinnelige GIF-en gjennom en tapsfri `gif2webp`-koder for minst mulig fil
før den eksporterer `.webp`-filer.

## Når du bør bruke det

Bruk dette verktøyet når du har animerte GIF-er som trenger et mer moderne
webformat, særlig for sider der filstørrelse og innlastingshastighet er viktig.
Animert WebP støttes av dagens store browsere og kan bevare gjennomsiktighet,
timing og løkkeatferd.

## Konverteringsalternativer

Skalering endrer hver ramme før koding, noe som er nyttig når en GIF er større
enn stedet der den skal vises. Hastighet endrer avspillingstimingen uten å
fjerne rammer. Løkkeatferd kan følge kilde-GIF-en, tvinge uendelig avspilling
eller bruke et egendefinert antall for ressurser som skal stoppe etter et
bestemt antall avspillinger. Når skalering holdes på 100%, hastighet på 1x og
løkkeatferd er satt til Følg GIF, brukes den tapsfrie standardbanen for minst
mulig fil.

## Personvern og begrensninger

Konverteringen kjører i browseren din. Tapsfri WebP komprimerer vanligvis
GIF-lignende animasjon bedre, men kan ikke garantere at alle eksporterte filer
blir mindre; svært små eller allerede optimaliserte GIF-er kan bli større fordi
WebP-beholderen fortsatt har overhead. Endring av skalering, hastighet eller
løkkeatferd krever rammedekoding og kan bruke mye minne for svært store GIF-er.
Hvis kilde-GIF-en ikke inneholder løkkemetadata, spilles standardeksporten av én
gang med mindre du velger uendelig eller egendefinert gjentakelse.
