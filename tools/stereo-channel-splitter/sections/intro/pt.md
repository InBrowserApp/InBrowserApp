## Separar os canais esquerdo e direito de um áudio estéreo

Abra uma gravação estéreo para extrair os canais esquerdo e direito em dois ficheiros mono. Isto é útil se tiver gravado dois microfones em lados opostos do mesmo ficheiro, se quiser verificar se há ruído num dos lados ou se precisar de editar cada canal separadamente num editor de áudio.

## Como separar os canais de um ficheiro estéreo

1. Escolha um ficheiro de áudio estéreo ou largue-o na ferramenta. Os canais são separados automaticamente.
2. Utilize o leitor de cada canal para ouvir o que foi gravado nesse lado.
3. Escolha um formato de transferência para ambos os canais e guarde um canal ou os dois. Se escolher WAV, de `interview.wav` resultam `interview-left.wav` e `interview-right.wav`.

Cada ficheiro contém um único canal e mantém a duração completa da gravação. Para manter os canais sincronizados num editor de áudio, coloque os dois ficheiros no mesmo ponto de início. Na reprodução, o som de cada canal mono ouve-se ao centro. A indicação acima de cada leitor identifica o canal de origem.

## Em que formato devo transferir o áudio?

- **WAV** é o formato predefinido e é adequado para edição. Nas gravações PCM compatíveis, preserva a frequência de amostragem e a precisão originais.
- **FLAC** comprime as amostras sem perdas para reduzir o tamanho do ficheiro. Escolha WAV se o codificador FLAC não conseguir preservar a frequência de amostragem ou a precisão da gravação, por exemplo, com um ficheiro WAV de vírgula flutuante.
- **MP3** cria ficheiros mais pequenos para partilhar. A exportação em MP3 aplica compressão com perdas, mesmo que a gravação já esteja em MP3. Se o formato MP3 não suportar a frequência de amostragem original, a exportação usa a frequência compatível mais próxima. Escolha WAV ou FLAC para evitar uma nova compressão com perdas.

Pode abrir ficheiros estéreo em formatos comuns como WAV, MP3, M4A, FLAC e OGG. A compatibilidade depende do navegador e do codec do ficheiro. Se não conseguir abrir um ficheiro, experimente exportá-lo em WAV estéreo e abrir essa cópia. O navegador lê a gravação e cria os ficheiros a transferir no seu dispositivo.

## O que pode separar num ficheiro estéreo?

Um ficheiro estéreo contém dois canais. Ao separá-los, cada canal fica no seu próprio ficheiro. Numa mistura para mono, o áudio dos dois canais fica num só ficheiro. Se as vozes e os instrumentos já estiverem misturados no mesmo canal, continuam juntos ao exportar. Uma gravação mono tem apenas um canal. Se tiver uma gravação de som envolvente, use primeiro um editor de áudio para exportar em estéreo o par de canais pretendido.
