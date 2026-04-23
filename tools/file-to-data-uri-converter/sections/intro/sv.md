## Vad är Data URI?

Data URI (eller data URL) bäddar in små filer direkt i text. Format: `data:[mime][;charset][;base64],data`.

**Vanliga användningar:**

- Inline-bilder eller typsnitt i HTML/CSS
- Lagra små resurser i JSON/konfig

**Noteringar:**

- Bäst för små filer; långa strängar kan göra sidor långsammare
- Base64 är vanligt för binära data

### Exempel

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Allt före kommat beskriver filen, till exempel dess MIME-typ och om den använder Base64. Allt efter kommat är den kodade nyttolasten.

### När den här konverteraren är lämplig

- Omvandla en lokal fil till en sträng som kan bäddas in i HTML, CSS, JSON eller e-postmallar
- Skapa en snabb fristående demo utan att behöva hosta resursen någon annanstans
- Kontrollera den upptäckta MIME-typen innan du klistrar in resultatet i ett annat verktyg

### Praktiska begränsningar

- Data URI:er passar bäst för små filer som ikoner, små bilder eller korta kodsnuttar
- Base64 lägger till ungefär 33 % overhead, så den färdiga strängen blir större än originalfilen
- Mycket långa strängar kan vara besvärliga att klistra in i formulär, konfigurationer eller redigerare med storleksgränser
