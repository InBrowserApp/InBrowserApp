## Cos'è scrypt?

scrypt è una funzione di derivazione di chiavi basata su password (KDF) memory-hard. Trasforma una password e un salt in byte di chiave deterministici consumando intenzionalmente tempo CPU e memoria, rendendo gli attacchi su larga scala alle password più costosi rispetto a un semplice hashing.

**Punti chiave:**

- Usa `N` (fattore di costo), `r` (dimensione blocco) e `p` (parallelismo)
- Impostazioni più alte di `N` e `r` aumentano il costo in memoria e calcolo
- Produce la stessa chiave derivata solo quando password, salt, parametri e lunghezza dell'output coincidono

**Buone pratiche:**

- Usa un salt casuale univoco per ogni password o segreto
- Salva `N`, `r`, `p`, formato del salt e lunghezza dell'output accanto alla chiave derivata
- Regola i parametri sul dispositivo più lento che devi supportare prima di usarli in produzione
