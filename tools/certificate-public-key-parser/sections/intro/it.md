## Che cos'e un parser di certificati X.509?

Un certificato X.509 e un documento firmato che associa una chiave pubblica a un'identita, ad esempio un dominio, un servizio, un'organizzazione o una persona. I certificati TLS, i file di catena di certificati e molti flussi di lavoro S/MIME o di firma usano questo formato.

Questo parser legge il materiale di certificati e chiavi pubbliche direttamente nel browser. Puo ispezionare blocchi PEM, file DER binari e testo base64 DER, quindi mostrare soggetto, emittente, numero di serie, intervallo di validita, algoritmo di firma, algoritmo della chiave pubblica, fingerprint ed estensioni comuni.

Usalo quando devi confrontare il fingerprint di un certificato, verificare se un certificato corrisponde all'host previsto, ispezionare i Subject Alternative Names, confermare l'utilizzo della chiave o estrarre i dettagli della chiave pubblica durante il debug di problemi TLS e di distribuzione.

Lo strumento non convalida catene di attendibilita ne contatta autorita di certificazione. Mostra cio che e codificato nel certificato o nella chiave pubblica forniti, quindi usa uno scanner TLS dedicato quando ti servono revoca, catena, nome host o convalida di endpoint live.

- Confronta fingerprint SHA-256 o SHA-1 prima di installare o ruotare certificati.
- Esamina SAN, utilizzo della chiave, utilizzo esteso della chiave e vincoli di base senza caricare il materiale del certificato.
- Ispeziona chiavi pubbliche SPKI autonome quando un servizio fornisce solo un file PEM o DER di chiave pubblica.
