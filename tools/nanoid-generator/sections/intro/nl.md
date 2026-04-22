## Wat is NanoID?

NanoID is een compacte, URL-veilige generator voor unieke ID's, ontworpen voor moderne webapps, API's en interne tools. Het standaardformaat gebruikt 21 tekens uit een alfabet van 64 tekens, wat ongeveer 126 bits willekeur oplevert en toch kort genoeg blijft voor URL's, bestandsnamen en testdata.

Alles in deze tool draait lokaal in je browser. Je aangepaste alfabet en de gegenereerde ID's verlaten de pagina niet, waardoor dit praktisch is voor snelle prototypes, het genereren van fixtures en eenmalige operationele taken.

**Belangrijkste punten:**

- **URL-veilig**: gebruikt A-Z, a-z, 0-9, - en \_.
- **Aanpasbaar**: pas lengte en alfabet aan op je eigen beperkingen.
- **Veilige willekeur**: gebruikt cryptografisch veilige willekeur in de browser.
- **Export als platte tekst**: kopieer of download de huidige batch wanneer je seeddata, democontent of direct importeerbare lijsten nodig hebt.

**Praktische richtlijnen:**

- Houd de standaardlengte van 21 tekens aan als je een sterke algemene identifier met een zeer kleine kans op botsingen nodig hebt.
- Kortere ID's zijn prima voor tijdelijke UI-tokens of lokale mockdata, maar het risico op botsingen neemt toe naarmate je de lengte verkleint of grotere batches genereert.
- Een groter alfabet geeft meer entropie per teken, waardoor je ID's vaak korter kunt houden zonder al te veel uniciteit in te leveren.
- Aangepaste alfabetten mogen alleen unieke tekens bevatten. Dubbele tekens verstoren de verdeling, daarom blokkeert deze tool ze voordat er output wordt gegenereerd.
