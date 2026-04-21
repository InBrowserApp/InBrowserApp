## Che cos'è SHAKE256 (FIPS 202)?

SHAKE256 (FIPS 202) è una funzione a output estendibile (XOF) della famiglia SHA-3. A differenza delle funzioni hash a lunghezza fissa, può restituire qualsiasi numero di bit in uscita mantenendo una sicurezza di 256 bit. È standardizzata dal NIST in FIPS 202 ed è basata sulla costruzione a spugna di Keccak.

Questa flessibilità è utile quando un protocollo, un formato di file o una regola interna di checksum richiedono una lunghezza di digest specifica. In questo strumento puoi calcolare l'hash di testo semplice o file caricati e scegliere la lunghezza di output in bit, purché sia un multiplo di 8.

Gli usi comuni includono hashing di protocolli, derivazione di chiavi, digest crittografici a lunghezza variabile e flussi di integrità dei dati in cui lo stesso input e la stessa lunghezza di output devono produrre sempre lo stesso risultato.
