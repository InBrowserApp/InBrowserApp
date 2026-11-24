## Como ver o histograma de uma imagem

Escolha ou arraste uma foto, captura de tela ou ilustração para ver o histograma ao lado da imagem. Você também pode testar com a foto de exemplo. Comece em **Brilho** para ver a distribuição geral dos tons e passe para **RGB** para comparar vermelho, verde e azul na mesma escala. Selecione um canal para examiná-lo em detalhe.

## Como interpretar sombras, tons médios e realces

O eixo horizontal vai de 0 (o nível mais escuro) a 255 (o mais claro). As sombras ficam à esquerda, os tons médios no centro e os realces à direita. Quanto mais alta a barra, mais pixels há no nível correspondente. Passe o ponteiro sobre o gráfico, toque no nível desejado ou ajuste o controle de nível com as teclas de seta para ver a contagem exata de pixels.

Um pico em uma das extremidades pode indicar recorte de sombras ou de realces, com possível perda de detalhes. Um pico no nível 255 do canal vermelho, por exemplo, pode revelar recorte nesse canal mesmo quando ainda há espaço à direita no histograma de brilho. Um fundo branco puro também pode criar um pico na extremidade direita. Confira a prévia da imagem para interpretá-lo. Os indicadores **Sombras** e **Realces** mostram a porcentagem de pixels analisados que estão exatamente nos níveis 0 e 255, respectivamente.

## Quando usar uma escala logarítmica

Use a escala **Linear** para que a altura de cada barra seja proporcional à contagem de pixels. Experimente a escala **Logarítmica** quando uma área grande de cor uniforme dificultar a leitura do restante do histograma. A escala altera a altura das barras. A contagem de pixels por nível continua a mesma.

## O que o visualizador mede

O visualizador conta os pixels da imagem de 8 bits renderizada pelo navegador, nas dimensões originais. O brilho é calculado a partir dos valores de vermelho, verde e azul, dando mais peso ao verde. Os pixels totalmente transparentes são ignorados e cada pixel parcialmente transparente é contado uma vez, embora seus valores RGB possam ser arredondados durante a renderização. Em imagens animadas, é analisado um único quadro. Suas imagens são processadas no seu dispositivo.
