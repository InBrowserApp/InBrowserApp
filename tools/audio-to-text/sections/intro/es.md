## Cómo convertir una grabación de audio en texto

Arrastra a la herramienta una grabación de una reunión, entrevista, clase, pódcast o nota de voz. Deja activada la detección automática de idioma o indica qué idioma se habla si lo sabes. Elige un modelo de transcripción y pulsa **Transcribir audio**. Cuando la transcripción esté lista, selecciona una marca de tiempo para escuchar ese fragmento. Puedes corregir nombres, signos de puntuación o palabras mal reconocidas antes de copiar o descargar el texto.

La herramienta abre los formatos de audio que tu navegador puede decodificar, incluidos MP3, WAV, M4A, FLAC, OGG y WebM. Los códecs compatibles varían según el navegador. Si no puedes abrir un archivo, prueba a exportarlo en WAV o MP3 con tu aplicación de grabación.

## Qué modelo de transcripción conviene elegir

Usa **Whisper Base** para grabaciones claras o una primera transcripción. **Whisper Small** puede ayudar con acentos y conversaciones. **Whisper Large V3 Turbo** es adecuado para grabaciones ruidosas o difíciles, aunque requiere una descarga mayor y más memoria. Los modelos Whisper transcriben varios idiomas en el idioma original. **SenseVoiceSmall** admite mandarín, cantonés, inglés, japonés y coreano. **Qwen3-ASR 0.6B** ofrece texto sin marcas o alineación de tiempos para reproducción y subtítulos; esta requiere descargar otro modelo. El texto sin marcas se puede exportar como TXT. Qwen usa WebGPU para el reconocimiento cuando está disponible y, si no, recurre a la CPU; la alineación de tiempos se ejecuta en la CPU.

Whisper usa WebGPU si el navegador y el hardware gráfico lo admiten. La primera vez se descarga el modelo que elijas y el navegador puede volver a usar los archivos que conserve en la caché. El tamaño de la descarga y el tiempo de procesamiento dependen del modelo y del dispositivo. La grabación se decodifica y se transcribe en tu dispositivo. La descarga del modelo es independiente del audio. SenseVoiceSmall se ejecuta localmente en la CPU mediante WebAssembly. Si WebGPU no está disponible, Whisper recurre a la CPU mediante WebAssembly.

## Exportar una transcripción con marcas de tiempo o subtítulos

- **TXT** indica el tiempo de inicio de cada fragmento. Por ejemplo, `[00:02:15.320] Revisemos el orden del día.` apunta a una frase que aparece poco después de los dos minutos de grabación. Úsalo para notas de reuniones, citas de entrevistas o texto en el que puedas hacer búsquedas.
- **SRT (SubRip)** incluye el tiempo de inicio y de fin de cada subtítulo numerado. Es un formato muy usado en editores de vídeo.
- **VTT (WebVTT)** también incluye el inicio y el fin de cada subtítulo y funciona con reproductores de vídeo HTML que admiten pistas de subtítulos.

La herramienta estima cuándo empieza y termina cada fragmento. Escucha las citas importantes y revisa la sincronización de los subtítulos antes de compartirlos. El ruido de fondo y las voces superpuestas pueden afectar al resultado. La transcripción agrupa el texto por intervalos de tiempo.
