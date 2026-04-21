## Cosa Fa

Questo strumento analizza header Cookie e Set-Cookie grezzi in JSON strutturato direttamente nel browser. Puoi incollare una singola riga di header, più righe o soltanto i valori senza i prefissi abituali.

## Cookie Vs. Set-Cookie

Un header Cookie contiene di solito più coppie nome/valore inviate dal client. Un header Set-Cookie definisce invece normalmente un solo cookie con attributi come Path, Secure, HttpOnly, SameSite, Expires o Max-Age.

## Note

Il parser funziona interamente in locale e non carica gli header su alcun server. I segmenti non validi vengono mantenuti in un elenco separato per individuare rapidamente stringhe cookie non corrette.
