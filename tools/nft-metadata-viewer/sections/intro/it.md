## Cerca i metadati NFT tramite indirizzo del contratto e ID del token

Incolla un **Indirizzo del contratto** sulla rete principale Ethereum e inserisci l’**ID del token**, quindi seleziona **Visualizza metadati**. L’ID del token può essere un numero decimale come `1` o esadecimale come `0x1`. Seleziona **Prova un esempio** per vedere una ricerca completa. Il visualizzatore esegue nel browser una richiesta RPC Ethereum in sola lettura, così puoi cercare un token pubblico senza collegare un portafoglio.

## Trova l’URI del token, l’immagine, gli attributi e il JSON

Il visualizzatore legge `tokenURI` per ERC-721 o `uri` per ERC-1155. L’**URI del token** è la stringa restituita dal contratto. Il visualizzatore legge i metadati a cui punta e mostra l’immagine, il nome e gli attributi quando questi campi sono disponibili. Usa **JSON originale** per esaminare o copiare la risposta senza modifiche. Sono supportati IPFS, HTTP, Arweave e URI di dati JSON incorporati.

## Come funziona la sostituzione dell’ID del token ERC-1155

Un contratto ERC-1155 può restituire un modello condiviso da più token. Il visualizzatore sostituisce `{id}` con l’ID del token rappresentato da 64 cifre esadecimali minuscole, con zeri iniziali e senza prefisso `0x`. Se il modello cambia, **URI risolto** mostra l’indirizzo richiesto per quel token. La stessa sostituzione viene applicata ai campi di anteprima, come il link all’immagine.

## Cosa fare se compare un URI del token senza immagine?

Un contratto può restituire un URI anche quando il suo host web o gateway IPFS è temporaneamente non disponibile. Il visualizzatore mantiene l’URI disponibile per la copia quando non riesce a caricare i metadati. Se il JSON è disponibile, esamina il campo `image` e prova direttamente la fonte. Gli host HTTP possono anche limitare le richieste tra origini, influendo su ciò che il browser può leggere.

Consulta lo [standard ERC-721](https://eips.ethereum.org/EIPS/eip-721), la [specifica dei metadati ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) e la [guida ai metadati di OpenSea](https://docs.opensea.io/docs/metadata-standards) per i campi comunemente usati dalle app NFT.
