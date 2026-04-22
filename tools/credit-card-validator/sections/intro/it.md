## Cos'è la Validazione della Carta di Credito?

La validazione della carta di credito è un processo per verificare se un numero di carta è potenzialmente valido prima di elaborare una transazione. Utilizza l'algoritmo di Luhn e l'identificazione del brand della carta per verificare il formato.

### Algoritmo di Luhn

L'algoritmo di Luhn (noto anche come Mod 10) è una formula di checksum utilizzata per validare i numeri di identificazione. Ecco come funziona:

1. Partendo dalla cifra più a destra, raddoppia ogni seconda cifra
2. Se il raddoppio risulta in un numero maggiore di 9, sottrai 9 dal risultato
3. Somma tutte le cifre. Se il totale è divisibile per 10, il numero è valido

### Brand di Carte Supportati

I brand delle carte sono identificati dal loro BIN (Bank Identification Number) o IIN (Issuer Identification Number), che sono le prime cifre del numero della carta.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
