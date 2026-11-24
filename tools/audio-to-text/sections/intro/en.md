## How to turn an audio recording into text

Drop a meeting recording, interview, lecture, podcast, or voice memo into the tool. Keep automatic language detection on, or select the language spoken in the recording if you know it. Choose a Whisper model and select **Transcribe audio**. When the transcript is ready, select a timestamp to hear that part of the recording. You can correct names, punctuation, or misheard words before copying or downloading the text.

The tool reads audio formats your browser can decode, including common MP3, WAV, M4A, FLAC, OGG, and WebM recordings. Codec support varies by browser. If a file will not open, try exporting it from your recorder as WAV or MP3.

## Which transcription model should I choose?

Start with **Quick (Whisper Base)** for a clear voice note or a first pass. **Balanced (Whisper Small)** can help with accents and conversation. **Highest accuracy (Whisper Large V3 Turbo)** is the most capable option here for difficult audio, with a larger download and higher memory use. All three models can transcribe multiple languages in the original spoken language.

Whisper uses WebGPU when the browser and graphics hardware support it. The tool can also run on the CPU through WebAssembly. The first run downloads the selected model, and the browser can reuse the model files it keeps in its cache. Download size and processing time depend on the model and device. Recordings are decoded and transcribed on your device, and the model download does not contain your audio.

## Export a timestamped transcript or subtitles

- **TXT** gives each passage a start time. For example, `[00:02:15.320] Let's review the agenda.` points to a line just over two minutes into the recording. Use it for meeting notes, interview quotes, or searchable text.
- **SRT (SubRip)** adds a start and end time for each numbered subtitle. It is a common format for video editors.
- **VTT (WebVTT)** also includes a start and end time for each cue and works with HTML video players that support caption tracks.

Whisper estimates where each passage starts and ends. Play back important quotes and review subtitle timing before sharing. Background noise and overlapping voices can affect the result. The transcript groups text by time.
