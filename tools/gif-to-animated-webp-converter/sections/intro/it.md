Il WebP animato può mantenere il movimento di una GIF producendo spesso file più piccoli per siti web, anteprime di prodotto, documentazione e risorse adatte alle chat. Questo convertitore viene eseguito localmente e, quando mantieni le impostazioni predefinite di scala, velocità e ciclo, invia la GIF originale a un codificatore `gif2webp` lossless min-size prima di esportare file `.webp`.

## Quando usarlo

Usa questo strumento quando hai GIF animate che devono passare a un formato web più moderno, soprattutto per pagine in cui dimensione dei file e velocità di caricamento contano. Il WebP animato è supportato dai principali browser attuali e può conservare trasparenza, tempi e comportamento del ciclo.

## Opzioni di conversione

La scala modifica ogni fotogramma prima della codifica, utile quando una GIF è più grande dello spazio in cui verrà mostrata. La velocità modifica i tempi di riproduzione senza eliminare fotogrammi. Il comportamento del ciclo può seguire la GIF sorgente, forzare la riproduzione infinita oppure usare un conteggio personalizzato per risorse che devono fermarsi dopo un numero specifico di riproduzioni. Mantenere la scala al 100%, la velocità a 1x e il comportamento del ciclo su Segui GIF usa il percorso lossless min-size predefinito.

## Privacy e limitazioni

La conversione viene eseguita nel browser. WebP lossless di solito comprime meglio le animazioni in stile GIF, ma non può garantire che ogni output sia più piccolo; GIF minuscole o già ottimizzate possono aumentare di dimensione perché il contenitore WebP ha comunque un overhead. Cambiare scala, velocità o comportamento del ciclo richiede la decodifica dei fotogrammi e può usare molta memoria per GIF molto grandi. Se la GIF sorgente non contiene metadati del ciclo, l'esportazione predefinita viene riprodotta una sola volta a meno che tu non scelga ciclo infinito o personalizzato.
