## Informazioni sul convertitore di sottotitoli

Converti file di sottotitoli esistenti tra 19 formati di testo temporizzato oppure esporta una trascrizione in testo semplice. Tra gli usi più comuni ci sono la conversione da SRT a VTT per un video sul web, la trasformazione dei dialoghi ASS o SSA in SRT, la preparazione di sottotitoli per una piattaforma video e la raccolta di più episodi convertiti in un unico ZIP. La conversione avviene nel browser; i file dei sottotitoli e il contenuto incollato non vengono caricati.

Lo strumento elabora il testo dei sottotitoli e i relativi tempi. Scegli i file o incolla i sottotitoli, seleziona un formato di destinazione e usa l'anteprima per controllare il risultato prima di scaricarlo. Puoi modificare il testo incollato e convertirlo di nuovo senza cambiare il file originale sul tuo dispositivo.

## Come convertire i sottotitoli

1. Seleziona **Scegli file** per aprire uno o più file di sottotitoli, trascina i file nel pannello di input oppure incolla il testo dei sottotitoli nell'editor. **Prova un esempio** carica un breve esempio SRT con due segmenti.
2. Per l'uso normale, lascia **Formato di origine** su **Rilevamento automatico**. Il rilevamento esamina il contenuto senza basarsi soltanto sul nome del file. Se un file è ambiguo, seleziona manualmente il formato di origine.
3. Scegli un **Formato di destinazione**. Per una normale traccia di sottotitoli di un sito web, scegli WebVTT; per un lettore o un editor che richiede un file SRT, scegli SubRip.
4. Apri **Impostazioni di conversione** se ti servono una codifica del file diversa, una frequenza fotogrammi o uno spostamento temporale. Modifica queste impostazioni prima di convertire.
5. Seleziona **Converti sottotitoli**. Il risultato indica i formati di origine e destinazione, il nome del file di output e il numero di segmenti convertiti.
6. Passa da **Anteprima** a **Contenuto del file**, poi copia il testo convertito o scarica il file. La tabella mostra fino a 100 segmenti; il contenuto del file e i download includono il risultato completo.

**Cancella** rimuove dalla pagina l'input e i risultati correnti. La scelta di un nuovo gruppo di file sostituisce la selezione precedente. Il convertitore non conserva una cronologia dei sottotitoli, quindi scarica i risultati che vuoi mantenere.

## Formati supportati e precisione dell'output

Tutti i formati elencati di seguito supportano lettura e scrittura, tranne TXT, che serve a esportare trascrizioni leggibili. I formati memorizzano i tempi in modi diversi; scegliendo un formato con precisione inferiore, le indicazioni temporali vengono arrotondate alle unità supportate.

| Formato                                           | Estensione | Tempi scritti                              |
| ------------------------------------------------- | ---------- | ------------------------------------------ |
| SubRip                                            | `.srt`     | Millisecondi                               |
| WebVTT                                            | `.vtt`     | Millisecondi                               |
| Advanced SubStation Alpha                         | `.ass`     | Centesimi di secondo                       |
| SubStation Alpha                                  | `.ssa`     | Centesimi di secondo                       |
| YouTube SubViewer                                 | `.sbv`     | Millisecondi                               |
| MicroDVD                                          | `.sub`     | Fotogrammi video                           |
| SubViewer 2.0                                     | `.sub`     | Centesimi di secondo                       |
| SAMI                                              | `.smi`     | Millisecondi                               |
| Testi di canzoni LRC                              | `.lrc`     | Centesimi di secondo per i tempi di inizio |
| Timed Text                                        | `.ttml`    | Millisecondi                               |
| Distribution Format Exchange Profile              | `.dfxp`    | Millisecondi                               |
| YouTube SRV3                                      | `.srv3`    | Millisecondi                               |
| Trascrizione YouTube XML                          | `.xml`     | Secondi con precisione al millisecondo     |
| MPL2                                              | `.mpl`     | Decimi di secondo                          |
| Spruce Subtitle, formato testuale                 | `.stl`     | Fotogrammi video                           |
| QuickTime Text                                    | `.qt.txt`  | Millisecondi                               |
| JSON                                              | `.json`    | Valori numerici in millisecondi            |
| CSV                                               | `.csv`     | Valori numerici in millisecondi            |
| TSV                                               | `.tsv`     | Valori numerici in millisecondi            |
| Trascrizione in testo semplice, solo esportazione | `.txt`     | Nessuna indicazione temporale              |

L'importazione TTML accetta anche file iTT compatibili. DFXP appartiene alla famiglia TTML. L'esportazione TTML non ricrea tutti i profili, i layout o le regole di stile specifici delle varie piattaforme.

L'estensione `.sub` può indicare sia MicroDVD sia SubViewer, entrambi basati su testo in questo strumento. Il formato binario VobSub è un formato diverso. Analogamente, il formato `.stl` supportato è Spruce STL testuale, anziché EBU STL binario. Quando queste estensioni sono ambigue, scegli il formato in base al nome completo.

## Scegliere tra SRT, VTT, ASS e testo semplice

**SRT** è una scelta utile quando un lettore video, un editor o un modulo di caricamento richiede sottotitoli SubRip. **VTT** è il formato usato dalle tracce di testo dei video HTML e può contenere anche impostazioni dei segmenti specifiche per il web. La conversione tra questi formati conserva il testo dei sottotitoli e i tempi in millisecondi, ricostruendo la sintassi del file.

Un segmento SRT numerato usa una virgola prima dei millisecondi:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Lo stesso segmento in WebVTT ha un'intestazione del file e indicazioni temporali con il punto decimale:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS e SSA** sono utili formati di scambio quando l'applicazione di destinazione li richiede. La formattazione supportata in grassetto, corsivo e sottolineato può essere trasferita tra i formati in grado di rappresentarla. Font, posizionamento sullo schermo, comandi di disegno, animazioni karaoke e altre funzioni di presentazione avanzate vengono semplificati; gli eventi grafici ASS privi di dialogo leggibile vengono ignorati. Il convertitore si concentra su sottotitoli leggibili, anziché riprodurre un'animazione o un layout elaborati.

**TXT** estrae i dialoghi leggibili senza indicazioni temporali o stili. La sua anteprima mostra il testo esportato al posto della tabella dei tempi. L'esportazione TXT non genera tempi per i sottotitoli, non trascrive il parlato e non traduce la lingua parlata.

## Codifica dei file e leggibilità del testo

La decodifica automatica dei file usa UTF-8 oppure UTF-16 quando un marcatore dell'ordine dei byte lo identifica. Per i file più vecchi, scegli la codifica originale se i caratteri appaiono errati o il file non può essere decodificato. Le opzioni disponibili includono Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS ed EUC-KR, oltre alle opzioni esplicite UTF-8 e UTF-16.

Per esempio, prova GB18030 per un sottotitolo cinese che sai essere stato salvato con quella codifica, oppure Shift_JIS per un file giapponese proveniente da un'applicazione meno recente. La codifica cambia il modo in cui vengono letti i byte esistenti; non ne traduce il significato. Dopo aver selezionato una codifica diversa, ripeti la conversione. I file dei sottotitoli scaricati usano UTF-8, indipendentemente dalla codifica di origine.

## Regolare i tempi e la frequenza fotogrammi

### Anticipare o ritardare tutti i sottotitoli

Lo spostamento temporale si misura in millisecondi. Un valore di `1500` ritarda ogni segmento di 1.5 secondi; `-500` mostra i sottotitoli mezzo secondo prima. Per un segmento che inizia a `00:00:01.250`, queste impostazioni producono rispettivamente `00:00:02.750` e `00:00:00.750`.

Lo spostamento modifica sia l'inizio sia la fine, mantenendo la durata finché non si raggiunge l'inizio della linea temporale. I segmenti spostati interamente prima dello zero vengono rimossi; un segmento che oltrepassa lo zero solo in parte inizia da zero. Uno spostamento corregge un ritardo costante. Non corregge una traccia di sottotitoli il cui disallineamento varia nel corso del video.

### Usare la frequenza fotogrammi per le indicazioni temporali basate sui fotogrammi

MicroDVD e Spruce STL usano i fotogrammi video, quindi la loro frequenza fotogrammi determina la corrispondenza tra i fotogrammi e il tempo trascorso. Anche TTML può contenere tempi basati sui fotogrammi. Usa la frequenza fotogrammi del video di origine, per esempio `23.976`, `24`, `25` o `29.97`, quando è necessaria per interpretare l'input.

Una frequenza fotogrammi incorporata nell'input ha la precedenza quando il formato la fornisce. Per l'output basato sui fotogrammi, l'impostazione scelta determina la frequenza fotogrammi scritta. La modifica di questa impostazione non ridimensiona le normali indicazioni temporali in formato orario di SRT o VTT; cambia il modo in cui vengono interpretate o scritte le indicazioni temporali basate sui fotogrammi.

### Comprendere l'arrotondamento e i tempi di fine mancanti

SRT e VTT mantengono la precisione al millisecondo. ASS, SSA, SubViewer e LRC arrotondano ai centesimi; MPL2 arrotonda ai decimi; l'output basato sui fotogrammi arrotonda ai fotogrammi. Un segmento molto breve mantiene una durata positiva dopo l'arrotondamento. L'anteprima rispecchia i tempi del formato esportato, anziché mostrare le indicazioni temporali di origine non arrotondate.

LRC può fornire tempi di inizio senza tempi di fine. Per i tempi di fine mancanti si usa il successivo tempo di inizio distinto, oppure una durata di due secondi per l'ultimo segmento. L'esportazione LRC non può mantenere gli intervalli vuoti e i tempi di fine sovrapposti originali, e i segmenti su più righe diventano singole righe del testo della canzone. QuickTime Text usa marcatori sulla linea temporale; SAMI e QuickTime possono ricostruire i sottotitoli sovrapposti combinandone il testo a ogni punto di cambio temporale, quindi il risultato può contenere un numero diverso di segmenti.

## Conversione in serie e download ZIP

Scegli o trascina più file per convertirli con lo stesso formato di destinazione e le stesse impostazioni. Seleziona un risultato dal menu dei nomi dei file per esaminarlo. Per i file che non possono essere convertiti rimane visibile l'errore corrispondente, mentre i risultati riusciti restano disponibili per il download individuale.

Quando almeno due file vengono convertiti correttamente, **Scarica tutto come ZIP** raccoglie questi risultati. L'archivio contiene soltanto le conversioni riuscite. Esamina gli errori visibili, regola il formato di origine o la codifica secondo necessità e ripeti la conversione per i file rimanenti.

I nomi dei file di output mantengono il nome di base del file di origine e usano l'estensione scelta: per esempio, `episode01.srt` diventa `episode01.vtt`. Se più risultati avessero lo stesso nome, un suffisso come ` (2)` mantiene distinte le loro voci nello ZIP. ZIP è un'opzione di download di questo strumento; come input, scegli i file dei sottotitoli stessi.

## Scambio di dati con JSON, CSV e TSV

JSON usa un array di oggetti per i segmenti, con valori `start` ed `end` in millisecondi e una stringa `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Lo strumento accetta anche JSON in stile Whisper contenente un array `segments`, in cui i valori `start` ed `end` dei segmenti sono espressi in secondi. Si tratta di una convenzione di input distinta; la normale esportazione JSON continua a usare i millisecondi.

CSV e TSV usano i nomi di colonna `start`, `end` e `text`. I tempi di input possono essere valori numerici in millisecondi o indicazioni temporali in formato orario. CSV racchiude tra virgolette i campi che contengono virgole, virgolette o interruzioni di riga; TSV usa tabulazioni tra le colonne. Entrambe le esportazioni scrivono valori numerici in millisecondi. Usa questi formati per trasferire i sottotitoli in un foglio di calcolo o in un altro flusso di elaborazione dei sottotitoli.

## Domande frequenti

### Perché l'anteprima e il testo scaricato hanno un aspetto diverso?

La tabella di anteprima mostra il testo leggibile dei sottotitoli e i tempi del formato di destinazione. Il contenuto del file mostra il file effettivamente serializzato, incluse intestazioni, numerazione, delimitatori e sintassi di formattazione supportata. I download contengono l'intero contenuto serializzato, anche quando la tabella si ferma ai primi 100 segmenti.

### Perché lo stile o il posizionamento sono cambiati?

I formati non condividono lo stesso modello di stile. La formattazione di base supportata viene conservata dove può essere rappresentata; gli stili avanzati, il posizionamento dei segmenti sul web, le animazioni e i metadati delle piattaforme non vengono riprodotti integralmente. Usa la vista del contenuto del file per esaminare l'esportazione e provala nel lettore o nell'editor in cui la userai.

### È possibile estrarre sottotitoli da un video o da una traccia di immagini?

Parti da un file di sottotitoli testuali esistente. Estrai prima le tracce di sottotitoli incorporate nel video. Le tracce PGS/SUP e VobSub/IDX basate su immagini richiedono l'OCR per diventare testo; EBU STL binario richiede un editor di sottotitoli in grado di leggere quel formato.

### Dove posso consultare le specifiche dei formati?

Consulta la [specifica WebVTT](https://www.w3.org/TR/webvtt1/), la [specifica TTML](https://www.w3.org/TR/ttml2/) e i [formati di sottotitoli supportati da YouTube](https://support.google.com/youtube/answer/2734698) per la sintassi dei file e i requisiti delle piattaforme.
