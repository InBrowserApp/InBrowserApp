## Examine as frequências de um ficheiro de áudio

Use o analisador de espectro de áudio para detetar um zumbido grave, comparar o conteúdo em frequência de vários ficheiros ou ver onde uma gravação perde frequências altas. O gráfico mostra a frequência em hertz (Hz) e o nível em decibéis em relação ao máximo da escala digital (dBFS). Os picos indicam quais as bandas de frequência com mais energia na gravação.

## Como visualizar o espectro de áudio

1. Escolha ou arraste um ficheiro mono ou estéreo em WAV, MP3, M4A, FLAC ou OGG. Os formatos que pode abrir dependem do navegador.
2. Identifique a frequência dominante. Em seguida, aponte para o gráfico ou toque nele para consultar outra frequência e o respetivo nível. Pode usar o cursor com o teclado para consultar os mesmos valores.
3. Alterne entre as escalas logarítmica e linear conforme necessário. Reproduza o ficheiro original enquanto examina o gráfico. A análise e a reprodução decorrem no seu dispositivo.

## Como interpretar o gráfico FFT

A ferramenta descodifica o áudio a 48 kHz e usa uma transformada rápida de Fourier (FFT) para analisar excertos curtos distribuídos ao longo do ficheiro. Aplica uma janela de Hann a cada excerto. Calcula a potência média dos excertos e combina os canais estéreo pela sua potência, pelo que os sons desfasados entre canais continuam visíveis. O gráfico vai até aos 24 kHz. Os níveis referem-se a intervalos individuais de frequência e diferem do volume global, do nível de pico das amostras e da sonoridade integrada em LUFS.

Um pico estreito perto dos 50 ou 60 Hz pode indicar um zumbido da rede elétrica. Uma quebra repentina nas frequências altas pode resultar de filtragem ou compressão. Um pico isolado pode ser um harmónico. Verifique os picos próximos antes de o usar para identificar a altura de uma nota.

## Quando devo usar a escala de frequências logarítmica ou linear?

A escala logarítmica dá mais espaço aos graves e aos médios e facilita a leitura por oitavas. Na escala linear, diferenças iguais em Hz ocupam a mesma distância. Isso ajuda a comparar harmónicos com espaçamento regular. O gráfico resume as frequências de toda a gravação. Para ver quando surge um som ou como a sua frequência varia ao longo do tempo, consulte um espectrograma.
