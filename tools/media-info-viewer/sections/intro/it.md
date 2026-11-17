## Cosa mostra questo visualizzatore

Il Visualizzatore di informazioni audio e video legge i metadati tecnici dei file
audio e video locali, inclusi MP4, MOV, MKV, WebM, AVI, MP3, FLAC e WAV. Usalo
per verificare le specifiche di un file esportato, controllare i tag della lingua
delle tracce audio di un film o raccogliere un rapporto tecnico per risolvere
problemi. L'analisi inizia non appena scegli o trascini un file.

## Dettagli di file, video, audio e sottotitoli

- **Panoramica del file:** formato contenitore effettivo, dimensione del file,
  durata, bitrate complessivo, titolo e applicazione di codifica, se disponibili.
- **Tracce video:** codec, profilo e bitrate, risoluzione, frequenza fotogrammi e
  relativa modalità, rapporto d'aspetto, rotazione, profondità in bit, spazio
  colore, sottocampionamento cromatico e formato HDR.
- **Tracce audio:** codec, bitrate, lingua, titolo della traccia, numero e
  configurazione dei canali, frequenza di campionamento, profondità in bit e
  indicatori di traccia predefinita o forzata. Ogni traccia audio è elencata
  separatamente, così audio originale, doppiaggio e commenti restano distinti.
- **Tracce di sottotitoli:** formato, lingua, titolo, durata e indicatori di traccia
  predefinita o forzata, quando presenti nel file.

Le specifiche principali sono subito visibili. Apri **Dettagli tecnici** in una
traccia per vedere altri campi oppure seleziona un collegamento con il numero di
tracce per passare alla prima traccia di quel tipo. I campi disponibili dipendono
dal formato e dai suoi metadati.

## Come esaminare un file

1. Scegli un file audio o video locale oppure trascinalo nell'area dei file.
2. Controlla il riepilogo, poi esamina le singole tracce video, audio e di
   sottotitoli.
3. Copia il rapporto leggibile per un messaggio o una richiesta di assistenza,
   oppure scarica il JSON per un inventario di risorse, uno script o ulteriori
   analisi. Entrambi includono i campi tecnici nascosti nelle sezioni comprimibili
   dell'interfaccia.
4. Scegli **Cambia file** per esaminare un altro file o **Rimuovi file** per
   cancellare i risultati. La selezione di un altro file o la rimozione di quello
   attuale interrompe anche l'eventuale analisi ancora in corso.

## Come interpretare i valori

- **Contenitore e codec descrivono cose diverse.** MP4 e Matroska sono
  contenitori; AVC/H.264, HEVC/H.265 e AAC descrivono come vengono codificati i
  flussi. Un contenitore può includere più tracce audio o di sottotitoli.
- **Il bitrate complessivo riguarda l'intero file.** Include tutti i flussi e i
  dati aggiuntivi del contenitore. Il bitrate di una traccia si applica solo a
  quel flusso. I bitrate usano kb/s o Mb/s; le dimensioni dei file usano B, KiB,
  MiB, GiB o TiB.
- **La durata include i millisecondi.** Il formato visualizzato è `HH:MM:SS.mmm`.
  La frequenza fotogrammi usa fps e la frequenza di campionamento audio usa kHz.
  CFR indica una frequenza fotogrammi costante; VFR indica una frequenza
  fotogrammi variabile.
- **Gli indicatori delle tracce ne descrivono la selezione prevista.**
  L'indicatore di traccia predefinita contrassegna una traccia preferita; quello
  di traccia forzata è comunemente usato per i sottotitoli che devono apparire
  senza selezionare una traccia completa di sottotitoli. Sono indicatori distinti
  letti dal file.

Alcuni contenitori non forniscono un bitrate separato per ogni flusso. I valori
non disponibili restano assenti o sono contrassegnati come non disponibili; non
vengono dedotti dal nome del file. Le immagini di copertina incorporate non
vengono conteggiate come tracce video.

## Usi comuni

Controlla risoluzione e frequenza fotogrammi dopo aver esportato un video,
esamina canali e frequenza di campionamento prima di modificare un file audio,
individua tracce in più lingue o con commenti oppure raccogli i dettagli dei
codec per indagare su un problema di riproduzione. Il rapporto permette di
condividere le specifiche rilevanti senza inviare il file multimediale.

## Elaborazione locale ed esportazione dei rapporti

L'analisi avviene nel browser: il file multimediale non viene caricato e il suo
contenuto non viene modificato. L'analizzatore legge porzioni del file secondo
necessità, quindi può esaminarne i metadati anche quando il browser non riesce a
riprodurne il contenitore o il codec.

**Copia rapporto** produce un riepilogo di testo leggibile. **Scarica JSON**
esporta i metadati restituiti dall'analizzatore insieme al nome e alla dimensione
del file. Nel JSON, `Duration` usa i secondi, `BitRate` e `OverallBitRate` usano
i bit al secondo e `SamplingRate` usa gli hertz. L'interfaccia converte questi
valori in unità più leggibili. L'esportazione conserva anche altri campi di
metadati oltre a quelli mostrati nelle schede delle tracce.
