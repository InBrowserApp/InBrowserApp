## Perché la decodifica Base85 è utile

Base85 compare quando dati binari devono passare attraverso sistemi solo testuali con meno overhead rispetto a esadecimale o Base64. Puoi incontrarlo in flussi PostScript o PDF, payload Z85 di ZeroMQ, acquisizioni di debug, esportazioni archiviate e strumenti che richiedono caratteri stampabili invece di byte binari grezzi.

## In cosa ti aiuta questo decoder

Questo strumento riconverte testo ASCII85 o Z85 nei byte originali direttamente nel browser. Puoi incollare dati codificati, importare un file, cambiare alfabeto per adattarlo al sistema di origine, visualizzare in anteprima il risultato decodificato e scaricare il binario recuperato senza inviare nulla a un server.

## Cosa tenere presente

- ASCII85 e Z85 non sono intercambiabili. Scegliere l’alfabeto sbagliato di solito causa errori di decodifica o output corrotti.
- Base85 è un formato di codifica, non di cifratura. Il risultato decodificato può essere testo in chiaro, contenuto compresso o dati binari arbitrari.
- Z85 richiede gruppi completi di 5 caratteri, mentre ASCII85 può includere anche delimitatori e abbreviazioni come `z` per blocchi di zeri.
