## Konverter JSON til et Excel-regneark

Lim inn en JSON-array eller åpne en lokal `.json`-fil, sjekk forhåndsvisningen og velg **Last ned XLSX**. Verktøyet lager ett regneark med en overskriftsrad. Hvert objekt blir til en rad, og hvert felt som forekommer i arrayen, får sin egen kolonne. Dette passer til poster fra et API, produktlister og eksporterte data. Hvis API-svaret har postene i et felt som `data`, limer du inn arrayen fra det feltet.

## Utvid nestede JSON-felt til kolonner

**Utvid nestede felt** er slått på som standard. De to postene nedenfor gir kolonnene `name`, `contact.city` og `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Når du slår av innstillingen, blir `contact` stående i én kolonne som JSON-tekst, for eksempel `{"city":"Oslo"}`. Arrayer ligger i én celle uansett innstilling, så `tags` gir ingen ekstra rader. Felt som mangler eller har verdien `null`, vises som tomme celler.

## Slik lagrer Excel verdier fra JSON

Tall og boolske verdier blir vanligvis til tall og logiske verdier i Excel. Tall som ligger utenfor presisjonen eller tallområdet til Excel, lagres som tekst slik at sifrene bevares. JSON-strenger forblir tekst. Dermed beholder ID-er som `"00123"`, datoer skrevet som tekst og tekst som begynner med `=`, de opprinnelige tegnene.

## Forhåndsvis og last ned i nettleseren

Forhåndsvisningen viser første del av arket. XLSX-filen inneholder alle poster og kolonner. Konverteringen skjer i nettleseren, og JSON-dataene blir på enheten din. Bruk [JSON → CSV-omformeren](../json-to-csv-converter/) for å eksportere som ren tekst.
