export const examples = {
  dependencies: {
    engine: "dot",
    source: `digraph Dependencies {
  rankdir=LR;
  node [shape=box, style="rounded,filled", color="#4f46e5", fillcolor="#eef2ff"];

  App -> {UI API};
  UI -> DesignTokens;
  API -> Database;
}`,
  },
  network: {
    engine: "neato",
    source: `graph Network {
  node [shape=circle, style=filled, color="#0f766e", fillcolor="#ccfbf1"];

  Oslo -- {Stockholm Helsinki};
  Stockholm -- Copenhagen;
  Copenhagen -- {Helsinki Berlin};
  Berlin -- Oslo;
}`,
  },
  clusters: {
    engine: "dot",
    source: `digraph Release {
  rankdir=LR;
  node [shape=box, style=rounded];

  subgraph cluster_build {
    label="Build";
    Checkout -> Compile -> Test;
  }
  subgraph cluster_deploy {
    label="Deploy";
    Stage -> Publish;
  }
  Test -> Stage;
}`,
  },
}
