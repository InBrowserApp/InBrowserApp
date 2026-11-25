## Como abrir um Shapefile

Solte no visualizador um ZIP com seu Shapefile da Esri. Você também pode selecionar o arquivo .shp junto com os arquivos associados. Se o ZIP contiver vários Shapefiles, use **Camada** para alternar entre eles. Selecione **Testar um exemplo** para explorar um conjunto de dados com uma camada de pontos e outra de polígonos. Seus arquivos são lidos no navegador e ficam neste dispositivo.

## Quais arquivos do Shapefile você precisa?

O arquivo .shp contém as geometrias e basta para visualizar uma camada com coordenadas geográficas. Inclua o arquivo .dbf para consultar os atributos, o .prj para identificar o sistema de referência de coordenadas e, se disponível, o .cpg para indicar a codificação do texto dos atributos. Mantenha juntos os arquivos da mesma camada e use o mesmo nome-base. O arquivo de índice .shx pode ficar no ZIP ou na seleção.

## Explorar o mapa e os atributos

O mapa offline se ajusta à camada atual. Use os controles do mapa para aproximar, afastar ou ajustar a visualização novamente. Selecione uma geometria no mapa ou na lista **Feições** para consultar seus atributos. Um arquivo .prj compatível permite que o visualizador transforme as coordenadas projetadas para exibi-las no mapa. Sem esse arquivo, os valores dentro dos intervalos de longitude e latitude são interpretados como coordenadas WGS 84. Se uma camada precisar de uma projeção, abra-a novamente com seu arquivo .prj para posicioná-la corretamente.
