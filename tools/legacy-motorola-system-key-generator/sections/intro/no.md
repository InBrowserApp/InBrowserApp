## Hva er en systemnøkkel for eldre Motorola-systemer?

En programvarebasert systemnøkkel er en `.KEY`-fil som brukes av kompatibel programmeringsprogramvare fra Motorola for å gjøre det mulig å redigere beskyttede innstillinger for trunkingsystemer. Denne generatoren gjenskaper det eldre formatet avledet fra BatLabs for en system-ID. En systemnøkkel er forskjellig fra en krypteringsnøkkel for radiotrafikk og gir ikke i seg selv tilgang til et radionettverk.

## Slik bruker du generatoren

1. Angi en system-ID med 1–4 heksadesimale sifre (`0–9`, `A–F`), uten prefikset `0x`. Små bokstaver godtas, og korte ID-er fylles ut med innledende nuller: `ab` blir til `00AB`.
2. Kontroller den normaliserte ID-en, filnavnet og den heksadesimale forhåndsvisningen.
3. Last ned den binære `.KEY`-filen og last den inn i kompatibel eldre programmeringsprogramvare. Filen er på 27 byte; system-ID `1234` gir `SYS01234.KEY`.

## Kompatibilitetsbegrensninger

Dette verktøyet følger et publisert eldre format; kompatibiliteten avhenger av programmeringsprogramvaren. Det støtter ikke ASTRO 25 Portable CPS (inkludert XTS5000), APX CPS eller Advanced System Keys (ASK). Samsvar med referanseformatet på bytenivå bekrefter ikke kompatibilitet med en bestemt radio eller CPS-versjon.

## Personvern

Generering, validering og forhåndsvisning av filer kjøres lokalt i nettleseren. System-ID-en din og den genererte nøkkelen sendes ikke til en server.
