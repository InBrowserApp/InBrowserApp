## Cos'è la codifica URL?

La codifica URL (chiamata anche codifica percentuale) è un metodo per convertire caratteri speciali in un formato che può essere trasmesso in sicurezza su internet. Gli URL possono contenere solo certi caratteri, quindi qualsiasi carattere non consentito deve essere codificato.

**Come funziona:**

- I caratteri speciali vengono convertiti in `%` seguito dal loro codice ASCII esadecimale
- Esempio: uno spazio diventa `%20`, `{'@'}` diventa `%40`
- Solo lettere (A-Z, a-z), numeri (0-9) e alcuni simboli (- \_ . ~) non necessitano codifica

**Esempi comuni:**

- Spazio → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Perché è necessario:**

- Gli URL hanno caratteri riservati con significati speciali
- Assicura che i dati vengano trasmessi correttamente
- Previene conflitti con la struttura dell'URL
- Richiesto per moduli web e chiamate API
