# Che cos'è un decodificatore di UUID?

Un decodificatore di UUID spiega la struttura interna di un identificatore univoco universale. Normalizza i formati incollati più comuni, verifica che il valore sia un UUID a 128 bit e mostra versione, variante, byte esadecimali grezzi e rappresentazioni numeriche pronte da copiare.

Gli UUID sono spesso trattati come stringhe opache, ma i quattro bit della versione indicano come è stato creato l'identificatore. Gli UUID di versione 4 sono casuali, le versioni 3 e 5 sono hash basati sul nome e le versioni ordinate temporalmente, come 1, 6 e 7, possono contenere informazioni di timestamp.

## Quando usarlo

Usa questo strumento quando devi ispezionare un identificatore da log, database, API, tracce o dati di test. È utile per confermare se un UUID è casuale o basato sul tempo, convertirlo in decimale o Base64 per un altro sistema e individuare se il campo nodo di un UUID v1 o v6 può esporre un identificatore in stile MAC.

Il decodificatore viene eseguito nel tuo browser e non invia valori UUID a un server. Accetta UUID canonici, valori `urn:uuid:`, UUID tra parentesi graffe, input in maiuscolo e UUID esadecimali di 32 caratteri senza trattini.

## A cosa prestare attenzione

I campi versione e variante degli UUID descrivono il layout dei bit, non se l'identificatore è globalmente univoco nella pratica. Un UUID che sembra valido può comunque essere duplicato se è stato generato male o copiato per errore.

Negli UUID di versione 1 e versione 6, il campo nodo può sembrare un indirizzo MAC. I generatori moderni possono impostare il bit multicast e usare invece un nodo casuale, quindi trattalo come identificatore del nodo a meno che tu non controlli il generatore.
