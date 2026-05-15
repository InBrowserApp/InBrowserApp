## Che cos'è la verifica Argon2?

La verifica Argon2 controlla se una password in chiaro produce lo stesso hash Argon2 codificato che era stato salvato in precedenza. L'hash codificato contiene la variante Argon2, i parametri di costo, il salt e il digest, quindi un verificatore può ripetere lo stesso lavoro senza impostazioni separate.

## Quando usare questo strumento

- Confermare che una password copiata e un hash Argon2 salvato appartengano alla stessa coppia
- Diagnosticare problemi di accesso o migrazione quando si spostano record password tra sistemi
- Ispezionare la variante e i parametri di costo dentro un hash Argon2 codificato
- Testare hash che usano un secret lato server opzionale, spesso chiamato pepper

## Come verificare in modo sicuro

1. Incolla la password che vuoi controllare.
2. Incolla l'hash codificato completo, ad esempio una stringa che inizia con `$argon2id$`.
3. Inserisci il secret solo se l'hash originale è stato creato con uno.
4. Avvia la verifica e leggi il risultato: corrispondenza, mancata corrispondenza o hash non valido.

## Note sulla sicurezza

La verifica avviene localmente nel browser, ma password e hash incollati possono comunque restare nella memoria del browser finché non reimposti il modulo o chiudi la scheda. Evita di usare credenziali di produzione su dispositivi condivisi. Per i nuovi sistemi di archiviazione delle password, Argon2id è in genere la variante Argon2 preferita perché bilancia la resistenza ai canali laterali e alle GPU.
