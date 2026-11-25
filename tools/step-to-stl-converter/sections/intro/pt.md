## Converter um arquivo STEP ou STP para STL

Clique em **Abrir arquivo** ou solte um arquivo `.step` ou `.stp` no conversor. A ferramenta transforma as superfícies do modelo CAD em triângulos no seu dispositivo e gera um STL binário para download. Clique em **Experimentar um exemplo** para converter um suporte de montagem e depois em **Baixar STL** para salvar o resultado.

## Preservar as dimensões para impressão 3D

O formato STEP armazena dimensões físicas. O conversor exporta as coordenadas em milímetros, incluindo a posição de cada componente da montagem. O formato STL não indica a unidade de medida. Selecione milímetros ao abrir o resultado no fatiador. Uma aresta que mede uma polegada no STEP, por exemplo, mede 25,4 unidades de coordenadas no STL.

## Conferir a malha exportada

O STL contém as superfícies trianguladas das peças nas posições que ocupam na montagem. Use o STEP para preservar as superfícies CAD editáveis, os nomes dos componentes e a estrutura da montagem. Abra o STL no [Visualizador de STL](../stl-viewer/) ou confira o volume delimitado e a topologia com o [Verificador de volume e topologia da malha](../mesh-inspector/).

## Inspecionar ou exportar o modelo original

Use o [Visualizador de STEP](../step-viewer/) para conferir as dimensões, girar o modelo CAD e selecionar **Exportar STL** na barra de ferramentas. Se seu fatiador importar arquivos STEP, abra o original e escolha os ajustes da malha no fatiador. [Formatos compatíveis com o PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
