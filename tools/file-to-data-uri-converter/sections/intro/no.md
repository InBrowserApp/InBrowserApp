## Hva er Data URI?

Data URI (eller data URL) bygger inn små filer direkte i tekst. Format: `data:[mime][;charset][;base64],data`.

**Vanlige bruksområder:**

- Inline-bilder eller skrifter i HTML/CSS
- Lagre små ressurser i JSON/konfig

**Merknader:**

- Best for små filer; lange strenger kan gjøre siden treg
- Base64 er vanlig for binære data

### Eksempel

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Alt før kommaet beskriver filen, for eksempel MIME-typen og om den bruker Base64. Alt etter kommaet er den kodede nyttelasten.

### Når denne konverteren passer godt

- Gjøre en lokal fil om til en streng som kan bygges inn i HTML, CSS, JSON eller e-postmaler
- Lage en rask, selvstendig demo uten å hoste ressursen et annet sted
- Kontrollere den oppdagede MIME-typen før du limer resultatet inn i et annet verktøy

### Praktiske begrensninger

- Data URI-er passer best for små filer som ikoner, små bilder eller korte utdrag
- Base64 gir omtrent 33 % ekstra overhead, så den ferdige strengen er større enn originalfilen
- Svært lange strenger kan være upraktiske å lime inn i skjemaer, konfigurasjoner eller editorer med størrelsesgrenser
