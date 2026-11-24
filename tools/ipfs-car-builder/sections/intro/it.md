## Crea un file CAR da file o da una cartella

Scegli file o una cartella, quindi seleziona **Crea CAR**. Copia il CID radice e salva l’archivio `.car`. Il browser legge la selezione localmente e la raccoglie in un archivio CARv1 con una radice UnixFS. Puoi conservare l’archivio come copia di backup o importarlo in un nodo IPFS o in un servizio di archiviazione.

## Come l’archivio conserva i tuoi file

Un singolo file diventa la radice. Più file condividono una radice di cartella e una cartella selezionata conserva i percorsi dei file. Il selettore di cartelle del browser fornisce i file e i relativi percorsi. Trascina una cartella per includere le sottocartelle vuote, se il browser supporta il trascinamento delle cartelle.

## Cosa indica il CID radice

Il CID radice identifica il file o la cartella inclusi nell’archivio. Il generatore usa le stesse impostazioni CIDv1 predefinite del Calcolatore CID IPFS, quindi la stessa struttura di input produce lo stesso identificatore di contenuto. Per aggiungere l’archivio a Kubo, esegui `ipfs dag import archive.car` usando il nome del file scaricato. [Riferimento dei comandi Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
