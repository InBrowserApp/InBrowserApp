## Crea pianificazioni cron in modo visuale

Le espressioni cron sono compatte, ma una piccola modifica nel campo sbagliato può spostare un job da "mattine feriali" a "ogni minuto". Questo generatore offre controlli separati per ogni campo, così puoi creare un'espressione standard a cinque campi senza memorizzare ogni regola della sintassi.

### Quando è utile

- Crea pianificazioni per job CI, backup, warm-up della cache, report e altre attività ricorrenti.
- Parti da un preset noto e perfeziona un campo alla volta.
- Visualizza in anteprima i prossimi orari di esecuzione locali prima di incollare l'espressione in uno scheduler.

### Come usarlo

1. Scegli un preset rapido oppure mantieni l'espressione predefinita e modifica manualmente ogni campo.
2. Scegli se ogni campo deve essere eseguito su ogni valore, un intervallo, valori specifici o un intervallo inclusivo.
3. Rivedi l'espressione generata e l'anteprima della prossima esecuzione, quindi copiala nel tuo scheduler.

### Note

- Questo strumento genera cron standard a cinque campi: minuto, ora, giorno del mese, mese e giorno della settimana.
- La domenica viene mostrata come `0`, un valore accettato dai comuni scheduler cron in stile Unix.
- Se sia il giorno del mese sia il giorno della settimana sono limitati, molte implementazioni cron vengono eseguite quando uno dei due campi corrisponde. Alcuni sistemi si comportano diversamente, quindi verifica questa combinazione nello scheduler di destinazione.
