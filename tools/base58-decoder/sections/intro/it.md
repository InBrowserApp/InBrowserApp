## A cosa serve questo strumento

Usa questo strumento per decodificare stringhe Base58 o file di testo e
recuperare i byte originali direttamente nel browser. E utile quando devi
ispezionare dati copiati da API, wallet, log, flussi con QR o passaggi di
importazione ed esportazione senza inviare il contenuto a un server.

## Quando cambiare alfabeto

Base58 non usa un solo alfabeto universale. Bitcoin, Flickr e Ripple hanno
ordini di caratteri differenti. Se un valore non supera la validazione o viene
decodificato con un risultato sbagliato, cambia alfabeto e riprova con quello
usato dal sistema di origine.

## Cose da tenere presenti

Il pannello dei risultati mostra un'anteprima UTF-8 quando i byte decodificati
possono essere letti come testo. Per dati binari o contenuti non testuali, e piu
sicuro scaricare il file .bin e controllare i byte originali. Spazi e ritorni
a capo incollati vengono ignorati, quindi puoi decodificare anche valori spezzati
in email, documenti o terminali.
