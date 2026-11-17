## Convertire la configurazione d’ambiente

Incolla un file `.env` e scegli JSON o YAML, oppure converti un oggetto JSON/YAML piatto in `.env`. Importa file locali, scambia input e output, quindi copia o scarica il risultato. Tutto funziona nel browser: la configurazione non viene mai caricata né memorizzata nella cronologia del browser o nello spazio di archiviazione locale.

### Valori e virgolette

Le variabili d’ambiente sono stringhe: `PORT=3000`, `DEBUG=false` e `CODE=0012` restano `"3000"`, `"false"` e `"0012"`. I numeri e i booleani JSON/YAML vengono convertiti in stringhe. Null, array e oggetti annidati richiedono un valore stringa esplicito. Racchiudi tra virgolette i valori YAML come `0012` quando è importante conservarne la scrittura esatta.

Il parser supporta righe vuote, commenti `#`, il prefisso `export` e virgolette singole, doppie o accenti gravi con valori su più righe. Vengono espanse solo le sequenze `\n` e `\r` racchiuse tra virgolette doppie. Negli altri casi, virgolette e barre rovesciate restano letterali, secondo il comportamento comune di dotenv. Le chiavi usano lettere, cifre e trattini bassi e non possono iniziare con una cifra. L’output sceglie uno stile di virgolette che preserva il valore.

### Controlli della configurazione

Le chiavi `.env` duplicate mostrano i numeri di riga; viene usata l’ultima definizione. Le virgolette di chiusura mancanti, il testo dopo le virgolette di chiusura e le assegnazioni non valide generano errori con collegamenti alla riga interessata. Le virgolette tipografiche generano un avviso. Le chiavi duplicate in JSON/YAML sono errori.

I commenti, lo stile originale delle virgolette e la formattazione non vengono mantenuti. I riferimenti come `${NAME}` e i comandi della shell restano letterali e non vengono mai eseguiti. I diversi caricatori `.env` seguono regole diverse; questo strumento segue il sottoinsieme documentato, senza interpretare script della shell.

Consulta la [specifica .env di Node.js](https://nodejs.org/api/environment_variables.html#dotenv) e le [regole di parsing di dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
