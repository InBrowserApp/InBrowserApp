## Apri un'acquisizione HAR

Esporta un file HAR (HTTP Archive) dal pannello Rete del browser dopo aver registrato le richieste che vuoi analizzare. Apri o trascina qui il file `.har` o `.json`, oppure carica l'esempio. Il limite è di 20 MiB e 20.000 voci.

## Trova le richieste lente o non riuscite

Cerca per URL, metodo, stato o tipo MIME, poi ordina per ora di inizio, durata o dimensione trasferita. Le richieste condividono una scala temporale misurata a partire dalla prima richiesta. Selezionane una per esaminare intestazioni, cookie, parametri, corpi e fasi temporali.

Il filtro delle richieste non riuscite include gli stati 0, 4xx e 5xx. Lo stato 0 indica che non è stata registrata alcuna risposta HTTP; il filtro 3xx include le risposte 304 della cache. TLS fa parte del tempo di connessione.

## Leggi i dati registrati

L'elaborazione avviene nel browser. I dettagli disponibili dipendono dall'esportazione. Le dimensioni sconosciute sono escluse dai totali; la durata dell'acquisizione non è disponibile se manca la durata di una richiesta. Il diagramma a cascata usa comunque gli istanti di inizio registrati e di fine noti.

Le anteprime dei corpi conservano il testo registrato. Le anteprime e le relative copie, così come i valori dei singoli campi, hanno un limite di 100.000 caratteri. I corpi codificati rimangono codificati.
