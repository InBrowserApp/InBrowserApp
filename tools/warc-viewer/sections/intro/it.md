## Aprire un archivio web WARC

Seleziona o trascina un file `.warc` o `.warc.gz` oppure prova l’archivio di esempio. Il visualizzatore crea un elenco dei record di acquisizione e apre la prima pagina HTML archiviata che trova. Filtra per URL o tipo di record per trovare un’acquisizione, poi passa dall’anteprima della pagina ai dettagli del record. L’indicizzazione di un archivio di grandi dimensioni può richiedere tempo. Il file resta nel tuo browser.

## Leggere le date di acquisizione e le intestazioni

Un file Web ARChive (WARC) contiene i record raccolti da un crawler o da uno strumento di archiviazione durante la visita a un sito web. Più record possono avere lo stesso URL. Per distinguerli, consulta la data di acquisizione in UTC e lo stato HTTP originale. Un record di risposta contiene ciò che ha restituito il server. Un record di richiesta descrive ciò che ha inviato il crawler. Un record di rivisita può rimandare a un’altra acquisizione senza salvare di nuovo la pagina. Puoi consultare questi record anche quando l’anteprima della pagina non è disponibile.

## Cosa include l’anteprima?

L’anteprima statica usa l’HTML, le immagini e i fogli di stile supportati salvati nello stesso archivio. Le risorse mancanti possono modificare l’impaginazione o lasciare spazi vuoti. Gli script sono disattivati e l’anteprima non invia richieste al sito originale, quindi le funzionalità interattive come l’accesso e la riproduzione video non sono disponibili. Il visualizzatore accetta WARC 1.0 e 1.1, inclusi i record compressi con gzip.

[Specifica del formato WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
