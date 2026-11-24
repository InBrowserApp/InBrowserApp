## Verifica i metadati JSON degli NFT prima del minting

Scegli **File locali** per controllare singoli file JSON o una cartella di raccolta sul tuo dispositivo. Il verificatore segnala per ogni elemento JSON non valido e problemi comuni dei metadati, tra cui nomi vuoti, immagini mancanti, descrizioni non valide e attributi malformati. Usa **Da controllare** per trovare gli elementi da correggere oppure scarica il rapporto completo come JSON.

## Controlla gli URI dei token in blocco

In **URI dei token**, incolla un indirizzo di metadati per riga. Per le raccolte numerate, usa **Modello URI** con un segnaposto come `https://example.com/metadata/{id}.json`. Imposta il primo e l’ultimo ID per controllare un intervallo inclusivo. Il formato decimale usa l’ID così come viene scritto. **Esadecimale ERC-1155** rappresenta ogni ID con 64 caratteri esadecimali minuscoli e zeri iniziali, come specificato per la sostituzione di `{id}` in ERC-1155.

## Controlla i link a immagini e animazioni NFT

Attiva **Controlla disponibilità dei media** per verificare i link `image` e `animation_url`. Seleziona l’intera cartella locale per includere i media indicati da percorsi relativi. Il browser può controllare anche risorse HTTP, IPFS e Arweave. Un errore del gateway, un timeout o una restrizione tra origini può impedire di confermare un link. Controlla quei link nel gateway o nel marketplace che usi. I controlli sui file locali vengono eseguiti nel browser; quelli sugli URI contattano l’host o il gateway pertinente.

Per le definizioni dei campi e la sostituzione nell’URI del token, consulta la [guida ai metadati di OpenSea](https://docs.opensea.io/docs/metadata-standards) e la [specifica dei metadati ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
