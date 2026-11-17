## Vad är en systemnyckel för äldre Motorola-system?

En programvarubaserad systemnyckel är en `.KEY`-fil som används av kompatibel programmeringsprogramvara från Motorola för att möjliggöra redigering av skyddade inställningar i trunkade radiosystem. Den här generatorn återskapar det äldre formatet som bygger på BatLabs för ett system-ID. En systemnyckel skiljer sig från en krypteringsnyckel för radiotrafik och ger i sig inte åtkomst till ett radionät.

## Så använder du generatorn

1. Ange ett system-ID med 1–4 hexadecimala siffror (`0–9`, `A–F`), utan prefixet `0x`. Gemener accepteras, och korta ID:n fylls ut med inledande nollor: `ab` blir `00AB`.
2. Kontrollera det normaliserade ID:t, filnamnet och den hexadecimala förhandsgranskningen.
3. Ladda ned den binära `.KEY`-filen och läs in den i kompatibel äldre programmeringsprogramvara. Filen är 27 byte; system-ID `1234` ger `SYS01234.KEY`.

## Kompatibilitetsbegränsningar

Verktyget följer ett publicerat äldre format; kompatibiliteten beror på programmeringsprogramvaran. Det stöder inte ASTRO 25 Portable CPS (inklusive XTS5000), APX CPS eller Advanced System Keys (ASK). Att filen följer referensens byteformat bekräftar inte kompatibilitet med en viss radio eller CPS-version.

## Integritet

Generering, validering och förhandsgranskning av filer sker lokalt i webbläsaren. Ditt system-ID och din genererade nyckel skickas inte till någon server.
