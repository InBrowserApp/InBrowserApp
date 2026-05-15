Un visualizzatore di archivi ti permette di ispezionare un file compresso prima di estrarlo. Questo strumento apre file ZIP, TAR, GZ, TGZ e TAR.GZ direttamente nel browser, così puoi confermare cosa contiene, esplorare le cartelle, vedere l'anteprima dei file leggibili e scaricare solo l'elemento che ti serve.

## Quando usarlo

Usalo quando ricevi un pacchetto compresso e vuoi dare un'occhiata rapida senza decomprimere tutto l'archivio. È utile per controllare pacchetti di rilascio, modelli scaricati, pacchetti di log, istantanee del codice sorgente o un allegato `.gz` con un solo file.

## Privacy e gestione dei file

I contenuti dell'archivio vengono letti localmente nella sessione del browser. Il file non viene caricato su InBrowser.App. Le voci di testo grandi sono limitate nell'anteprima per mantenere la pagina reattiva; scarica l'elemento quando devi ispezionare il file completo.

## Formati archivio supportati

Il visualizzatore supporta archivi ZIP standard, file TAR non compressi, singoli file compressi con GZIP e archivi TAR racchiusi in GZIP (`.tgz` o `.tar.gz`). Gli archivi protetti da password o crittografati non sono supportati in questo primo passaggio della riscrittura.

## Comportamento dell'anteprima

I file simili a testo, come JSON, Markdown, log, codice sorgente, CSV, XML, YAML e TOML, possono essere visualizzati in anteprima con evidenziazione della sintassi quando è disponibile un linguaggio corrispondente. I file immagine comuni possono essere visualizzati graficamente e i documenti PDF si aprono nel visualizzatore PDF integrato del browser quando disponibile. Gli altri file binari restano scaricabili, ma lo strumento non tenterà di renderizzarli.
