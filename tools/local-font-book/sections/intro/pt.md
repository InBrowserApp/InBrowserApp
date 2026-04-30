## O que é Local Font Access?

Local Font Access é uma API do navegador que lista as fontes instaladas no dispositivo.

Esta ferramenta permite pesquisar os resultados, comparar variações relacionadas e copiar um trecho CSS da fonte escolhida.

Funciona apenas em contextos seguros e navegadores compatíveis, com permissão do usuário (local-fonts).

A API retorna FontData com family, fullName, postscriptName e style.

### Pontos-chave

- Use-a para confirmar os nomes exatos necessários para uma pilha CSS `font-family` no dispositivo atual.
- As chamadas devem ser iniciadas por um gesto do usuário.
- Permissions Policy pode bloquear o acesso em alguns sites.
- Esta ferramenta fica no dispositivo e não envia fontes.
