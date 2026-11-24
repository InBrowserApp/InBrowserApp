## Preview a Graphviz DOT graph online

Paste DOT source from a file, script, or documentation into **DOT source**. The graph updates as you type. Use `digraph` and `->` for directed edges, or `graph` and `--` for undirected edges. Select a built-in example to see how dependencies, networks, and clusters are written.

## Choose a Graphviz layout engine

Start with `dot` for layered graphs such as build dependencies. Try `neato` or `fdp` to spread out an undirected network, `sfdp` for larger networks, `circo` for circular layouts, or `twopi` for a radial tree. Graphviz also offers `osage` for clustered graphs and `patchwork` for treemaps. The DOT source stays in the editor when you switch engines.

## Understand layout and syntax feedback

Graphviz can report an error when an edge operator does not match the graph type or when a brace or quote is missing. Check the reported line and the line before it. Graphviz can also produce a preview with notes about attributes it could not apply. If your graph specifies its own `layout` attribute, Graphviz uses that engine. See the [DOT language reference](https://graphviz.org/doc/info/lang.html) and [Graphviz layout guide](https://graphviz.org/docs/layouts/) for syntax and engine details.

## Export a Graphviz DOT graph to SVG or PDF

Choose **Download PDF** to save the complete layout on a page sized to the graph. Its shapes and lines stay sharp when zoomed or printed. Use **Download SVG** to embed the graph in a web page or open it in a vector editor. **Fit to view** and **Actual size** only change the on-screen preview. Keep your DOT source to edit the graph later.
