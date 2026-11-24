## Come ripulire un file HAR

Un file HAR (HTTP Archive) registra le richieste e le risposte di rete del browser. Può contenere cookie di sessione, token di autorizzazione, URL e contenuti con dati riservati. Crea una copia ripulita da inviare all’assistenza, allegare a una segnalazione o condividere con il tuo team. Per ogni richiesta vengono conservati il metodo, il codice di stato e i tempi.

1. Apri gli strumenti per sviluppatori del browser e seleziona il pannello **Rete**. Riproduci il problema e poi esporta il log come file HAR. In Chrome, scegli **Esporta HAR (sanificato)** per ottenere una copia da cui sono già state rimosse le intestazioni standard contenenti credenziali.
2. Apri o trascina qui il file HAR esportato. Lo strumento prepara una copia appena selezioni il file. Prova l’esempio per vedere cosa cambia in una registrazione di prova.
3. Controlla i conteggi e seleziona **Scarica il file HAR ripulito**. Il nome del nuovo file termina con `.sanitized.har` e puoi importarlo negli strumenti per sviluppatori o nell’[Analizzatore di rete HAR](/it/tools/har-analyzer/). L’elaborazione avviene nel browser.

## Quali dati vengono rimossi o oscurati?

I cookie e le intestazioni di autenticazione più comuni, come `Authorization` e `X-API-Key`, vengono rimossi. Per impostazione predefinita, lo strumento oscura i valori dei parametri URL e rimuove il corpo delle richieste e delle risposte, oltre ai dati WebSocket registrati. Ad esempio, `?token=example&page=2` diventa `?token=REDACTED&page=REDACTED` nel file esportato. I nomi dei parametri restano disponibili per il debug. Il conteggio include ogni campo modificato, anche quando lo stesso valore compare in più campi.

Disattiva l’opzione corrispondente se ti servono i valori o i contenuti originali per riprodurre il problema. Nomi host, percorsi degli URL, altre intestazioni e metadati specifici del browser possono ancora contenere informazioni riservate. Controlla questi campi prima di condividere il file.
