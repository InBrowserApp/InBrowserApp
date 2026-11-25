## Reparar um arquivo STL online

Clique em **Abrir arquivo** ou solte um `.stl` ASCII ou binário na ferramenta. O reparo é feito no seu dispositivo. Clique em **Experimentar um exemplo** para ver uma pequena malha com faces duplicadas, de área zero e invertidas. Compare os resultados e clique em **Baixar STL** para salvar um novo arquivo binário com as dimensões e coordenadas originais.

## O que muda no reparo da malha

A ferramenta remove triângulos idênticos e triângulos de área zero. Ela compara a orientação das faces vizinhas e a corrige quando uma das duas orientações consistentes exige inverter menos faces do que a outra. Os pontos da malha permanecem nas posições originais. Contornos abertos, orientações ambíguas e junções não manifold podem exigir reparo manual. A ferramenta mantém os furos, os pontos quase coincidentes e as interseções. [Problemas comuns de malha na impressão 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Comparar a topologia antes e depois do reparo

Confira as contagens de triângulos, faces duplicadas e faces degeneradas. O relatório também mostra as arestas com orientação inconsistente, os contornos abertos e as arestas e os vértices não manifold que restarem. Abra o arquivo baixado no [Visualizador de STL](../stl-viewer/) para inspecioná-lo em 3D. Para conferir a área da superfície ou o volume delimitado, use o [Verificador de volume e topologia da malha](../mesh-inspector/). Você também pode clicar em **Reparar STL** diretamente no relatório de inspeção de um STL com problemas de topologia.
