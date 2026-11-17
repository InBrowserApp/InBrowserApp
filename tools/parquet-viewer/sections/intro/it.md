## Esamina i file Parquet nel browser

Apri o trascina un file `.parquet` per sfogliarne i dati ed esaminare il tipo fisico, l’annotazione logica e la ripetizione di ogni campo. I gruppi annidati restano visibili nello schema. Il riepilogo mostra il numero di righe, le colonne, i gruppi di righe, la compressione e il programma che ha creato il file, quando disponibile. Puoi provare l’esempio incluso senza scegliere un file.

## Sfoglia i dati ed esporta in CSV o JSON

I dati vengono caricati una pagina alla volta. Usa i controlli di paginazione per spostarti nel file e seleziona una cella per leggerne il valore completo. Passa a **Schema** per esaminare i campi. Usa **Esporta dati** per scaricare la pagina corrente o tutte le righe come CSV UTF-8 o array JSON. Le esportazioni dell’intero file vengono preparate in blocchi e possono essere annullate.

Il CSV include i nomi delle colonne e racchiude tra virgolette i campi con virgole, virgolette e interruzioni di riga. I valori null diventano campi vuoti nel CSV e restano `null` nel JSON. I valori annidati usano JSON; i dati binari usano testo esadecimale. Per conservare gli interi a 64 bit, il JSON li scrive come stringhe. Date e timestamp usano testo ISO, con precisione al millisecondo. I decimali seguono la precisione numerica del lettore: questo visualizzatore non è quindi uno strumento di conversione senza perdita per decimali o timestamp ad alta precisione.

## Elaborazione locale

Il file viene letto in locale da un worker in background e non viene mai caricato su un server. Il visualizzatore legge prima i metadati nel footer, poi solo gli intervalli di righe necessari alla consultazione. La decodifica dei gruppi di righe Parquet può comunque richiedere molta memoria; le dimensioni dell’esportazione sono limitate dalla memoria disponibile nel browser. hyparquet e il relativo pacchetto di compressione supportano dati non compressi e i codec Snappy, Gzip, Brotli, Zstandard e LZ4. I file Parquet crittografati non sono supportati.
