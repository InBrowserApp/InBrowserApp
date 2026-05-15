## Che cos'è un validatore UUID?

Un validatore UUID controlla se un identificatore è scritto nella forma UUID standard di 36 caratteri, ad esempio `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. È utile quando devi verificare ID copiati da log, API, database, fixture di test o input utente prima di farvi affidamento nel codice.

### Input supportato

Questo strumento convalida testo UUID canonico con cinque gruppi esadecimali nel layout `8-4-4-4-12`. Le lettere maiuscole sono accettate e normalizzate in minuscolo. Il nil UUID (`00000000-0000-0000-0000-000000000000`) e il max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) sono trattati come valori speciali validi.

### Dettagli della convalida

Per gli UUID standard, il validatore controlla il nibble della versione e i bit della variante. Le versioni da 1 a 8 sono riconosciute, coprendo gli UUID legacy RFC 4122 e i layout RFC 9562 più recenti come UUID v6, v7 e v8. Il pannello dei risultati suddivide anche l'UUID nei suoi cinque segmenti, così puoi esaminare i byte esatti convalidati.

### Privacy

La convalida viene eseguita interamente nel browser. L'UUID che incolli non viene caricato, quindi lo strumento è sicuro da usare con identificatori interni, chiavi di database e log di produzione di esempio che devono restare locali.
