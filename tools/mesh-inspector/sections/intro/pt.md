## Verificar uma malha STL ou OBJ online

Clique em **Abrir arquivo** ou solte um modelo `.stl` ou `.obj` na ferramenta. Ela lê a malha no seu dispositivo e mostra a área da superfície, o volume delimitado e os problemas de topologia. Clique em **Experimentar um exemplo** para verificar um suporte de montagem com malha fechada antes de inspecionar seu próprio arquivo.

## Interpretar a área da superfície e o volume

As coordenadas de STL e OBJ não definem uma unidade física comum. Em **Unidade das coordenadas**, selecione a unidade que você usou para exportar o modelo. A área aparece em unidades quadradas e o volume em unidades cúbicas. A opção identifica a unidade das coordenadas armazenadas e preserva a escala. O suporte do exemplo tem volume de 16.016 mm³ quando suas coordenadas estão em milímetros.

A área da superfície soma as áreas dos triângulos do arquivo, incluindo todas as cópias das faces duplicadas. Quando a malha passa pelas verificações de topologia, a ferramenta calcula o volume pela orientação das faces. Superfícies que se cruzam consigo mesmas, componentes com orientação incorreta e componentes sobrepostos ainda podem afetar essa estimativa. Compare resultados importantes com o modelo sólido original.

## Entender os resultados de topologia

- Uma **aresta de contorno** pertence a um único triângulo. Essas arestas delimitam os contornos abertos, inclusive os furos.
- Uma **aresta não manifold** pertence a mais de dois triângulos. Um **vértice não manifold** é a extremidade de uma dessas arestas ou o ponto de encontro de grupos desconectados de faces.
- Há **orientação inconsistente** quando dois triângulos percorrem a aresta compartilhada na mesma direção. Faces vizinhas com a orientação correta percorrem a aresta em direções opostas.
- As **faces degeneradas** têm área zero. As **faces duplicadas** repetem o mesmo triângulo.

A ferramenta conta posições exatamente coincidentes como um único vértice. Ela identifica os componentes da malha a partir das arestas compartilhadas por seus triângulos. Quando encontra um defeito de topologia, ela ainda mostra a área da superfície e a quantidade de problemas. Essas contagens ajudam a identificar o que reparar antes de usar o volume.

## Inspecionar ou converter o modelo

Use o [Visualizador de STL](../stl-viewer/) ou o [Visualizador de OBJ](../obj-viewer/) para examinar o modelo em 3D, inclusive no modo de malha de arame. Use o [Conversor de OBJ para STL](../obj-to-stl-converter/) se a próxima ferramenta exigir um arquivo STL.

Se o relatório de um STL mostrar faces duplicadas ou de área zero, ou orientações inconsistentes, clique em **Reparar STL** para trabalhar com o mesmo arquivo. A ferramenta de [Reparo de malhas STL](../stl-mesh-repair/) também compara as faces duplicadas ou de área zero, a orientação das faces e os problemas de topologia restantes antes de você baixar um novo STL.
