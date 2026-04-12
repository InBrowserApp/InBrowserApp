## Hva er NanoID?

NanoID er en kompakt og URL-sikker generator for unike ID-er, laget for moderne webapper, API-er og interne verktøy. Standardformatet bruker 21 tegn fra et alfabet med 64 tegn, noe som gir omtrent 126 bit tilfeldighet og likevel holder ID-en kort nok for URL-er, filnavn og testdata.

Alt i dette verktøyet kjører lokalt i nettleseren din. Det tilpassede alfabetet ditt og ID-ene som blir generert, forlater aldri siden, noe som gjør verktøyet praktisk for raske prototyper, generering av fixtures og engangs operative oppgaver.

**Viktige punkter:**

- **URL-sikker**: bruker A-Z, a-z, 0-9, - og \_.
- **Kan tilpasses**: juster lengde og alfabet etter behovene dine.
- **Sikker tilfeldighet**: bruker kryptografisk sikre tilfeldige verdier i nettleseren.
- **Ren tekst-eksport**: kopier eller last ned den gjeldende batchen når du trenger seed-data, demoinnhold eller lister som er klare for import.

**Praktiske råd:**

- Behold standardlengden på 21 tegn når du trenger en sterk generell identifikator med svært lav kollisjonsrisiko.
- Kortere ID-er passer for midlertidige UI-tokens eller lokale mockdata, men kollisjonsrisikoen øker når du reduserer lengden eller genererer større batcher.
- Et større alfabet gir mer entropi per tegn, så du kan ofte gjøre ID-ene kortere uten å ofre for mye unikhet.
- Tilpassede alfabeter bør bare inneholde unike tegn. Duplikater skjevfordeler resultatet, derfor blokkerer dette verktøyet dem før generering.
