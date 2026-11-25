## Converter um arquivo Wavefront OBJ para STL

Clique em **Abrir arquivo** ou solte um arquivo `.obj` no conversor. Clique em **Experimentar um exemplo** para converter um pequeno suporte de montagem. O conversor divide as faces poligonais em triângulos. Depois, clique em **Baixar STL** para salvar o arquivo `.stl` binário. A conversão é feita no seu dispositivo.

## O que muda ao exportar para STL

O formato STL armazena uma superfície triangular. A conversão descarta materiais, imagens de textura, coordenadas UV, linhas e pontos isolados. A conversão preserva os eixos e a escala. O STL binário armazena as coordenadas como números de ponto flutuante de 32 bits. Quando as coordenadas são muito grandes, o arredondamento pode afetar os menores detalhes. Antes da impressão, escolha a unidade de medida pretendida no fatiador. Uma extensão de 40 unidades de coordenadas no OBJ, por exemplo, continua com 40 unidades no STL.

A conversão pode ser concluída mesmo que a malha apresente furos ou outros problemas geométricos. Confira o resultado no fatiador antes de imprimir.

## Visualizar o resultado ou fazer a conversão inversa

Use o [Visualizador de STL](../stl-viewer/) para abrir o arquivo baixado ou o [Visualizador de OBJ](../obj-viewer/) para inspecionar o original com os materiais fornecidos. Use o [Conversor de STL para OBJ](../stl-to-obj-converter/) para fazer a conversão inversa.
