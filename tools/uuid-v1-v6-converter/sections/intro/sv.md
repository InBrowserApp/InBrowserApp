UUID v1 och UUID v6 innehåller samma kärninformation: en tidsstämpel, en klocksekvens och en nodidentifierare. UUID v1 lagrar tidsstämpeln i den historiska UUID-fältordningen, medan UUID v6 ordnar om dessa tidsstämpelbitar så att enkel lexikografisk sortering följer skapandetiden på ett mer naturligt sätt.

Använd det här verktyget när du behöver flytta identifierare mellan system som förväntar sig olika tidsbaserade UUID-layouter. Klistra in ett UUID v1 för att få motsvarande UUID v6, eller klistra in ett UUID v6 för att återskapa UUID v1-representationen. Konverteringen är deterministisk och behåller klocksekvensen och nodens bytevärden oförändrade.

## När du ska använda det

- Migrera poster från äldre UUID v1-lagring till UUID v6 samtidigt som identitetsmetadata bevaras.
- Felsöka databaser, loggar eller köer som blandar UUID v1- och UUID v6-värden.
- Kontrollera om ett UUID v6-värde mappas tillbaka till det UUID v1-värde som en äldre integration förväntar sig.

## Indataformat

Konverteraren accepterar kanoniska UUID-strängar med bindestreck, kompakta UUID-strängar med 32 tecken, UUID med versaler, `urn:uuid:`-värden och UUID inom klamrar. Resultat normaliseras alltid till kanonisk UUID-form med gemener.

## Integritets- och kompatibilitetsnoteringar

UUID v1 och UUID v6 kan koda skapandetid och nodinformation. Behandla dem som operativa identifierare, inte hemligheter, och undvik att exponera dem när tidsstämpel- eller nodmetadata kan vara känsliga. Det här verktyget körs lokalt i din webbläsare och laddar inte upp dina UUID.
