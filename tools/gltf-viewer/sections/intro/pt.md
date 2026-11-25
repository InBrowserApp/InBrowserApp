## Abrir um modelo GLB ou glTF online

Clique em **Abrir arquivos** ou solte o modelo no visualizador. Um arquivo `.glb` armazena uma cena glTF em um contêiner binário que geralmente reúne a geometria e as texturas no mesmo arquivo. Um arquivo `.gltf` descreve a cena em JSON e pode fazer referência a arquivos associados. Se a exportação incluir `model.bin` e `albedo.png`, por exemplo, selecione-os junto com `model.gltf`. O visualizador lê os arquivos no seu dispositivo.

## Inspecionar os materiais e reproduzir animações

Arraste para girar, use a roda do mouse ou o gesto de pinça para dar zoom e clique em **Ajustar à janela** para reenquadrar a cena inteira. Ative **Malha de arame** para ver os triângulos sob os materiais. Se o arquivo tiver animações, escolha um clipe e clique em **Reproduzir animação**. Use **Experimentar um exemplo** para abrir um modelo animado.

## Abrir um modelo quando faltam recursos

Se o modelo fizer referência a um buffer ou a uma imagem externa, selecione-o junto com os arquivos correspondentes. Mantenha os nomes originais. Se o modelo usar uma extensão de compactação de texturas incompatível com o visualizador, exporte-o novamente com texturas em PNG ou JPEG. Consulte a [especificação glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) para saber mais sobre os dois contêineres.

## Abrir outros formatos 3D

Use o [Visualizador de OBJ](../obj-viewer/) para malhas Wavefront com materiais MTL ou o [Visualizador de STL](../stl-viewer/) para inspecionar uma malha triangular antes da impressão 3D.

- [Visualizador de 3MF](../3mf-viewer/)

Use o [Conversor de glTF para GLB](../gltf-to-glb-converter/) para incorporar em um só arquivo GLB os buffers e as texturas referenciados por um modelo glTF.
