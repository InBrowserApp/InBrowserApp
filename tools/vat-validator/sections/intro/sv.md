## Vad är ett EU-momsnummer?

Ett momsregistreringsnummer utfärdas av en EU-medlemsstat till företag som är registrerade för mervärdesskatt. Det börjar med en tvåbokstavig landskod (till exempel `BE` för Belgien eller `EL` för Grekland), följt av en landsspecifik sekvens av siffror och ibland bokstäver. Skattemyndigheter använder det för att spåra gränsöverskridande handel och återbetalningskrav, så misstag på fakturor, avtal eller inköpsunderlag kan lätt blockera en betalning eller utlösa en granskning.

## Vad det här verktyget faktiskt kontrollerar

Den här kontrollen kör tre oberoende valideringar, alla i din webbläsare:

1. **Landskod** — de två inledande bokstäverna måste matcha en EU-medlemsstat som deltar i momssystemet (inklusive den särskilda `EL`-koden som används för Grekland).
2. **Format** — de återstående tecknen måste matcha landets dokumenterade momsformat. Till exempel består belgiska momsnummer av exakt tio siffror, österrikiska momsnummer börjar med `U` följt av åtta siffror, och nederländska momsnummer har formen `<nio siffror>B<två siffror>`.
3. **Kontrollsumma** — där det finns en deterministisk kontrollsumma i landets momsregler (Österrike, Belgien, Danmark, Finland, Frankrike, Tyskland, Italien, Nederländerna, Polen, Portugal, Spanien, Sverige) beräknas den sista siffran eller bokstaven om och jämförs.

Ett nummer som klarar alla tre är syntaktiskt korrekt. Det är inte samma sak som att bekräfta att företaget är registrerat just nu — för det behöver du fortfarande Europeiska kommissionens VIES-tjänst eller den lokala skattemyndigheten. Det här verktyget används bäst före den sista kontrollen, för att fånga de stavfel, omkastade siffror och klipp-och-klistra-fel som får en VIES-förfrågan att misslyckas av fel anledning.

## Vanliga saker det fångar

- Nummer som ser rätt ut vid första anblick men saknar rätt land (till exempel börjar med `US` eller `UK`).
- Inledande nollor som trimmats bort av ett kalkylblad, vilket ger ett nummer som är en siffra för kort.
- Mellanslag, punkter eller bindestreck som ett faktureringssystem klistrat in — verktyget normaliserar bort dem och kontrollerar resultatet.
- Den klassiska förväxlingen mellan grekiska `GR` och momskoden `EL`, som formatkontrollen omedelbart avvisar.

## Vad resultatkortet visar

Utöver en enkel giltig/ogiltig-markering visar resultatet landet, det normaliserade numret, det format landet förväntar sig och huruvida kontrollsumman gick igenom, misslyckades eller hoppades över eftersom landet inte publicerar någon. Den detaljen är användbar när du behöver förklara en avvisning — "formatet stämmer, kontrollsumman håller inte med" är mycket mer användbart än "ogiltigt".

## Integritet

Varje kontroll körs lokalt i din webbläsare. Ingenting skickas till en server, loggas eller lagras någon annanstans än i din egen webbläsares localStorage (för den senaste inmatningen du skrev, så att den finns kvar efter en omladdning av sidan). Du kan klistra in en kunds momsnummer utan att oroa dig för var det hamnar.
