## Konvertera en Unix-tidsstämpel till ett datum

Klistra in en tidsstämpel för att se datum och tid i enhetens tidszon, i UTC och i ISO 8601. Verktyget visar också hur länge sedan tidpunkten var eller hur långt fram den ligger. Till exempel visas både `1704067200` sekunder och `1704067200000` millisekunder som `2024-01-01T00:00:00.000Z` i ISO 8601.

## Konvertera ett datum till en Unix-tidsstämpel

Ändra **Datum och Tid** för att omvandla ett lokalt datum och klockslag till en Unix-tidsstämpel i den valda enheten. Klicka på **Nu** för att få den aktuella tidsstämpeln. I loggar och API:er kan du använda ISO 8601-värdet som slutar på `Z` när du behöver en entydig UTC-tid.

## Välj sekunder, millisekunder eller nanosekunder

Unix-tidsstämplar räknar tiden från 1 januari 1970 kl. 00.00 UTC. **Auto** tolkar upp till 10 siffror som sekunder, 11 till 13 som millisekunder och längre värden som nanosekunder. Välj enheten manuellt om du vet vilket format källan använder, särskilt för äldre millisekundvärden eller om datumet verkar fel. Datumvyn visar tiden med millisekundprecision.
