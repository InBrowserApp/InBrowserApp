## Como verificar um arquivo GeoJSON

Abra um arquivo .geojson ou .json ou cole um documento GeoJSON e selecione **Validar GeoJSON**. Use **Testar um exemplo** para ver uma FeatureCollection válida. Você pode editar o conteúdo e validar novamente. Os arquivos e o texto colado ficam no navegador.

## O que o validador verifica

A ferramenta verifica primeiro a sintaxe JSON e depois a estrutura do GeoJSON, incluindo FeatureCollection, Feature, GeometryCollection e os tipos individuais de geometria. As posições usam WGS 84, com a longitude antes da latitude. O validador confere os intervalos das coordenadas, o número mínimo de posições em linhas e anéis, o fechamento dos anéis, as propriedades das feições e a estrutura das caixas delimitadoras. Coleções de feições vazias e feições com geometria null são válidas.

## Como localizar e corrigir um erro

Um caminho de erro como `$.features[0].geometry.coordinates` indica as coordenadas da primeira feição. Corrija o campo indicado e valide o documento novamente. O resultado descreve a estrutura do arquivo. A topologia das geometrias, como autointerseções ou sobreposições, pode ser verificada à parte em um SIG. Para examinar visualmente o resultado válido, abra-o no [Visualizador de GeoJSON](../geojson-viewer/).
