## Cos'è Prettier Code Formatter?

Prettier Code Formatter esegue direttamente nel browser la pipeline ufficiale
standalone di Prettier, così puoi normalizzare i file sorgente senza inviare il
codice a un server. È utile quando ti serve una formattazione rapida, vuoi
confrontare diverse impostazioni di stampa oppure hai bisogno subito di un file
pulito da copiare o scaricare.

## Formati Supportati

Questo rewrite mantiene il tool concentrato sui formati che Prettier gestisce
già bene nel browser: JavaScript, TypeScript, Flow, JSON, HTML, CSS, SCSS,
Less, Markdown, MDX, YAML, GraphQL e formati template correlati come Vue e
Handlebars. Il selettore della lingua controlla quale parser viene eseguito e,
quando l'estensione è riconosciuta, l'importazione di un file rileva
automaticamente il parser.

## Come Funziona Questo Rewrite

Il rewrite mantiene la logica di formattazione pesante fuori dal percorso
principale dell'interfaccia. Le richieste di formattazione vengono costruite da
configurazioni pure locali al tool e poi eseguite attraverso una pipeline
Prettier con worker caricata in modo lazy, così la digitazione normale resta
reattiva. Gli input grandi mettono in pausa la formattazione automatica e
passano a un'azione esplicita `Formatta ora`, che è più prevedibile che
riformattare un file enorme a ogni battitura.
