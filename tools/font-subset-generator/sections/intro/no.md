## Hva er en skriftdelmengde?

En skriftdelmengde inneholder tegnene som trengs for en bestemt tekst, samt
støtteglyfene som kreves for å vise dem. Å fjerne ubrukte glyfer kan redusere
nedlastingsstørrelsen betydelig, særlig for store kinesiske, japanske og
koreanske skrifter eller en fast overskrift, logo eller kampanjeside.

## Slik bruker du verktøyet

Velg en TTF-, OTF-, WOFF- eller WOFF2-fil og lim inn all teksten som skal bruke
den. Velg WOFF2 for levering på nettet eller TTF / OTF for en ukomprimert skrift,
og lag deretter delmengden. Sammenlign størrelsene, sjekk forhåndsvisningen og
last ned skriften med tilhørende CSS. Skriften behandles lokalt i en Web Worker.

## Hva beholdes?

HarfBuzz beholder glyfavhengigheter og OpenType-layoutfunksjoner som trengs for
ligaturer, kerning, kombinerende tegn og komplekse skriftsystemer. Hinting og
akser for variable skrifter beholdes. Kanonisk ekvivalente sammensatte og
dekomponerte tekstformer inkluderes når originalskriften støtter dem.
Forhåndsvisningen bruker den genererte skriften, og manglende tegn i originalen
vises i en egen liste.

## Praktiske tips

- Ta med mellomrom, tegnsetting, tall og alle oversatte strenger du trenger.
  Legg til det latinske forhåndsvalget hvis teksten også skal inneholde
  grunnleggende latinske tegn.
- Lag delmengden på nytt hver gang teksten endres. En fast delmengde passer
  best for kjent innhold; bruk bredere tegndekning for brukergenerert tekst.
- En delmengde kan ikke legge til tegn som mangler i originalskriften. Behold
  en reserveskrift i CSS for tegn utenfor delmengden.
- Bruk en skrift med en lisens som tillater endringer og innbygging på nettet.
  Skriftsamlinger (`.ttc` / `.otc`) må først eksporteres som enkeltstående
  skrifter.
- Små skrifter eller skrifter som allerede er delmengder, blir kanskje ikke
  mindre. WOFF2 gir vanligvis den minste nedlastingen for nettet; antallet
  glyfer inkluderer også støtteglyfer.
