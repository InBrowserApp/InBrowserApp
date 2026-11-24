## Visualizzare in anteprima un grafo Graphviz DOT online

Incolla in **Codice DOT** il sorgente DOT di un file, di uno script o della documentazione. Il grafo si aggiorna mentre scrivi. Usa `digraph` e `->` per gli archi orientati, oppure `graph` e `--` per gli archi non orientati. Gli esempi inclusi mostrano come descrivere dipendenze, reti e cluster.

## Scegliere un motore di layout di Graphviz

Parti da `dot` per i grafi a livelli, come le dipendenze di compilazione. Prova `neato` o `fdp` per distribuire i nodi di una rete non orientata, `sfdp` per le reti più grandi, `circo` per una disposizione circolare o `twopi` per un albero radiale. Graphviz offre anche `osage` per i grafi con cluster e `patchwork` per le treemap. Il codice DOT resta nell’editor quando cambi motore.

## Interpretare gli avvisi sul layout e gli errori di sintassi

Graphviz può segnalare un errore quando l’operatore di un arco non corrisponde al tipo di grafo o quando manca una parentesi graffa o una virgoletta. Controlla la riga indicata e quella precedente. L’anteprima può anche mostrare avvisi sugli attributi che Graphviz non ha potuto applicare. Se il grafo specifica un attributo `layout`, Graphviz usa il motore indicato in quell’attributo. Consulta il [riferimento del linguaggio DOT](https://graphviz.org/doc/info/lang.html) e la [guida ai layout di Graphviz](https://graphviz.org/docs/layouts/) per maggiori dettagli.
