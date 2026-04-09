## Was ist der OpenAPI-zu-TypeScript-Konverter?

Der OpenAPI-zu-TypeScript-Konverter wandelt ein OpenAPI-3.x-Dokument direkt im Browser in generierte TypeScript-Typen um. Das ist nützlich, wenn du schnell eine Typvorschau, eine herunterladbare Deklarationsdatei oder eine sichere Möglichkeit zum Testen von `openapi-typescript`-Optionen möchtest, ohne dein Schema an einen Server zu senden.

## Wann sollte man ihn verwenden?

Nutze dieses Tool, wenn du bereits ein OpenAPI-Schema in JSON oder YAML hast und typisierte Request- und Response-Modelle für Frontend-Apps, SDK-Prototypen oder API-Reviews brauchst. Besonders hilfreich ist es, wenn du Generierungsoptionen vergleichen willst, bevor du die Ausgabe in dein Repository übernimmst.

## Vor dem Generieren

Diese Browser-Neufassung unterstützt gebündelte OpenAPI-3.0- und 3.1-Dokumente. Falls dein Schema noch externe `$ref`-Ziele enthält, bünde oder inline sie zuerst und generiere dann hier die finale TypeScript-Ausgabe.
