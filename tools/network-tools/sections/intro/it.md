Strumenti di rete è un punto di partenza per le attività di rete basate sul browser. Usalo quando conosci il tipo di problema da risolvere ma vuoi arrivare più rapidamente all'utilità giusta: esaminare un intervallo IP, interrogare record DNS, decodificare un dominio internazionalizzato, cercare una porta o controllare il fingerprint di un certificato o di una chiave SSH.

## Cosa puoi fare

- Lavora con IPv4, IPv6, blocchi CIDR, intervalli di indirizzi e indirizzi link-local derivati da MAC.
- Interroga record DNS e DNS inverso tramite strumenti di lookup adatti al browser.
- Consulta codici di stato HTTP, tipi MIME, numeri di porta e l'ora di rete corrente.
- Esamina i dettagli di certificati e chiavi pubbliche senza inviare il materiale sorgente a un server.

## Scegliere lo strumento giusto

Comincia da **IP e CIDR** quando l'input è un indirizzo, un intervallo, una subnet o un blocco di routing. Usa **DNS e domini** per record, lookup PTR e conversione IDN/Punycode. Usa **Riferimenti di protocollo** quando ti serve una tabella di consultazione rapida. Usa **Chiavi e certificati** quando il materiale sorgente è un certificato TLS, una chiave pubblica o una voce authorized_keys SSH.

## Note sulla privacy

La maggior parte degli strumenti in questa raccolta viene eseguita interamente nel browser. Gli strumenti che richiedono dati di rete pubblici, come le ricerche DNS o le informazioni IP, possono contattare il resolver o il servizio di ricerca necessario per rispondere alla query. Evita di incollare segreti negli strumenti di lookup pubblici e preferisci strumenti solo locali per esaminare certificati e chiavi quando il materiale è sensibile.
