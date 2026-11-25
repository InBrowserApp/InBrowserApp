## Willekeurige VIN's genereren voor tests

Stel het aantal in van `1` tot `1000` en kies **Genereren**. Elke regel bevat één voertuigidentificatienummer (VIN) van 17 tekens. Kies **Alles kopiëren** om de groep in een testformulier of spreadsheet te plakken, of **TXT downloaden** om een tekstbestand met één VIN per regel op te slaan.

## Het VIN en het controlecijfer lezen

De eerste drie tekens vormen de fabrikantcode. Het vierde tot en met het achtste teken beschrijven het voertuig en het negende teken is het controlecijfer. De laatste acht tekens vormen het voertuigidentificatiegedeelte. De letters `I`, `O` en `Q` worden weggelaten om verwarring met cijfers te voorkomen. Het controlecijfer wordt berekend uit de andere 16 tekens en kan een cijfer van `0` tot en met `9` of `X` zijn. In `1M8GDM9AXKP042788` is het negende teken bijvoorbeeld `X`.

## Een voorbeeld-VIN gebruiken in testgegevens

Gebruik de gegenereerde VIN's om verplichte velden, bulkimport of validatie van het formaat en controlecijfer te testen. Wijzig alleen het negende teken in een ander cijfer en verstuur de waarde opnieuw om te testen of deze wordt afgewezen. De generator maakt synthetische VIN's, dus velden die op een fabrikant, modeljaar of serienummer lijken, moeten als voorbeeldgegevens worden beschouwd. Gebruik voor registratie, het zoeken naar onderdelen of de voertuiggeschiedenis het VIN dat op het voertuig of in de documenten staat.
