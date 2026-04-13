## Cos'è l'escape Unicode?

L'escape Unicode converte i caratteri in sequenze codificate che rappresentano i rispettivi code point Unicode. È essenziale quando il codice sorgente, i file di configurazione o i formati dati non possono contenere direttamente determinati caratteri.

**Formati di escape comuni:**

- `\uXXXX` — JavaScript / JSON, utilizzato nella maggior parte dei linguaggi di programmazione
- `\u{XXXXX}` — JavaScript ES6+, supporta i caratteri supplementari senza coppie surrogate
- `&#xXXXX;` / `&#DDDD;` — Entità HTML in formato esadecimale o decimale
- `U+XXXX` — Notazione Unicode standard usata nella documentazione
- `\xXX` / `%XX` — Codifica a livello di byte UTF-8, comune negli URL e nei linguaggi simili al C
- `\UXXXXXXXX` — Formato Python a 8 cifre per qualsiasi code point
- `0xXXXX` — Notazione letterale esadecimale

## Quando usare questo strumento

- Incorporare caratteri non ASCII nel codice sorgente o nei file di configurazione che richiedono una codifica ASCII-safe
- Eseguire il debug di testo corrotto ispezionando i code point Unicode sottostanti
- Convertire tra diverse notazioni di escape durante il porting tra linguaggi o formati
- Preparare testo per contesti JSON, HTML o URL che necessitano di caratteri codificati come entità

## Come funziona

Digita o incolla del testo normale a sinistra e lo strumento codifica i caratteri non ASCII utilizzando il formato selezionato. Incolla del testo codificato a destra e lo strumento rileva automaticamente e decodifica tutti i formati supportati simultaneamente. Tutto viene eseguito localmente nel browser.
