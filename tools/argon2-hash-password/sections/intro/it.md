## Che cos'è Argon2?

Argon2 è un algoritmo di hashing delle password progettato per rendere costoso il cracking offline delle password. Combina calcoli ripetuti con un costo di memoria configurabile, così gli attaccanti devono impiegare tempo e memoria per ogni tentativo di indovinare una password.

**Perché Argon2id è di solito l'opzione predefinita:**

- Per la maggior parte dei sistemi di archiviazione delle password, bilancia la resistenza agli attacchi a canale laterale e al cracking su GPU meglio dell'uso di Argon2i o Argon2d
- L'output codificato conserva algoritmo, versione, memoria, iterazioni, parallelismo, salt e hash in un'unica stringa portabile
- Un salt casuale univoco impedisce a password identiche di produrre hash memorizzati identici
- Le impostazioni di memoria e iterazioni possono essere aumentate man mano che l'ambiente di verifica diventa più veloce

**Come usare questo strumento:**

1. Inserisci la password che vuoi sottoporre a hash.
2. Mantieni il salt generato o crea un nuovo salt casuale.
3. Scegli la variante Argon2 e regola memoria, iterazioni, parallelismo e lunghezza dell'hash per il sistema che verificherà l'hash.
4. Genera l'hash codificato e memorizza l'intera stringa nel database della tua applicazione.

**Note di sicurezza:**

- Non memorizzare né registrare nei log la password in chiaro.
- Usa un nuovo salt casuale per ogni password.
- Usa il segreto opzionale solo se anche il verificatore ha lo stesso segreto; altrimenti l'hash non potrà essere verificato in seguito.
- Preferisci le impostazioni di memoria e iterazioni più alte che mantengano una latenza di accesso accettabile per gli utenti reali.
