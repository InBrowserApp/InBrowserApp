La raccolta di strumenti hash riunisce le utilità di hashing migrate, così puoi scegliere l'algoritmo giusto prima di aprire uno strumento specifico. Copre digest di file quotidiani, controlli di compatibilità legacy, autenticazione dei messaggi con chiave, stringhe Subresource Integrity, hashing delle password, verifica delle password e checksum rapidi non crittografici.

## Quando usare questi strumenti

Usa gli strumenti di digest crittografico quando ti serve un'impronta ripetibile per testo o file, ad esempio per confrontare un archivio scaricato con un checksum SHA-256 pubblicato. Usa HMAC quando il risultato deve dimostrare che qualcuno con un segreto condiviso ha creato o approvato il messaggio. Usa Argon2, bcrypt, PBKDF2 o scrypt per flussi di password e derivazione di chiavi, dove il costo configurabile conta più della velocità pura.

## Scegliere in modo sicuro

Non tutti gli hash sono adatti alla sicurezza. MD4, MD5 e SHA-1 sono utili per sistemi legacy e controlli di compatibilità, ma non dovrebbero essere usati per nuovi progetti di integrità sensibili alla sicurezza. CRC, Adler-32, MurmurHash, CityHash e xxHash sono checksum rapidi o hash per bucketing, non firme resistenti alla manomissione. Quando non sei sicuro, preferisci SHA-256 per checksum pubblici, HMAC-SHA-256 per la verifica con chiave e Argon2id o bcrypt per l'archiviazione delle password.

## Privacy e flusso di lavoro

I singoli strumenti di questa raccolta funzionano nel browser. Testo e file vengono elaborati localmente dallo strumento selezionato, a meno che quello strumento non documenti esplicitamente un comportamento di ricerca pubblica, di cui gli strumenti hash non hanno bisogno. Per materiale sensibile, cancella i valori generati dopo l'uso ed evita di incollare segreti in sessioni del browser condivise o registrate.
