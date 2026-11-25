## Cerca un accordo di archiviazione Filecoin tramite Deal ID

Inserisci il **Deal ID** numerico di un accordo Storage Market sulla rete principale Filecoin, quindi seleziona **Cerca accordo**. **Prova un esempio** carica un record pubblico reale per mostrare stato, provider, cliente, date e Piece CID. La ricerca copre gli accordi Storage Market. Filecoin Onchain Cloud usa un ID di set di dati distinto.

## Come interpretare lo stato di un accordo Filecoin

Un accordo attivo ha un’attivazione registrata e la sua fine prevista è ancora futura. In attesa significa che l’accordo aspetta l’attivazione fino all’epoca di inizio prevista compresa. La ricerca mostra anche i casi in cui l’inizio è trascorso senza attivazione, l’accordo è scaduto o lo stato del mercato registra una penalizzazione. Le epoche di inizio e fine provengono dalla proposta di accordo. Le date UTC sono calcolate secondo la pianificazione delle epoche della catena.

## Confronta il Piece CID dell’accordo con il tuo file

Il Piece CID è l’impegno crittografico registrato per il piece Filecoin. Copialo per confrontarlo con un impegno calcolato dal tuo file locale o CAR usando il Calcolatore Filecoin Piece CID. Il risultato mostra anche la dimensione del piece con padding, misurata dopo il padding del piece Filecoin. Un accordo verificato riporta il flag di verifica Filecoin Plus.

## Trova accordi Filecoin meno recenti

Il browser interroga prima lo stato corrente del mercato sulla rete principale Filecoin. Dopo che un record esce da tale stato, il visualizzatore può mostrare i termini originali indicizzati da Filfox e contrassegnarli come record storico. Questi termini includono le date previste e le parti. **Visualizza su Filfox** apre l’esploratore per lo stesso Deal ID.

Consulta il [riferimento RPC di Filecoin Storage Market](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) per i campi restituiti dalla catena.
