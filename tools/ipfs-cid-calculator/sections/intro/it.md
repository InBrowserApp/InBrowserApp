## Calcola il CID di un file o di una cartella

Scegli un file o una cartella locale, quindi seleziona **Calcola CID**. Copia l’identificatore di contenuto (CID) per registrarlo in un manifest o confrontarlo con una precedente importazione IPFS. Il calcolo avviene nel browser: i file rimangono sul dispositivo e non vengono pubblicati su IPFS.

## Perché lo stesso file può avere CID IPFS diversi?

IPFS può suddividere un file in blocchi e memorizzare i collegamenti tra essi con UnixFS. Il CID radice dipende dal modo in cui i blocchi vengono suddivisi, codificati e organizzati. Per riprodurre un CID, usa la stessa dimensione dei blocchi, la stessa impostazione per i blocchi foglia raw e la stessa struttura delle cartelle dell’importazione originale. Il CID di una cartella include anche i nomi degli elementi contenuti. Il selettore di cartelle del browser omette le sottocartelle vuote. Il selettore di cartelle può omettere anche i collegamenti simbolici.

## Riproduci il CID con Kubo

Apri **Impostazioni di importazione** per cambiare la versione CID, la dimensione dei blocchi, l’impostazione dei blocchi foglia raw o il raggruppamento in una cartella. CIDv1 è il valore predefinito. Usa CIDv0 per ottenere lo stesso risultato di una vecchia importazione che lo utilizzava. **Racchiudi in una cartella** aggiunge una cartella esterna, così puoi indirizzare il file per nome sotto il CID radice.

Copia il comando `ipfs add --only-hash` mostrato per riprodurre il calcolo sullo stesso file o sulla stessa cartella in Kubo. Se hai un CID di una precedente importazione, incollalo nel campo di confronto. Un CIDv0 e un CIDv1 equivalenti corrispondono perché identificano lo stesso blocco. [Documentazione IPFS sugli identificatori di contenuto](https://docs.ipfs.tech/concepts/content-addressing/)
