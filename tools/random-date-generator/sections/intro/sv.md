## Generera slumpmässiga kalenderdatum i ett intervall

Fyll i **Startdatum** och **Slutdatum**, välj ett datumformat och klicka på **Generera**. Båda datumen ingår i intervallet, så intervallet från `2024-02-28` till `2024-03-01` kan också ge skottdagen `2024-02-29`. Samma datum kan förekomma flera gånger i listan. Kopiera resultaten eller ladda ner en textfil i `UTF-8` med ett datum per rad.

## Välj ISO eller lokalt datumformat

Använd **ISO (YYYY-MM-DD)** för testdata, vid import till kalkylblad eller när datum i textform ska sorteras i kalenderordning. Välj **Lokalt datumformat** för att visa datum i den gregorianska kalendern enligt sidans språk. Exempelvis visas `2024-02-29` som `Feb 29, 2024` på den engelska sidan och som `29.02.2024` på den tyska.

## Samma kalenderdag i alla tidszoner

Intervallets dygnsgränser följer UTC. Ett genererat datum motsvarar samma kalenderdag i alla tidszoner, även när det infaller i början eller slutet av intervallet. Om start- och slutdatum är samma får du det datumet varje gång. Det är användbart när du testar skottdagar eller den första eller sista dagen i en månad.
