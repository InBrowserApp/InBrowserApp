## Como ampliar uma imagem com IA

1. Escolha ou arraste uma imagem JPG, PNG ou WebP. Use a melhor versão que tiver, mesmo que seja pequena.
2. Selecione **2×** ou **4×** e confira as dimensões finais. Uma imagem de 400 × 300 passa a 800 × 600 em 2× ou a 1600 × 1200 em 4×.
3. Selecione **Ampliar imagem** e mova o controle de comparação para examinar os contornos e as texturas. Baixe o resultado em PNG sem perdas.

## O que é super-resolução de imagens com IA?

A super-resolução aumenta as dimensões em pixels de uma imagem de baixa resolução. O InBrowser.App usa o Real-ESRGAN, um modelo treinado para estimar contornos mais definidos e texturas mais finas a partir dos pixels disponíveis. Ele pode deixar mais nítidas fotos pequenas, ilustrações e imagens compactadas da web ao ampliá-las. Confira os rostos, as letras pequenas e os padrões finos na prévia. Os detalhes acrescentados são estimativas e podem diferir da cena original.

## Quando usar a ampliação de 2× ou 4×?

Escolha 2× para uma ampliação moderada, como ao usar uma miniatura em um layout maior. Escolha 4× quando a imagem precisar ocupar muito mais espaço, como ao exibir em tamanho maior uma digitalização pequena. Dobrar cada dimensão quadruplica a quantidade de pixels. Quadruplicar cada dimensão gera dezesseis vezes mais pixels. A imagem original pode ter até 2.048 pixels de cada lado e 1 megapixel no total.

## A ampliação é feita no meu dispositivo?

Sim. Seu navegador baixa o modelo Real-ESRGAN quando você inicia a primeira ampliação. O processamento é feito no seu dispositivo com WebGPU quando disponível e pode usar a CPU por meio do WebAssembly. A primeira ampliação pode demorar mais. O tempo de processamento depende das dimensões da imagem e do seu dispositivo. A imagem fica no seu dispositivo durante todo o processo.
