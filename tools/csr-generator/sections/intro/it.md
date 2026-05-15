# Generatore CSR

Una Certificate Signing Request (CSR) è un messaggio PKCS#10 che contiene la tua chiave pubblica, i campi Subject identificativi, estensioni facoltative come i Subject Alternative Names e una firma creata con la chiave privata corrispondente. Le autorità di certificazione usano la CSR per emettere un certificato X.509 senza ricevere mai la tua chiave privata.

Questo generatore crea CSR direttamente nel browser. Puoi generare una nuova coppia di chiavi RSA o ECDSA, oppure importare una chiave privata PEM non cifrata esistente quando devi rinnovare un certificato per una chiave già distribuita.

## Quando usarlo

Usa una CSR quando hai bisogno che un'autorità di certificazione emetta o rinnovi un certificato TLS, S/MIME, di autenticazione client o per un servizio interno. La CSR dimostra il possesso della chiave privata e contiene le informazioni di identità pubblica che devono apparire nel certificato.

Per i certificati TLS pubblici, inserisci i nomi host nei Subject Alternative Names. Il Common Name è ancora utile per la leggibilità e per i sistemi legacy, ma i client moderni convalidano i nomi DNS e gli indirizzi IP da SAN.

## Come generare una CSR

Scegli se generare una nuova chiave o importare una chiave privata esistente. Compila i campi Subject rilevanti per la richiesta di certificato, quindi aggiungi voci SAN per nomi DNS, indirizzi IP, indirizzi email o URI. Genera la CSR e invia solo la CSR PEM alla tua autorità di certificazione.

Se questo strumento genera una nuova chiave, scarica e conserva la chiave privata prima di lasciare la pagina. Se importi una chiave, lo strumento genera solo la CSR e non riesporta la chiave privata importata.

## Note su chiavi e formati

RSA a 2048 bit è ampiamente compatibile; 3072 o 4096 bit possono essere preferibili per certificati interni con durata più lunga. ECDSA P-256 è compatto e ampiamente supportato, mentre P-384 o P-521 possono essere richiesti da criteri più rigorosi. Il percorso con chiave importata supporta blocchi PEM PKCS#8, RSA PRIVATE KEY ed EC PRIVATE KEY non cifrati.

Le chiavi private sono sensibili. Non incollarle in siti web non attendibili, non inviarle alle autorità di certificazione e non committarle nel controllo del codice sorgente. Questo strumento viene eseguito localmente nel browser, ma il tuo processo operativo deve comunque prevedere archiviazione sicura e rotazione delle chiavi.
