## Che cos’è Base85?

Base85 è una codifica da binario a testo che trasforma 4 byte in 5 caratteri stampabili. È più compatta di Base64 e questo strumento ti permette di scegliere tra ASCII85 e Z85 in base al formato richiesto dal sistema di destinazione.

## Quando usarlo

- Per codificare byte, testo o file destinati a canali solo testuali mantenendo un output relativamente compatto.
- Usa ASCII85 quando ti serve un formato flessibile che supporti byte finali parziali.
- Usa Z85 quando ti serve testo Base85 compatibile con ZeroMQ e la lunghezza dell’input è un multiplo esatto di 4 byte.

## Cosa tenere presente

- Base85 è un formato di codifica, non di cifratura.
- ASCII85 e Z85 usano alfabeti diversi, quindi non sono intercambiabili.
- Z85 rifiuta dati la cui lunghezza in byte non è divisibile per 4, mentre ASCII85 può codificare blocchi finali parziali.
