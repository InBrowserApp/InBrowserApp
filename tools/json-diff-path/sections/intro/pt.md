## Visão geral

JSON Diff Path compara dois documentos JSON e transforma cada alteração
estrutural em um registro de caminho legível, com saída em JSONPath e JSON
Pointer.

## Quando usar

Use quando precisar revisar mudanças em payloads de API, inspecionar
migrações de configuração ou gerar operações JSON Patch RFC 6902 para
automação.

## Como funciona

A ferramenta analisa ambas as entradas JSON, calcula as alterações `add`,
`remove` e `replace`, e depois permite filtrar essas operações e alternar
entre uma lista de caminhos e a saída JSON Patch no mesmo painel de
resultados.
