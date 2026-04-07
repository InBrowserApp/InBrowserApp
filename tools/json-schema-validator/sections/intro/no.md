## Hva er JSON Schema-validering?

Bruk dette verktøyet når du vil ha rask tilbakemelding mens du designer payloads, feilsøker API-eksempler eller sjekker om en skjemaendring ødelegger eksempeldata. Alt kjører lokalt i nettleseren, så den rå JSON-en forlater aldri siden.

## Hvor det passer godt

- Gjennomgå eksempel-payloads i API-dokumentasjon.
- Validere mock-data under frontend-arbeid.
- Sjekke formatfølsomme felt som `uuid`, `email` eller `date-time`.

## Hva det ikke erstatter

- Autorisasjon på serversiden og forretningsregler.
- Kontraktssjekker som er avhengige av eksterne referanser eller applikasjonstilstand.
- Full CI-validering mot hele skjemasettet ditt.
