## Normalize áudio para um nível em LUFS

Iguale o volume percecionado de episódios de podcast, locuções e faixas de música. O normalizador mede a sonoridade integrada de toda a gravação e aplica o mesmo ajuste de ganho a todos os canais. A diferença de nível entre as passagens mais suaves e mais fortes mantém-se. Escolha uma predefinição ou introduza o valor em LUFS exigido pelo seu projeto.

## Como normalizar um ficheiro de áudio

1. Escolha ou arraste uma gravação mono ou estéreo. Os formatos mais comuns incluem WAV, MP3, M4A, FLAC e OGG. Os codecs disponíveis dependem do navegador.
2. Selecione um nível como −16 LUFS para podcasts, −14 LUFS para música ou −23 LUFS para radiodifusão. Os requisitos de publicação variam. Se tiver uma especificação de entrega, introduza o valor indicado.
3. Compare as medições originais com as do áudio normalizado, ouça o resultado e transfira um WAV de 16 bits a 48 kHz. A descodificação, a análise e a exportação decorrem no seu dispositivo.

## Qual é a diferença entre LUFS e pico real?

A sonoridade integrada, em LUFS, estima o volume percecionado de toda a gravação. Para isso, pondera as frequências e exclui as passagens abaixo de um limiar de sonoridade. O pico real, indicado em dBTP, estima o nível máximo que o sinal reconstruído pode alcançar entre amostras. Duas faixas podem ter picos semelhantes e sonoridades muito diferentes. Por isso, igualar apenas os picos pode deixar uma das faixas a soar mais baixo.

## Porque é que o resultado fica abaixo do nível pretendido?

Um transiente curto pode atingir o limite de −1 dBTP antes de a sonoridade global chegar ao nível pretendido. Nesse caso, a ferramenta reduz o ganho e mostra o valor que consegue alcançar. Para obter um master com maior sonoridade e a mesma margem de pico, controle os picos mais altos no editor de áudio antes de normalizar. Um ficheiro silencioso pode não ter sonoridade integrada mensurável.
