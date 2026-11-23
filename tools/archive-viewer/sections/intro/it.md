Apri un archivio 7z, RAR, ZIP o TAR per esplorarne le cartelle prima dell'estrazione. Seleziona un file per visualizzarne l'anteprima o scaricarlo singolarmente.

## Quando usarlo

Usalo quando ricevi un pacchetto compresso e vuoi dare un'occhiata rapida senza decomprimere tutto l'archivio. È utile per controllare pacchetti di rilascio, modelli scaricati, pacchetti di log, istantanee del codice sorgente o un allegato `.gz` con un solo file.

## Privacy e gestione dei file

I contenuti dell'archivio vengono letti localmente nella sessione del browser. Il file non viene caricato su InBrowser.App. Le voci di testo grandi sono limitate nell'anteprima per mantenere la pagina reattiva; scarica l'elemento quando devi ispezionare il file completo.

## Formati archivio supportati

Il visualizzatore apre i formati ZIP, 7z, RAR4, RAR5, TAR, CPIO, AR (compresi i pacchetti `.deb`), CAB, ISO 9660 e LHA. Apre anche singoli file e archivi TAR compressi con GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA o l'utilità UNIX compress (`.Z`). Ad esempio, apri un pacchetto di rilascio `.tar.zst` per esplorarne le cartelle oppure un log `.zst` per scaricare il file decompresso.

Usa un programma per archivi installato sul computer per i file crittografati, gli archivi suddivisi in volumi, gli archivi solidi RAR4 o gli elementi oltre 512 MiB nei formati aggiunti di recente. L'apertura di un archivio solido di grandi dimensioni o l'estrazione dei relativi file può richiedere più tempo, perché il decodificatore potrebbe dover elaborare anche gli elementi precedenti.

## Comportamento dell'anteprima

I file simili a testo, come JSON, Markdown, log, codice sorgente, CSV, XML, YAML e TOML, possono essere visualizzati in anteprima con evidenziazione della sintassi quando è disponibile un linguaggio corrispondente. I file immagine comuni possono essere visualizzati graficamente e i documenti PDF si aprono nel visualizzatore PDF integrato del browser quando disponibile. Gli altri file binari restano scaricabili, ma lo strumento non tenterà di renderizzarli.
