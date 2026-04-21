## Che cos'è un User-Agent?

Una stringa User-Agent (UA) identifica il browser o l'app che invia una richiesta e di solito include informazioni su browser, sistema operativo, dispositivo e motore. Poiché può essere falsificata, usala come indizio e non come segnale di sicurezza.

### Cosa mostra questo parser

Questo strumento analizza localmente nel browser la stringa UA incollata e raggruppa il risultato in browser, sistema operativo, motore, dispositivo, CPU e output JSON. Non viene caricato nulla.

### Esempio

Incolla una comune stringa di Chrome su Windows come questa:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Il risultato dovrebbe identificare Chrome 115 su Windows 10, con motore Blink e architettura CPU amd64.

### Nota importante

I browser moderni si affidano sempre di più ai Client Hints, quindi una stringa UA copiata potrebbe non mostrare tutto ciò che un sito vede durante una richiesta reale.
