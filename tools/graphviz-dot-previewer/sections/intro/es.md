## Cómo previsualizar un grafo Graphviz DOT en línea

Pega el contenido DOT de un archivo, un script o la documentación en **Código DOT**. La vista previa se actualiza a medida que escribes. Usa `digraph` y `->` para las aristas dirigidas, o `graph` y `--` para las no dirigidas. Los ejemplos incluidos muestran cómo se escriben las dependencias, las redes y los clústeres.

## Cómo elegir un motor de disposición de Graphviz

Empieza con `dot` para grafos por niveles, como las dependencias de compilación. Prueba `neato` o `fdp` para distribuir una red no dirigida, `sfdp` para redes más grandes, `circo` para disposiciones circulares o `twopi` para un árbol radial. Graphviz también ofrece `osage` para grafos con clústeres y `patchwork` para mapas de árbol. El editor conserva el código DOT al cambiar de motor.

## Cómo interpretar los avisos de disposición y los errores de sintaxis

Graphviz puede indicar un error si el operador de una arista no coincide con el tipo de grafo o si falta una llave o una comilla. Revisa la línea indicada y la anterior. La vista previa también puede aparecer junto a avisos sobre atributos que Graphviz no pudo aplicar. Si el grafo ya define el atributo `layout`, Graphviz usa el motor indicado en él. Consulta la [referencia del lenguaje DOT](https://graphviz.org/doc/info/lang.html) y la [guía de disposición de Graphviz](https://graphviz.org/docs/layouts/) para ver los detalles de sintaxis y de cada motor.
