## Vad är en User-Agent?

En User-Agent (UA)-sträng identifierar webbläsaren eller appen som gör en begäran och innehåller vanligtvis information om webbläsare, OS, enhet och motor. Eftersom UA-strängar kan förfalskas bör de ses som ledtrådar, inte som säkerhetssignaler.

### Vad den här parsern visar

Det här verktyget analyserar den inklistrade UA-strängen lokalt i din webbläsare och grupperar resultatet efter webbläsare, operativsystem, renderingsmotor, enhet, CPU och JSON-utdata. Ingenting laddas upp.

### Exempel

Klistra in en vanlig Chrome-på-Windows-sträng som den här:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Resultatet bör identifiera Chrome 115 på Windows 10 samt Blink-motorn och CPU-arkitekturen amd64.

### Viktigt att veta

Moderna webbläsare förlitar sig allt mer på Client Hints, så en kopierad UA-sträng visar inte alltid allt som en webbplats kan se vid en riktig begäran.
