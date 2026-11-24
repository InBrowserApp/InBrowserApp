## Pré-visualizar um grafo Graphviz DOT online

Cole o código DOT de um arquivo, script ou documentação no campo **Código DOT**. O grafo se atualiza enquanto você digita. Use `digraph` e `->` para arestas direcionadas ou `graph` e `--` para arestas não direcionadas. Os exemplos da ferramenta mostram como escrever dependências, redes e agrupamentos.

## Escolher um mecanismo de layout do Graphviz

Comece com `dot` para grafos em camadas, como os de dependências de compilação. Experimente `neato` ou `fdp` para distribuir os nós de uma rede não direcionada, `sfdp` para redes maiores, `circo` para um layout circular ou `twopi` para uma árvore radial. O Graphviz também oferece `osage` para grafos com agrupamentos e `patchwork` para mapas de árvore. O código DOT continua no editor quando você troca de mecanismo.

## Entender avisos de layout e erros de sintaxe

O Graphviz pode apontar um erro se um operador de aresta não corresponde ao tipo de grafo ou se falta uma chave ou uma aspa. Confira a linha indicada e a anterior. A prévia também pode aparecer junto com avisos sobre atributos que o Graphviz não conseguiu aplicar. Se o grafo define o próprio atributo `layout`, o Graphviz usa o mecanismo indicado nele. Para mais detalhes, consulte a [referência da linguagem DOT](https://graphviz.org/doc/info/lang.html) e o [guia de layouts do Graphviz](https://graphviz.org/docs/layouts/).
