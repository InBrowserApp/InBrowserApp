## Hva er chmod?

`chmod` ("change mode") er en Unix/Linux-kommando for å endre fil- og katalogtillatelser. Denne kalkulatoren lar deg gå mellom numeriske tillatelser som `755`, symbolske tillatelser som `rwxr-xr-x` og avkrysningsmatrisen uten å regne det ut manuelt.

## Slik fungerer numeriske tillatelser

Hvert siffer representerer én rolle: eier, gruppe og andre. Inne i hvert siffer betyr `4` lesing, `2` skriving og `1` kjøring. Legg verdiene sammen for å få ønsket tillatelse: `7 = rwx`, `6 = rw-`, `5 = r-x` og `4 = r--`. For kataloger betyr kjøre-biten også at du kan gå inn i katalogen.

## Vanlige chmod-eksempler

- `chmod 755 script.sh` gir eieren full tilgang og lar alle andre lese og kjøre.
- `chmod 644 notes.txt` lar eieren fortsatt skrive, mens andre bare kan lese.
- `chmod 600 .env` er et vanlig valg for private hemmeligheter fordi bare eieren kan lese eller skrive.
- `chmod 775 shared-folder` er nyttig for teamkataloger når gruppen også skal kunne opprette og endre filer.
