## Cos'è MurmurHash3 (x64 128-bit)?

MurmurHash3 è un algoritmo hash non crittografico veloce progettato per
checksum ripetibili e ben distribuiti. La variante x64 a 128 bit restituisce
un valore di 16 byte, di solito mostrato come 32 caratteri esadecimali, il che
lo rende più adatto degli hash a 32 bit quando vuoi un identificatore più ampio
per grandi insiemi di record, file o chiavi di cache.

**Dove è utile:**

- **Tabelle hash e sharding**: Crea chiavi stabili per bucket, partizioni o
  tabelle di lookup.
- **Deduplicazione**: Confronta grandi insiemi di testi o file con impronte
  compatte a 128 bit prima di effettuare controlli più approfonditi.
- **Chiavi di cache**: Produce identificatori deterministici per artefatti di
  build, dati trasformati o contenuti generati.
- **Controlli di integrità non legati alla sicurezza**: Rileva modifiche
  accidentali durante l'archiviazione o il trasferimento quando non sono
  richieste garanzie crittografiche.

**Comportamento del seme:**

Il seme facoltativo è un valore intero senza segno a 32 bit. Usa lo stesso seme
quando devi far corrispondere i risultati a un altro sistema e lascialo a `0`
quando non hai uno specifico requisito di compatibilità. Sono accettati valori
decimali e valori esadecimali `0x`; i valori più grandi vengono ricondotti allo
stesso intervallo a 32 bit usato dall'algoritmo.

**Note sulla sicurezza:**

MurmurHash3 non è un algoritmo per hashing di password, firma o verifica a
prova di manomissione. Usa SHA-256, HMAC o uno strumento per l'hashing delle
password quando l'output deve avere proprietà di sicurezza. Questo strumento è
più adatto per hashing locale, offline e orientato alle prestazioni, dove
velocità e distribuzione stabile contano più della resistenza agli attacchi.
