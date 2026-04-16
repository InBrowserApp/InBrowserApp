## Che cos'è il BIC/SWIFT?

BIC (Bank Identifier Code), noto anche come codice SWIFT, identifica le istituzioni finanziarie nei pagamenti internazionali.

### Struttura del BIC

Un BIC è lungo 8 o 11 caratteri: codice banca (4 lettere), codice paese (2 lettere), codice località (2 alfanumerici) e codice filiale opzionale (3 alfanumerici).

### Regole di validazione

La validazione verifica lunghezza, set di caratteri e codici paese ISO 3166.

1. Rimuovi spazi e trattini
2. Verifica che il formato sia di 8 o 11 caratteri
3. Analizza i codici banca, paese, località e filiale

Il codice filiale "XXX" o un BIC di 8 caratteri indica la sede principale.

Il secondo carattere del codice località 0 indica un BIC di test; 1 indica un partecipante passivo.
