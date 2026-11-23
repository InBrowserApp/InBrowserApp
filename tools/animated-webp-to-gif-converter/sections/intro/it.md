## Converti un WebP animato in GIF

Un WebP animato contiene più fotogrammi in un unico file `.webp`. Convertilo
in GIF per una chat, un sito di documentazione o qualsiasi altra destinazione
che richiede questo formato. Lo strumento supporta i WebP animati sia con
perdita sia senza perdita di qualità. L’elaborazione avviene sul tuo dispositivo.

### Come convertire WebP animato in GIF

1. Seleziona **Scegli file** o trascina un WebP animato nello strumento.
2. Seleziona **Crea GIF** per convertire i fotogrammi alle dimensioni originali.
3. Seleziona **Riproduci** per controllare la GIF e **Scarica GIF** per salvarla.

### Cosa succede alla durata dei fotogrammi e alle ripetizioni?

Ogni fotogramma conserva la propria durata, arrotondata a multipli di 10 ms,
con un minimo di 20 ms per la riproduzione. Ad esempio, un fotogramma da
100 ms seguito da uno da 250 ms mantiene entrambe le durate. La GIF conserva
il numero totale di riproduzioni impostato nel WebP. Se il WebP si ripete
all’infinito, anche la GIF si ripete all’infinito.

### Come gestisce la GIF trasparenza e colori?

La GIF usa una tavolozza indicizzata con un massimo di 256 voci per fotogramma
e un’unica voce trasparente. Il formato WebP permette la trasparenza
parziale, quindi ombre traslucide e bordi smussati possono apparire diversi
nella GIF. Nei fotogrammi ricchi di colori possono comparire fasce nelle
sfumature. Controlla l’anteprima sullo sfondo che intendi usare.

### Domande frequenti

#### Posso convertire un WebP statico?

Lo strumento richiede fotogrammi di animazione. Sia le immagini statiche sia
quelle animate possono avere l’estensione `.webp`. Per creare
un’animazione da più immagini statiche, usa il
[Creatore di GIF](/it/tools/gif-maker/).

#### Perché la GIF è più grande del WebP?

Il formato WebP comprime in modo efficiente i colori e le aree che cambiano
tra i fotogrammi. La GIF può essere più grande anche quando le dimensioni
dell’immagine e le durate coincidono. Se la destinazione impone un limite,
controlla la dimensione del file accanto all’anteprima.

### Altri strumenti per le animazioni

Usa il [convertitore da GIF a WebP animato](/it/tools/gif-to-animated-webp-converter/)
per la conversione inversa o il
[convertitore da APNG a GIF](/it/tools/apng-to-gif-converter/) se il file di
partenza è un PNG animato.
