## Hva verktøyet gjør

Dekodér HTTP Basic Authorization-headeren for å hente brukernavn og passord fra Base64. Nyttig for feilsøking og API-testing.

## Godtatte inndata

Lim inn noe som: Basic dXNlcjpwYXNz
Dette verktøyet godtar også en fullstendig `Authorization: Basic ...`-linje.

## Merknader

- Base64 koder bare innloggingsopplysninger; det beskytter dem ikke.
- Dekoderen deler ved det første `:` og beholder resten i passordet.
- Alt kjøres lokalt i nettleseren din.
