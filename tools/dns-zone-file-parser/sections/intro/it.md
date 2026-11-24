## Come leggere un file di zona DNS

Apri un’esportazione DNS in formato BIND o incolla il contenuto. Carica l’esempio per vedere un record SOA, record di indirizzi IPv4 e IPv6, record per la posta e una stringa TXT. Per ogni riga l’analizzatore mostra nome, classe, tipo, durata di validità in secondi e dati del record. Filtra per nome, per tipo come MX o per una parte del valore, poi copia i record visibili in JSON per un inventario o una migrazione.

## Come vengono gestiti origine, TTL e dati dei record

Con $ORIGIN impostata su `example.com.`, il nome relativo «www» diventa `www.example.com.` Il nome @ indica l’origine corrente, mentre un record indentato riprende il nome precedente. Se nel file manca $ORIGIN, inserisci il dominio nel campo Origine iniziale. Un $TTL predefinito di 1h equivale a 3.600 secondi. Un record con un proprio TTL conserva il suo valore. I dati mantengono virgolette, escape e destinazioni relative come nel file. Così «hello; world» resta un unico valore TXT e «mail» nei dati di un record MX resta «mail».

## Come interpretare i risultati

L’analizzatore legge commenti, testo tra virgolette e record su più righe. Le note indicano la riga in cui si è verificato il problema, mentre i record leggibili restano visibili. Se la zona usa $INCLUDE o $GENERATE, espandi queste direttive prima di incollare tutti i record. L’analisi avviene nel browser, senza contattare i server DNS o verificare se uno specifico provider può caricare la zona.
