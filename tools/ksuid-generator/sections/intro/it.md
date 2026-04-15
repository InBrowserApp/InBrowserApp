Genera KSUID localmente nel browser senza inviare il lotto corrente a un altro servizio. Questo strumento è utile quando ti servono identificatori che restino univoci in sistemi distribuiti e che allo stesso tempo si ordinino in modo approssimativo per momento di creazione in log, feed, importazioni o record ordinati.

## Perché Usare KSUID

KSUID combina un timestamp a 32 bit con 128 bit di casualità e codifica il risultato come una stringa Base62 di 27 caratteri. In questo modo ogni ID resta compatto, adatto agli URL e facile da archiviare, mentre il timestamp incorporato fa sì che i valori più recenti si trovino in genere dopo quelli più vecchi.

## Scegliere L'ora Attuale O Personalizzata

Usa l'ora attuale quando vuoi nuovi ID per dati di produzione, demo o generazione batch ordinaria. Passa a un timestamp personalizzato quando ti servono fixture riproducibili, record backfillati, esempi di migrazione o casi di test che debbano sembrare creati in un momento specifico.

## Cose Da Sapere Prima Di Esportare

KSUID conserva solo la precisione al secondo, quindi qualsiasi input con millisecondi viene arrotondato per difetto all'inizio di quel secondo. Gli ID creati nello stesso secondo restano univoci, ma il loro ordine finale dipende anche dal payload casuale, quindi è meglio considerare KSUID ordinabile nel tempo, non strettamente sequenziale.
