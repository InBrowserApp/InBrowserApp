## Apri online un file CAR di IPFS o Filecoin

Seleziona un file `.car` dal tuo dispositivo. L’estrattore legge l’archivio localmente e ne mostra il CID radice. Se l’archivio contiene più radici, scegli quella desiderata. Questi archivi sono Content Addressable aRchives usati da IPFS e Filecoin. I cataloghi di risorse Apple usano un formato diverso con la stessa estensione.

## Estrai file o converti una cartella CAR in ZIP

Apri una cartella per visualizzarne il contenuto. Seleziona un file, quindi scegli **Scarica file** per salvarne i byte originali. Per esportare una cartella insieme alle sue sottocartelle, scegli **Scarica ZIP**. Lo ZIP mantiene la struttura delle cartelle UnixFS.

## Cosa significa un blocco mancante?

Un CAR memorizza il contenuto come blocchi identificati da CID. Una radice può collegarsi a blocchi esterni a un archivio parziale. Quando un elemento richiede un blocco assente, procurati un’esportazione completa dalla fonte oppure scarica un elemento i cui blocchi siano disponibili. I file CAR possono contenere anche dati in altri formati IPLD. Qui l’estrazione di file e cartelle usa UnixFS. [Formato CAR di IPLD](https://ipld.io/specs/transport/car/)
