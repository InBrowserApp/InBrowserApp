## Esamina le frequenze di un file audio

Usa l’analizzatore di spettro audio per individuare un ronzio a bassa frequenza, confrontare il contenuto in frequenza di più file o capire fino a dove arrivano le alte frequenze di una registrazione. Il grafico mostra la frequenza in hertz (Hz) e il livello in decibel rispetto al fondo scala digitale (dBFS). I picchi indicano le bande di frequenza che contengono più energia.

## Come visualizzare uno spettro audio

1. Scegli o trascina un file mono o stereo in formato WAV, MP3, M4A, FLAC oppure OGG. I formati decodificabili dipendono dal browser.
2. Individua la frequenza dominante. Passa il puntatore sul grafico o toccalo per leggere un’altra frequenza e il suo livello. Il cursore consente di consultare gli stessi valori con la tastiera.
3. Passa dalla scala logaritmica a quella lineare secondo necessità. Puoi riprodurre il file originale mentre esamini il grafico. L’analisi e la riproduzione avvengono sul tuo dispositivo.

## Come leggere il grafico FFT

Lo strumento decodifica l’audio a 48 kHz, applica una finestra di Hann a brevi segmenti distribuiti lungo il file e li analizza con una trasformata rapida di Fourier (FFT). Calcola la potenza media dei segmenti e combina le potenze dei canali stereo, così i suoni sfasati tra i canali restano visibili. Il grafico arriva a 24 kHz. I livelli si riferiscono a singoli intervalli di frequenza e differiscono dal volume complessivo, dal picco dei campioni e dal loudness integrato in LUFS.

Un picco stretto attorno a 50 o 60 Hz può indicare un ronzio della rete elettrica. Un calo netto alle alte frequenze può dipendere dal filtraggio o dalla compressione. Un picco isolato può essere un’armonica. Prima di identificarlo con l’altezza di una nota, controlla i picchi vicini.

## Quando usare una scala di frequenza logaritmica o lineare?

La scala logaritmica lascia più spazio alle basse e alle medie frequenze e facilita la lettura per ottave. Nella scala lineare, variazioni uguali in Hz occupano la stessa distanza. Questo aiuta a confrontare armoniche a intervalli regolari. Il grafico riassume le frequenze dell’intera registrazione. Per vedere quando compare un suono o come varia la sua frequenza nel tempo, usa uno spettrogramma.
