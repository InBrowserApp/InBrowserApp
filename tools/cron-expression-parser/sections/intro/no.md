## Forstå Cron-planer før du tar dem i bruk

Cron-uttrykk er kompakte, men en liten feil i et felt kan kjøre en jobb langt oftere, eller langt sjeldnere, enn ment. Denne parseren validerer uttrykket i nettleseren din, forklarer tidsplanen i klart språk, deler opp hvert felt og forhåndsviser kommende kjøretidspunkter.

### Når du bør bruke den

- Sjekk en tidsplan for utrulling, sikkerhetskopiering, opprydding eller varsling før du legger den til på en server, i et CI-system eller i en task runner.
- Sammenlign et kopiert cron-uttrykk med tidsplanen du faktisk forventer.
- Lær bort eller feilsøk cron-syntaks ved å endre ett felt om gangen og se forklaringen oppdateres.

### Støttet format

Verktøyet støtter standard Unix-cron-uttrykk med fem felt: minutt, time, dag i måneden, måned og ukedag. Det godtar også et uttrykk med seks felt med sekunder først for planleggere som støtter presisjon på sekundnivå.

### Slik leser du resultatet

Sammendraget gir en beskrivelse i klart språk, mens felttabellen viser hvordan råuttrykket deles opp. De kommende kjøretidspunktene bruker nettleserens lokale tidssone, så sammenlign dem med tidssonen som brukes av planleggeren som skal kjøre jobben.

### Merknader

- Ukedagsverdier bruker vanligvis `0` eller `7` for søndag, og navn som `MON` eller `FRI` godtas også.
- Månedsnavn som `JAN` eller `DEC` kan gjøre produksjonsplaner enklere å gjennomgå.
- Hvis planleggeren din bruker en annen cron-dialekt, må du bekrefte spesialtoken som `?`, `L`, `W` eller `#` i planleggerens egen dokumentasjon.
