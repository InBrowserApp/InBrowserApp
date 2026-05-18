## Cosa converte questo strumento

Questo convertitore tratta un UUID come il valore a 128 bit che è realmente e
mantiene sincronizzate le rappresentazioni comuni. Incolla un UUID, un valore
Base64, una stringa esadecimale, un intero decimale, un valore ottale o un
valore binario, e gli altri formati si aggiornano localmente nel browser.

## Come leggere i formati

Il campo UUID mostra la forma canonica con trattini. L'esadecimale è costituito
dagli stessi 16 byte come 32 cifre esadecimali minuscole. Base64 è il Base64
standard con padding per i 16 byte grezzi, non il Base64 dei caratteri testuali
dell'UUID. Decimale, ottale e binario mostrano l'UUID come un singolo intero
senza segno a 128 bit; l'output binario viene riempito a sinistra fino a tutti
i 128 bit, così gli zeri iniziali restano visibili.

## A cosa prestare attenzione

I valori fuori dall'intervallo UUID a 128 bit vengono rifiutati. L'input Base64
deve decodificare esattamente in 16 byte. Il convertitore accetta varianti
incollate comuni come UUID in maiuscolo, prefissi `urn:uuid:`, parentesi
graffe, UUID compatti a 32 cifre esadecimali, spazi attorno a valori numerici
lunghi e Base64 URL-safe. Nulla viene caricato mentre converti o generi l'UUID
di esempio.
