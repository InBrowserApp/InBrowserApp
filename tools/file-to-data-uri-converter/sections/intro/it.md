## Cos'è Data URI?

Data URI (o data URL) incorpora piccoli file direttamente nel testo. Formato: `data:[mime][;charset][;base64],data`.

**Usi comuni:**

- Immagini o font inline in HTML/CSS
- Salvare piccoli asset in JSON/config

**Note:**

- Ideale per file piccoli; stringhe grandi possono rallentare la pagina
- Base64 è comune per dati binari

### Esempio

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Tutto ciò che precede la virgola descrive il file, ad esempio il tipo MIME e l'uso o meno di Base64. Tutto ciò che segue la virgola è il contenuto codificato.

### Quando usare questo convertitore

- Trasformare un file locale in una stringa incorporabile in HTML, CSS, JSON o email
- Creare una demo autonoma senza dover ospitare la risorsa altrove
- Controllare il tipo MIME rilevato prima di incollare il risultato in un altro strumento

### Limiti pratici

- I Data URI funzionano meglio con file piccoli come icone, immagini leggere o frammenti brevi
- Base64 aggiunge circa il 33% di overhead, quindi la stringa finale è più grande del file originale
- Le stringhe molto lunghe possono essere scomode da incollare in moduli, configurazioni o editor con limiti di dimensione
