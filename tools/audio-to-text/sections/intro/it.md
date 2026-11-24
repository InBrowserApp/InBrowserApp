## Come convertire una registrazione audio in testo

Trascina nello strumento la registrazione di una riunione, un’intervista, una lezione, un podcast o una nota vocale. Lascia attivo il rilevamento automatico oppure scegli la lingua parlata, se la conosci. Scegli un modello di trascrizione e seleziona **Trascrivi audio**. Quando il testo è pronto, seleziona un timestamp per riascoltare quel passaggio. Puoi correggere nomi, punteggiatura e parole trascritte male prima di copiare o scaricare il testo.

Lo strumento legge i formati audio che il tuo browser riesce a decodificare, tra cui MP3, WAV, M4A, FLAC, OGG e WebM. I codec supportati variano in base al browser. Se non riesci ad aprire un file, prova a esportarlo in WAV o MP3 dall’app con cui hai registrato l’audio.

## Quale modello di trascrizione scegliere?

Usa **Whisper Base** per registrazioni chiare o una prima trascrizione. **Whisper Small** può aiutare con accenti e conversazioni. **Whisper Large V3 Turbo** è adatto a registrazioni rumorose o difficili, ma richiede un download più grande e più memoria. I modelli Whisper trascrivono più lingue nella lingua originale. **SenseVoiceSmall** supporta mandarino, cantonese, inglese, giapponese e coreano.

Whisper usa WebGPU se il browser e l’hardware grafico lo supportano. Al primo utilizzo scarica il modello scelto. Il browser può riutilizzare i file del modello che conserva nella cache. Le dimensioni del download e la durata dell’elaborazione dipendono dal modello e dal dispositivo. L’audio viene decodificato e trascritto sul tuo dispositivo. Il download del modello è indipendente dalla registrazione. SenseVoiceSmall funziona localmente sulla CPU tramite WebAssembly. Se WebGPU non è disponibile, Whisper usa la CPU tramite WebAssembly.

## Esportare una trascrizione con timestamp o i sottotitoli

- **TXT** indica quando inizia ogni passaggio. Ad esempio, `[00:02:15.320] Rivediamo l’ordine del giorno.` rimanda a una frase a poco più di due minuti dall’inizio della registrazione. È adatto a verbali di riunione, citazioni da interviste e testo in cui effettuare ricerche.
- **SRT (SubRip)** include l’ora di inizio e di fine di ogni sottotitolo numerato. È un formato comune nei programmi di montaggio video.
- **VTT (WebVTT)** indica a sua volta inizio e fine di ogni sottotitolo e funziona nei lettori video HTML che supportano tracce di sottotitoli.

Lo strumento stima quando inizia e finisce ogni passaggio. Riascolta le citazioni importanti e verifica la sincronizzazione dei sottotitoli prima di condividerli. Il rumore di fondo e le voci sovrapposte possono influire sul risultato. I passaggi della trascrizione sono raggruppati per intervallo di tempo.
