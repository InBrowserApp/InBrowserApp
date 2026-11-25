## Generare VIN casuali per i test

Imposta la quantità da `1` a `1000`, poi seleziona **Genera**. Ogni riga contiene un numero di identificazione del veicolo (VIN) di 17 caratteri. Scegli **Copia tutto** per incollare il gruppo in un modulo di test o in un foglio di calcolo, oppure **Scarica TXT** per salvare un file di testo con un VIN per riga.

## Leggere il VIN e la sua cifra di controllo

I primi tre caratteri formano l'identificativo del produttore. I caratteri dal quarto all'ottavo descrivono il veicolo e il nono è la cifra di controllo. Gli ultimi otto caratteri formano la sezione identificativa del veicolo. Le lettere `I`, `O` e `Q` sono escluse per evitare confusione con le cifre. La cifra di controllo è calcolata a partire dagli altri 16 caratteri e può essere una cifra da `0` a `9` oppure `X`. In `1M8GDM9AXKP042788`, per esempio, il nono carattere è `X`.

## Usare un VIN di esempio nei dati di test

Usa i VIN generati per verificare campi obbligatori, importazioni massive o la validazione del formato e della cifra di controllo. Per verificare il rifiuto, cambia solo il nono carattere con una cifra diversa e invia nuovamente il valore. Il generatore produce VIN sintetici, quindi i campi che sembrano indicare un produttore, un anno modello o un numero di serie vanno considerati dati di esempio. Per l'immatricolazione, la ricerca di ricambi o la cronologia del veicolo, usa il VIN riportato sul veicolo o sui suoi documenti.
