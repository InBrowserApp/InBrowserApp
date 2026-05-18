UUID v1 og UUID v6 inneholder den samme kjerneinformasjonen: et tidsstempel, en klokkesekvens og en nodeidentifikator. UUID v1 lagrer tidsstempelet i den historiske UUID-feltrekkefølgen, mens UUID v6 omordner disse tidsstempelbitene slik at enkel leksikografisk sortering følger opprettelsestiden mer naturlig.

Bruk dette verktøyet når du må flytte identifikatorer mellom systemer som forventer ulike tidsbaserte UUID-oppsett. Lim inn en UUID v1 for å få den tilsvarende UUID v6-verdien, eller lim inn en UUID v6 for å gjenopprette UUID v1-representasjonen. Konverteringen er deterministisk og beholder klokkesekvensen og nodebytene uendret.

## Når du bør bruke det

- Migrering av poster fra eldre UUID v1-lagring til UUID v6 samtidig som identitetsmetadata bevares.
- Feilsøking av databaser, logger eller køer som blander UUID v1- og UUID v6-verdier.
- Kontrollere om en UUID v6-verdi kan mappes tilbake til UUID v1-verdien som forventes av en eldre integrasjon.

## Inndataformat

Konvertereren godtar kanoniske UUID-strenger med bindestreker, kompakte UUID-strenger på 32 tegn, UUID-er med store bokstaver, `urn:uuid:`-verdier og UUID-er omsluttet av klammeparenteser. Resultatene normaliseres alltid til kanonisk UUID-form med små bokstaver.

## Merknader om personvern og kompatibilitet

UUID v1 og UUID v6 kan kode inn opprettelsestid og nodeinformasjon. Behandle dem som operative identifikatorer, ikke hemmeligheter, og unngå å eksponere dem når tidsstempel- eller nodemetadata kan være sensitive. Dette verktøyet kjører lokalt i nettleseren din og laster ikke opp UUID-ene dine.
