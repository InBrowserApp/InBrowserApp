## Come esaminare un dispositivo USB nel browser

Collega il dispositivo con un cavo dati, poi scegli **Seleziona dispositivo** e selezionalo nella finestra WebUSB del browser. La scheda del dispositivo mostra l'ID fornitore (VID), l'ID prodotto (PID) e i dati identificativi disponibili. La versione USB proviene dal descrittore del dispositivo. La velocità effettiva della connessione dipende anche dal cavo, dalla porta e dal sistema operativo.

## Come leggere configurazioni, interfacce ed endpoint

Espandi una configurazione per vedere le funzioni esposte dalle sue interfacce. Un'interfaccia può avere più impostazioni alternative, ciascuna con classe, sottoclasse, protocollo ed endpoint propri. Gli endpoint IN trasportano dati verso l'host e quelli OUT verso il dispositivo. Il tipo di endpoint e la dimensione del pacchetto descrivono come l'endpoint trasferisce i dati.

## Cosa indica la verifica dell'accesso?

Seleziona **Verifica accesso** per vedere se il browser riesce ad aprire il dispositivo selezionato. La verifica usa l'handle del dispositivo e lo rilascia al termine. L'accesso alle interfacce può comunque dipendere dal driver del sistema operativo o da un'altra applicazione. Lo strumento legge i descrittori forniti dal browser senza modificare le impostazioni del dispositivo.

## Perché non riesco a vedere o aprire il dispositivo USB?

Se il dispositivo non compare nella finestra di selezione, prova un cavo dati e verifica che il sistema operativo lo riconosca. Se il browser nega l'accesso, controlla l'autorizzazione USB del sito o i criteri del browser. Se riesci a selezionare il dispositivo ma non ad aprirlo, chiudi le app che potrebbero usarlo e verifica i requisiti dei driver per il dispositivo e la piattaforma. Alcune classi USB sono protette dal browser. Consulta [Informazioni sul dispositivo](../device-information/) per le funzionalità di questo browser e sistema.
