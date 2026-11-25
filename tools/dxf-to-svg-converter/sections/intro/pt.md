## Converter um desenho DXF para SVG

Clique em **Abrir arquivo DXF** ou solte um desenho `.dxf` em formato ASCII. Clique em **Experimentar um exemplo** para carregar um suporte com perfil, furos, linhas de centro e anotações. A ferramenta lê o desenho no navegador e mostra uma prévia vetorial. Clique em **Baixar SVG** para salvar a geometria selecionada do espaço do modelo em um arquivo SVG independente.

## Escolher as camadas para exportar

Em **Camadas**, selecione as camadas que você deseja exportar. A prévia é atualizada quando você inclui ou exclui uma camada. Por exemplo, exporte o contorno e os furos para uma ilustração ou inclua as linhas de centro e as anotações para obter uma vista anotada. O SVG mantém as camadas selecionadas como grupos vetoriais separados.

## Preservar a escala do desenho

Quando o DXF especifica uma unidade de comprimento, como milímetros ou polegadas, o SVG registra as dimensões físicas em milímetros. A geometria mantém a escala original dentro do arquivo. Desenhos DXF sem unidade usam as coordenadas do desenho no atributo `viewBox` do SVG. A prévia se ajusta ao espaço disponível na tela. [Variáveis de cabeçalho do DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Exportar a geometria do espaço do modelo

O conversor exporta linhas, polilinhas, arcos, círculos, blocos e textos compatíveis. As curvas são desenhadas com segmentos vetoriais, e os textos compatíveis viram contornos vetoriais com as fontes disponíveis. Se o desenho estiver em um layout, mova a geometria para o espaço do modelo antes de exportar o DXF. Para inspecionar o desenho, desloque a vista, ajuste o zoom e mostre ou oculte camadas no [Visualizador de DXF](../dxf-viewer/).
