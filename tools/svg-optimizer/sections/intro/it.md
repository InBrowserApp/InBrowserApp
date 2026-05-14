## Cosa fa questo strumento

Questo ottimizzatore SVG comprime nel tuo browser un file SVG locale o un
documento SVG incollato. Usa passaggi di pulizia SVGO per rimuovere commenti,
metadati, attributi ridondanti, precisione non necessaria e altro markup che non
modifica l'immagine visibile.

## Perché è utile

I file SVG esportati dagli strumenti di design spesso contengono metadati
dell'editor, percorsi verbosi, ID inutilizzati e commenti. Ottimizzarli può
ridurre le dimensioni di download, migliorare il caricamento della pagina e
rendere il codice SVG inline più facile da revisionare prima che venga
pubblicato in un sito web, un'app, un'email o una pagina di documentazione.

## Come funziona

Carica un file `.svg` o incolla markup SVG, scegli il preset sicuro o regola i
singoli passaggi SVGO, quindi esegui l'ottimizzazione. Lo strumento mostra le
anteprime originale e ottimizzata, il risparmio in byte e il markup finale, così
puoi copiarlo o scaricare un file `.optimized.svg`. L'SVG non deve mai lasciare
il tuo dispositivo.

## Note pratiche

- Mantieni il preset sicuro quando l'SVG dipende da CSS esterno, ID usati da
  script o riferimenti a simboli che non puoi controllare facilmente.
- Usa il preset aggressivo per icone, loghi e illustrazioni esportati semplici,
  dove rimuovere dimensioni e integrare gli stili inline è accettabile.
- Controlla l'anteprima dell'immagine ottimizzata prima di sostituire la grafica
  sorgente, soprattutto quando la sorgente usa maschere, gradienti, filtri o
  risorse collegate.
