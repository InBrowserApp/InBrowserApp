## Stima i costi di archiviazione Filecoin Onchain Cloud

Inserisci la dimensione dei dati, la **Conservazione (giorni)** e il numero di **Copie**. Il calcolatore stima il costo di archiviazione di un nuovo set di dati per ogni copia con Filecoin Warm Storage Service. Mostra la tariffa mensile di archiviazione e prova, la spesa per il periodo selezionato e i costi per creare i set di dati e aggiungere piece. Gli importi sono espressi in USDFC. Il mese tariffario di Filecoin dura 30 giorni.

## Come viene calcolata la stima di archiviazione

Ogni set di dati attivo paga una tariffa di archiviazione basata sulla dimensione più una quota fissa per Proof of Data Possession (PDP). Ad esempio, con una tariffa di 2,50 USDFC per TiB e una quota di prova di 0,12 USDFC per copia, un TiB con due copie costa circa 5,24 USDFC ogni 30 giorni. La stima usa la dimensione dei dati inserita. Filecoin ricava la dimensione esatta fatturata dalle foglie contenenti dati, che possono aggiungere fino a 31 byte per piece.

## Pianifica i costi di caricamento e la riserva rimborsabile

Apri **Dettagli del caricamento** per inserire quanti piece e batch di caricamento conterrà ogni copia. Il valore predefinito è un piece in un batch. Ogni copia ha un costo di creazione del proprio set di dati; l’aggiunta di piece prevede una quota base per batch più una quota per piece. La riserva per il ciclo di vita è un saldo trattenuto dal servizio per coprire le operazioni. La riserva mostrata è distinta dalla spesa stimata e i fondi non utilizzati vengono svincolati dopo la liquidazione. Questa stima copre un nuovo caricamento e il relativo periodo di archiviazione. Il recupero dei dati e le operazioni successive comportano costi propri.

## Da dove provengono le tariffe Filecoin

La pagina calcola usando le tariffe di riferimento datate mostrate accanto al risultato. Seleziona **Aggiorna tariffe della rete principale** per leggere il contratto tariffario Warm Storage tramite un RPC Filecoin pubblico. Il browser usa i valori restituiti e mostra il blocco da cui provengono. Puoi calcolare con le tariffe di riferimento anche quando la richiesta non è disponibile.

Consulta la [guida Filecoin ai costi di archiviazione](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) per le dimensioni esatte fatturate, il finanziamento specifico dell’account e il tariffario completo.
