## Calcola un Piece CID da un archivio CAR o un file

Scegli il file esatto che intendi inviare a un provider di archiviazione Filecoin. Seleziona **Calcola Piece CID**, quindi copia l’identificatore richiesto dal tuo flusso di lavoro. Lo strumento mostra anche la dimensione del piece con padding, in byte. Il browser legge il file localmente e lo elabora a blocchi, quindi il contenuto rimane sul tuo dispositivo.

## Quale formato usare?

**Piece CID (v2)** segue [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Di solito inizia con `bafkzci` e contiene le informazioni sulla dimensione del payload richieste dagli strumenti Filecoin più recenti. **CommP precedente (v1)** di solito inizia con `baga6ea4` e viene usato negli accordi di archiviazione Filecoin tradizionali. Se il flusso di lavoro richiede un Piece CID precedente e la dimensione del piece con padding, copia l’impegno precedente e usa la dimensione mostrata accanto. Puoi incollare uno dei due formati per verificare un impegno esistente rispetto al tuo file. Un CommP precedente può corrispondere a file che differiscono solo per gli zeri finali.

## Perché il mio CID IPFS è diverso?

Un CID radice IPFS identifica un blocco o la radice di un file o di una cartella. Un Filecoin Piece CID è un impegno crittografico ai byte esatti del payload di archiviazione dopo l’applicazione delle regole di padding e hashing di Filecoin. Se il payload è un archivio CAR, calcola l’impegno dall’archivio stesso. Due CAR possono avere lo stesso CID radice IPFS ma contenere i blocchi in un ordine diverso, il che può cambiare il Piece CID. Usa lo stesso identico file già calcolato prima di inviare un accordo.

Per le regole del formato e del padding, consulta la [specifica Filecoin Piece](https://spec.filecoin.io/systems/filecoin_files/piece/).
