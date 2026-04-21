Converti numeri interi tra binario, ottale, decimale, esadecimale, Base32, Base36, Base62, Base64 e basi personalizzate da 2 a 64 direttamente nel browser. Tutto viene calcolato localmente con BigInt, così puoi controllare valori grandi senza inviarli a un server.

## Quando usarlo

Usa questo strumento quando lo stesso intero appare in log, protocolli, ID o specifiche con alfabeti diversi. Modificando un campo, tutti gli altri vengono ricalcolati subito, utile per debug, documentazione e verifica manuale.

## Differenze tra basi

Fino alla base 36 le lettere sono accettate senza distinzione tra maiuscole e minuscole. Le basi superiori trattano maiuscole e minuscole come cifre diverse, e la riga Base64 usa l’alfabeto numerico `A-Z a-z 0-9 + /`, non la codifica Base64 testuale orientata ai byte.

## Cose da tenere presenti

Sono supportati solo interi non negativi. Gli zeri iniziali sono considerati formattazione, quindi l’output convertito viene normalizzato e può perdere il padding digitato.
