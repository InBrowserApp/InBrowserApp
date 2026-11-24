## Confronta i CID di due cartelle IPFS

Incolla la cartella originale in **Cartella precedente** e quella aggiornata in **Cartella successiva**, quindi seleziona **Confronta cartelle**. Ogni campo accetta un CID, un indirizzo `ipfs://` o un link a un gateway HTTP. Includi un percorso per confrontare due sottocartelle. Apri un risultato per vedere i relativi CID, filtra l’elenco per percorso o scarica il JSON per salvare il confronto.

## Quando un percorso è aggiunto, rimosso o modificato?

Un percorso presente in una sola cartella è aggiunto o rimosso. Un’intera sottocartella aggiunta o rimossa compare come un unico percorso. Quando entrambe le versioni contengono una sottocartella con CID diversi, lo strumento confronta i percorsi al suo interno. L’elenco delle modifiche include file o link simbolici con CID diversi e percorsi il cui tipo di elemento è cambiato. File importati con impostazioni diverse di suddivisione in blocchi o codifica possono avere CID diversi anche se il contenuto visibile è identico.

## Confronta le versioni IPFS senza scaricare ogni file

Il browser legge blocchi IPFS verificati dai gateway pubblici e salta i rami i cui CID già corrispondono. Questo permette di confrontare le versioni di un sito, di un set di dati pubblicato o di un backup usando gli indirizzi immutabili delle cartelle. È possibile confrontare i collegamenti modificati senza scaricare i file completi. Se un elemento della cartella non è disponibile, il risultato indica i percorsi che non è stato possibile confrontare.

Approfondisci [l’indirizzamento basato sul contenuto e le versioni dei set di dati](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
