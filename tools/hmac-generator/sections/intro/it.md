## Cos'è HMAC?

HMAC (Hash-based Message Authentication Code) è un meccanismo crittografico che combina una chiave segreta con una funzione hash per verificare sia l'integrità che l'autenticità di un messaggio.

**Come funziona:**

1. La chiave segreta viene combinata con il messaggio
2. Una funzione hash (come SHA-256) elabora i dati combinati
3. Il risultato è un codice di autenticazione di dimensione fissa

**Casi d'uso comuni:**

- **Autenticazione API**: Firma delle richieste API per verificare il mittente
- **Token JWT**: Utilizzato negli algoritmi HS256/HS384/HS512
- **Verifica del Messaggio**: Garantire che i dati non siano stati manomessi
- **Firme Webhook**: Validazione dei payload webhook

**Note sulla sicurezza:**

- Utilizzare sempre una chiave segreta forte e casuale
- Mantenere la chiave segreta riservata
- SHA-256 o superiore è consigliato per le nuove applicazioni
- SHA-1 è considerato debole e dovrebbe essere evitato per usi critici di sicurezza
