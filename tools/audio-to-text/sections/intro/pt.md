## Como converter uma gravação de áudio em texto

Arraste para a ferramenta a gravação de uma reunião, entrevista, aula, podcast ou nota de voz. Mantenha a deteção automática ou selecione o idioma da gravação se o souber. Escolha um modelo Whisper e selecione **Transcrever áudio**. Quando a transcrição estiver pronta, selecione uma marca de tempo para ouvir esse excerto. Pode corrigir nomes, pontuação e palavras mal reconhecidas antes de copiar ou transferir o texto.

A ferramenta lê os formatos de áudio que o navegador consegue descodificar, incluindo os formatos comuns MP3, WAV, M4A, FLAC, OGG e WebM. A compatibilidade com os codecs varia de navegador para navegador. Se um ficheiro não abrir, experimente exportá-lo em WAV ou MP3 a partir da aplicação de gravação.

## Que modelo de transcrição devo escolher?

Comece pelo **Rápido (Whisper Base)** se tiver uma nota de voz fácil de entender ou quiser uma primeira transcrição. O **Equilibrado (Whisper Small)** pode ajudar no caso de conversas e sotaques variados. O **Precisão máxima (Whisper Large V3 Turbo)** é o modelo mais capaz para gravações difíceis. Implica uma transferência maior e precisa de mais memória. Os três modelos reconhecem vários idiomas e transcrevem no idioma original.

O Whisper usa WebGPU quando o navegador e o hardware gráfico são compatíveis. A ferramenta também pode funcionar na CPU através de WebAssembly. Na primeira utilização, é transferido o modelo que escolheu. O navegador pode reutilizar os ficheiros do modelo que mantiver na cache. O tamanho da transferência e o tempo de processamento dependem do modelo e do dispositivo. A gravação é descodificada e transcrita no seu dispositivo. A transferência do modelo é independente da gravação.

## Exportar uma transcrição com marcas de tempo ou legendas

- **TXT** indica quando começa cada excerto. Por exemplo, `[00:02:15.320] Vamos rever a ordem de trabalhos.` aponta para uma frase dita pouco depois dos dois minutos de gravação. Use este formato para notas de reuniões, citações de entrevistas ou texto pesquisável.
- **SRT (SubRip)** inclui o início e o fim de cada legenda numerada. É um formato comum em editores de vídeo.
- **VTT (WebVTT)** também indica o início e o fim de cada legenda e funciona em leitores de vídeo HTML compatíveis com faixas de legendas.

O Whisper estima onde começa e acaba cada excerto. Volte a ouvir as citações importantes e confira a sincronização das legendas antes de partilhar. O ruído de fundo e as vozes sobrepostas podem afetar o resultado. A transcrição agrupa o texto por intervalos de tempo.
