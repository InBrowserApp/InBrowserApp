## Comprendi le pianificazioni cron prima di rilasciarle

Le espressioni cron sono compatte, ma un piccolo errore in un campo può eseguire un job molto più spesso, o molto meno spesso, del previsto. Questo parser convalida l'espressione nel browser, spiega la pianificazione in linguaggio semplice, suddivide ogni campo e mostra in anteprima i prossimi orari di esecuzione.

### Quando usarlo

- Controlla una pianificazione di distribuzione, backup, pulizia o notifica prima di aggiungerla a un server, sistema CI o task runner.
- Confronta un'espressione cron copiata con la pianificazione che ti aspetti davvero.
- Insegna o esegui il debug della sintassi cron modificando un campo alla volta e osservando l'aggiornamento della spiegazione.

### Formato supportato

Lo strumento supporta le espressioni cron Unix standard a cinque campi: minuto, ora, giorno del mese, mese e giorno della settimana. Accetta anche un'espressione a sei campi con i secondi all'inizio per i sistemi di pianificazione che supportano la precisione al secondo.

### Lettura del risultato

Il riepilogo fornisce una descrizione in linguaggio semplice, mentre la tabella dei campi mostra come viene suddivisa l'espressione originale. I prossimi orari di esecuzione usano il fuso orario locale del browser, quindi confrontali con il fuso orario usato dal sistema di pianificazione che eseguirà il job.

### Note

- I valori del giorno della settimana usano comunemente `0` o `7` per la domenica, e sono accettati anche nomi come `MON` o `FRI`.
- I nomi dei mesi come `JAN` o `DEC` possono rendere più facile rivedere le pianificazioni di produzione.
- Se il tuo sistema di pianificazione usa un dialetto cron diverso, verifica i token speciali come `?`, `L`, `W` o `#` nella documentazione del sistema stesso.
