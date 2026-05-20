Genera ULID localmente nel browser per record, eventi, log, fixture e sistemi distribuiti che richiedono identificatori compatti con prefissi ordinabili per tempo. Ogni valore viene creato su questo dispositivo e può essere copiato o scaricato senza inviare il batch a un altro servizio.

## Perché usare ULID

ULID sta per Universally Unique Lexicographically Sortable Identifier. Combina un timestamp Unix in millisecondi da 48 bit con 80 bit di casualità, quindi codifica il risultato come stringa Crockford Base32 di 26 caratteri. Questa forma rende gli ULID sicuri per gli URL, adatti ai database e naturalmente ordinabili per ora di creazione.

## Ora attuale o personalizzata

Usa l'ora attuale per record applicativi normali, chiavi di importazione e dati di test che devono riflettere il momento in cui sono stati creati. Passa a un timestamp personalizzato quando ti servono esempi dall'aspetto deterministico, righe inserite retroattivamente, eventi riprodotti o fixture che devono ordinarsi intorno a un momento specifico.

## Batch monotoni

Quando la modalità batch monotono è abilitata, gli ID generati per lo stesso millisecondo incrementano il segmento casuale, così il batch rimane ordinato lessicograficamente dall'alto verso il basso. Disattivala quando vuoi che ogni riga usi invece un segmento casuale nuovo. Entrambe le modalità mantengono il timestamp visibile nei primi dieci caratteri.
