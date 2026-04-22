## Che cos'è l'IBAN?

IBAN (International Bank Account Number) è un identificatore standardizzato dei conti bancari usato per pagamenti internazionali.

### Struttura IBAN

Un IBAN inizia con un codice paese di due lettere, due cifre di controllo e un BBAN specifico del paese.

### Validazione checksum

La validità dell'IBAN viene verificata con l'algoritmo mod-97 della norma ISO 13616.

1. Rimuovi gli spazi e sposta i primi quattro caratteri alla fine
2. Converti le lettere in numeri (A=10, B=11, ..., Z=35)
3. Calcola mod 97; un IBAN valido lascia un resto di 1

Ogni paese definisce una lunghezza e una struttura fisse per la parte BBAN.
