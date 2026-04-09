## Cos'è SQL Formatter & Linter?

SQL Formatter & Linter riformatta le query SQL nel browser e le controlla allo stesso tempo per un piccolo insieme di problemi ad alto segnale. È utile quando vuoi un layout della query più pulito, un uso coerente delle maiuscole/minuscole per le parole chiave e un feedback rapido su pattern rischiosi come `SELECT *` o istruzioni `UPDATE` senza clausola `WHERE`.

## Quando Usarlo

Usa questo strumento quando esamini SQL scritto a mano, ripulisci query incollate prima di condividerle o confronti la formattazione tra diversi dialect SQL. Funziona bene per la revisione ad hoc delle query, la pulizia delle pull request e la formattazione solo nel browser senza inviare il tuo SQL a un server.

## Cosa Controlla

Questa versione mantiene separati ma coordinati formatter e linter. La formattazione usa `sql-formatter` con opzioni di layout consapevoli del dialect, mentre il lint segnala errori di parsing, punti e virgola mancanti, uso esteso di `SELECT *`, mutazioni non sicure, righe troppo lunghe e incoerenze nel caso delle parole chiave.
