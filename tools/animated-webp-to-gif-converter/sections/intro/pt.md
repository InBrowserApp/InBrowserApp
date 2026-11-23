## Converta WebP animado para GIF

Um WebP animado guarda vários quadros em um único arquivo `.webp`. Converta a
animação para GIF quando for usá-la em conversas, sites de documentação ou
outros destinos que exigem esse formato. A ferramenta aceita WebP animado
com ou sem perda de qualidade. O processamento é feito no seu dispositivo.

### Como converter WebP animado para GIF

1. Selecione **Escolher arquivo** ou arraste um WebP animado para a ferramenta.
2. Selecione **Criar GIF** para converter os quadros nas dimensões originais.
3. Selecione **Reproduzir** para conferir o GIF e **Baixar GIF** para salvá-lo.

### O que acontece com a duração dos quadros e as repetições?

Cada quadro mantém sua duração, arredondada para múltiplos de 10 ms, com um
mínimo de 20 ms para reprodução. Por exemplo, um quadro de 100 ms seguido de
um de 250 ms mantém as duas durações. O GIF mantém o total de reproduções
configurado no WebP. Se o WebP repetir indefinidamente, o GIF também vai repetir.

### Como o GIF trata a transparência e as cores?

O GIF usa uma paleta indexada com até 256 entradas por quadro e uma única
entrada transparente. O WebP pode guardar transparência parcial, por isso
sombras translúcidas e bordas suavizadas podem ficar diferentes no GIF.
Quadros com muitas cores também podem apresentar faixas nos gradientes.
Confira a prévia com o fundo que você pretende usar.

### Perguntas frequentes

#### Posso converter um WebP estático?

A ferramenta precisa de quadros de animação. Tanto imagens estáticas como
animadas podem ter a extensão `.webp`. Para criar uma animação a partir de
várias imagens estáticas, use o [Criador de GIF](/pt/tools/gif-maker/).

#### Por que o GIF é maior que o WebP?

O WebP comprime de forma eficiente as cores e as áreas que mudam de um quadro
para outro. O GIF pode ser maior mesmo com as mesmas dimensões e durações.
Se houver um limite para o envio, confira o tamanho do GIF ao lado da prévia.

### Outras ferramentas de animação

Use o [conversor de GIF para WebP animado](/pt/tools/gif-to-animated-webp-converter/)
para a conversão inversa ou o
[conversor de APNG para GIF](/pt/tools/apng-to-gif-converter/) para um PNG
animado.
