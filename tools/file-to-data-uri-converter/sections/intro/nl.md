## Wat is Data URI?

Data URI (of data URL) plaatst kleine bestanden direct in tekst. Formaat: `data:[mime][;charset][;base64],data`.

**Veelvoorkomend gebruik:**

- Afbeeldingen of fonts inline in HTML/CSS
- Kleine assets opslaan in JSON/configs

**Opmerkingen:**

- Geschikt voor kleine bestanden; lange strings kunnen pagina's vertragen
- Base64 is gebruikelijk voor binaire data

### Voorbeeld

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Alles vóór de komma beschrijft het bestand, zoals het MIME-type en of Base64 wordt gebruikt. Alles ná de komma is de gecodeerde payload.

### Wanneer deze converter handig is

- Een lokaal bestand omzetten naar een insluitbare tekenreeks voor HTML, CSS, JSON of e-mailmarkup
- Snel een zelfstandige demo maken zonder het bestand ergens anders te hosten
- Het gedetecteerde MIME-type controleren voordat je het resultaat in een andere tool plakt

### Praktische beperkingen

- Data URI's zijn het meest geschikt voor kleine bestanden zoals pictogrammen, kleine afbeeldingen of korte snippets
- Base64 voegt ongeveer 33% overhead toe, waardoor de uiteindelijke tekenreeks groter is dan het originele bestand
- Zeer lange tekenreeksen zijn lastig te plakken in formulieren, configuraties of editors met lengtelimieten
