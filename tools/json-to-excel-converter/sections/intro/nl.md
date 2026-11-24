## JSON omzetten naar een Excel-werkblad

Plak een JSON-array of open een lokaal `.json`-bestand, controleer het voorbeeld en kies **XLSX downloaden**. De converter maakt één werkblad met een koprij. Elk object krijgt een rij en elk veld dat ergens in de array voorkomt, krijgt een kolom. Dat is handig voor records uit een API, productlijsten of gegevensexports. Als de API de records in een veld zoals `data` zet, plak je de array uit dat veld.

## Geneste JSON-velden uitvouwen tot kolommen

**Geneste velden uitvouwen** staat standaard aan. De twee records hieronder leveren de kolommen `name`, `contact.city` en `tags` op.

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

Als je deze optie uitzet, blijft `contact` in één kolom staan als JSON-tekst, bijvoorbeeld `{"city":"Oslo"}`. Arrays blijven hoe dan ook in één cel. Het veld `tags` levert dus geen extra rijen op. Ontbrekende velden en velden met de waarde `null` worden lege cellen.

## Hoe Excel JSON-waarden opslaat

Getallen en booleans worden meestal Excel-getallen en logische waarden. Getallen die Excel vanwege hun bereik of precisie niet exact kan weergeven, worden als tekst opgeslagen om alle cijfers te behouden. JSON-tekenreeksen blijven tekst. Zo behouden codes als `"00123"`, datums die als tekst zijn opgeslagen en tekst die met `=` begint hun oorspronkelijke tekens.

## Voorbeeld bekijken en downloaden in de browser

Het voorbeeld toont het eerste deel van het werkblad. Het gedownloade XLSX-bestand bevat alle records en kolommen. De omzetting gebeurt in je browser en je JSON blijft op je apparaat. Gebruik voor export als platte tekst de [JSON → CSV-converter](../json-to-csv-converter/).
