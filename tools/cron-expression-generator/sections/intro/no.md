## Bygg cron-planer visuelt

Cron-uttrykk er kompakte, men en liten endring i feil felt kan flytte en jobb fra "ukedagsmorgener" til "hvert minutt". Denne generatoren gir hvert felt egne kontroller, slik at du kan bygge et standarduttrykk med fem felt uten å memorere alle syntaksregler.

### Når det hjelper

- Lag tidsplaner for CI-jobber, sikkerhetskopier, cache-warmere, rapporter og andre gjentakende oppgaver.
- Start med et kjent forhåndsvalg og finjuster ett felt om gangen.
- Forhåndsvis kommende lokale kjøretider før du limer uttrykket inn i en planlegger.

### Slik bruker du det

1. Velg et hurtigvalg, eller behold standarduttrykket og rediger hvert felt manuelt.
2. Velg om hvert felt skal matche alle verdier, et intervall, bestemte verdier eller et område.
3. Se gjennom det genererte uttrykket og forhåndsvisningen av neste kjøringer, og kopier det deretter inn i planleggeren din.

### Merknader

- Dette verktøyet genererer standard cron med fem felt: minutt, time, dag i måneden, måned og ukedag.
- Søndag vises som `0`, noe som godtas av vanlige cron-planleggere i Unix-stil.
- Hvis både dag i måneden og ukedag er begrenset, kjører mange cron-implementasjoner når ett av feltene samsvarer. Noen systemer oppfører seg annerledes, så kontroller den kombinasjonen i planleggeren du skal bruke.
