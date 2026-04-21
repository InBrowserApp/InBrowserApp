## Hva er en User-Agent?

En User-Agent (UA)-streng identifiserer nettleseren eller appen som gjør en forespørsel, og inneholder vanligvis info om nettleser, OS, enhet og motor. Siden UA-strenger kan forfalskes, bør de brukes som hint, ikke sikkerhetssignal.

### Hva denne parseren viser

Dette verktøyet analyserer den innlimte UA-strengen lokalt i nettleseren din og grupperer resultatet etter nettleser, operativsystem, motor, enhet, CPU og JSON-utdata. Ingenting lastes opp.

### Eksempel

Lim inn en vanlig Chrome-på-Windows-streng som denne:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Resultatet bør identifisere Chrome 115 på Windows 10, Blink-motoren og CPU-arkitekturen amd64.

### Viktig merknad

Moderne nettlesere er i økende grad avhengige av Client Hints, så en kopiert UA-streng viser ikke alltid alt et nettsted kan se under en ekte forespørsel.
