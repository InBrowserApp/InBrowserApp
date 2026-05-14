## Cosa cerca questo strumento

Ricerca informazioni IP risolve un indirizzo IPv4, un indirizzo IPv6, un dominio o un URL e mostra i metadati pubblici che i servizi internet possono riportare per ogni indirizzo. È utile quando devi controllare dove punta un dominio, quale rete possiede un indirizzo, quale hostname DNS inverso esiste o se i record IPv4 e IPv6 portano a provider diversi.

## Come funzionano le ricerche di domini e URL

Quando inserisci un dominio o un URL, lo strumento estrae l'hostname e interroga il resolver DNS-over-HTTPS selezionato per i record A e AAAA. Ogni indirizzo restituito viene poi arricchito separatamente, quindi i domini dual-stack possono mostrare paesi, ASN, ISP, hostname o fusi orari diversi per IPv4 e IPv6.

## Cosa significano i risultati

I campi relativi a località e ISP provengono da provider pubblici di metadati IP come geojs.io e ip.sb, mentre gli hostname provengono da lookup PTR DNS inversi quando disponibili. Questi record descrivono come i database pubblici vedono l'indirizzo, non la posizione fisica esatta di una persona o di un dispositivo.

## Note su privacy e accuratezza

La ricerca viene eseguita nel tuo browser e invia richieste DNS e di metadati IP a servizi di terze parti. VPN, proxy, CDN, reti mobili e piattaforme cloud possono fare in modo che la località o l'organizzazione indicate siano diverse dall'utente finale o dal server che ti aspettavi. I campi vuoti sono normali per indirizzi privati, riservati, assegnati di recente o poco documentati.
