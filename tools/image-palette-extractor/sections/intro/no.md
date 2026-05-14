## Hva dette verktøyet gjør

Bildepalett-uttrekker finner de dominerende fargene i et bilde direkte i
nettleseren din. Den tar prøver av bildet, grupperer visuelt lignende piksler og
gir en praktisk palett med HEX-, RGB-, HSL- og prosentverdier for hver farge.

## Gode bruksområder

- Hent merkevare- eller produktfarger fra et skjermbilde, en logo, et foto eller en mockup.
- Lag en rask CSS-palett for en landingsside, et miniatyrbilde eller en designoverlevering.
- Sammenlign hvor mye av et bilde som styres av én dominerende farge kontra støttende aksentfarger.
- Arbeid med private bilder uten å sende filen til en server.

## Eksportalternativer

Resultatet kan kopieres som en ren HEX-liste, CSS-variabler eller JSON.
CSS-formatet er nyttig når du vil ha variabler som `--palette-1`, mens
JSON holder fargeformatene og dominansforholdet samlet for skript eller
designautomatisering.

## Ting å være oppmerksom på

- Palettuttrekk er omtrentlig. Det er ment å lage nyttige visuelle
  grupper, ikke en komplett oversikt over hver pikselfarge.
- Gjennomsiktige piksler ignoreres som standard, slik at ikoner og utskjæringer
  ikke skjevfordeler paletten; slå dette av når gjennomsiktighet i seg selv er
  en del av motivet.
- Den presise kvalitetsinnstillingen tar prøver av flere piksler og kan være
  tregere på svært store bilder.
