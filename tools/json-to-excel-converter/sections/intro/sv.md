## Gör om JSON till ett Excel-kalkylblad

Klistra in en JSON-array eller öppna en lokal `.json`-fil, kontrollera förhandsvisningen och välj **Ladda ner XLSX**. Verktyget skapar ett kalkylblad med en rubrikrad. Varje objekt blir en rad, och varje fält som förekommer någonstans i arrayen får en egen kolumn. Det passar för poster från ett API, produktlistor och dataexporter. Om API-svaret innehåller posterna i ett fält som `data`, klistrar du in arrayen i det fältet.

## Expandera kapslade JSON-fält till kolumner

**Expandera kapslade fält** är aktiverat från början. De två posterna nedan ger kolumnerna `name`, `contact.city` och `tags`.

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

Om du stänger av alternativet ligger `contact` kvar i en enda kolumn som JSON-text, exempelvis `{"city":"Oslo"}`. Arrayer ligger i en cell oavsett inställning, så `tags` ger inga extra rader. Fält som saknas eller har värdet `null` visas som tomma celler.

## Så sparar Excel värden från JSON

Tal och booleska värden blir vanligtvis tal och logiska värden i Excel. Tal som Excel inte kan representera exakt på grund av sin precision eller sitt talområde sparas som text, så att alla siffror finns kvar. JSON-strängar förblir text. Det gör att ID:n som `"00123"`, datum skrivna som text och text som börjar med `=` behåller sina ursprungliga tecken.

## Förhandsvisa och ladda ner i webbläsaren

Förhandsvisningen visar början av kalkylbladet. XLSX-filen innehåller alla poster och kolumner. Konverteringen sker i webbläsaren och dina JSON-data stannar på enheten. För export som oformaterad text kan du använda [JSON → CSV-omvandlaren](../json-to-csv-converter/).
