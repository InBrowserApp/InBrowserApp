## Esportare gli eventi di un calendario ICS in CSV

Scegli **Da ICS a CSV**, apri un file iCalendar o incollane il contenuto e seleziona **Converti**. Il foglio di calcolo contiene una riga per evento registrato con titolo, inizio, fine, luogo, descrizione e, se presente, regola di ricorrenza. Scarica il CSV per consultarlo o modificarlo in Excel o Fogli Google. Gli eventi che durano tutto il giorno usano date senza orario e la data di fine è esclusa. Per esempio, un evento che occupa il 12 maggio termina il 13 maggio.

## Creare un file ICS a partire da righe CSV

Scegli **Da CSV a ICS** e seleziona **Prova un esempio** per vedere le intestazioni. Includi almeno le colonne `Title` e `Start`. Usa `2026-05-12` per un evento che dura tutto il giorno, `2026-05-12T09:00:00` per un orario locale o `2026-05-12T09:00:00Z` per un orario in UTC. Lo strumento riconosce anche intestazioni di Google Calendar come `Subject`, `Start Date`, `Start Time` e `All Day Event`. Scarica il file ICS per importare gli eventi nel tuo calendario.

## Conservare il calendario originale per un backup completo

Il CSV raccoglie i dettagli degli eventi in righe. Le serie ricorrenti sono rappresentate dalle rispettive regole, senza generare singole date. Le definizioni dei fusi orari incluse nel file vengono mantenute. Allegati, promemoria, partecipanti, date escluse dalle serie ricorrenti e stati di annullamento restano nel calendario originale. La conversione avviene nel browser.
