## Como converter GPX para GeoJSON

Abra um arquivo .gpx ou cole o XML do GPX e selecione **Converter para GeoJSON**. Use **Testar um exemplo** para ver como uma trilha, uma rota e um ponto de passagem aparecem no resultado. Copie o GeoJSON ou baixe um arquivo .geojson para seu projeto de mapeamento ou SIG. A conversão é feita no navegador e os dados ficam no seu dispositivo.

## Como trilhas, rotas e pontos de passagem são convertidos

O resultado é uma FeatureCollection do GeoJSON. Pontos de passagem se tornam pontos, rotas se tornam linhas e os trechos contínuos de uma trilha são mantidos separados. Um trecho ou uma rota com uma única posição se torna um ponto. Campos descritivos, como nomes e notas, permanecem associados às respectivas feições.

## Coordenadas, elevação e horário

O GeoJSON armazena primeiro a longitude e depois a latitude. As linhas que cruzam o antimeridiano são divididas em 180° para exibição em mapas-múndi. Quando disponível, a elevação é adicionada como a terceira coordenada, em metros. Os horários dos pontos são armazenados nas propriedades das feições. Ao longo das rotas e dos trechos de trilha, eles seguem a ordem das coordenadas para que possam ser associados às posições. Você pode abrir o resultado no [Visualizador de GeoJSON](../geojson-viewer/) ou explorar o GPX original no [Visualizador GPX com perfil de elevação](../gpx-viewer/).
