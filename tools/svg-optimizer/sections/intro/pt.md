## O que esta ferramenta faz

Este SVG Optimizer compacta um arquivo SVG local ou um documento SVG colado no
seu navegador. Ele usa passagens de limpeza SVGO para remover comentários,
metadados, atributos redundantes, precisão desnecessária e outras marcações que
não alteram a imagem visível.

## Por que ela ajuda

Arquivos SVG exportados de ferramentas de design geralmente contêm metadados do
editor, caminhos verbosos, IDs não usados e comentários. Otimizá-los pode reduzir
o tamanho do download, melhorar o carregamento da página e tornar o código SVG
inline mais fácil de revisar antes de ser publicado em um site, app, email ou
página de documentação.

## Como funciona

Envie um arquivo `.svg` ou cole a marcação SVG, escolha a predefinição segura ou
ajuste as passagens SVGO individuais e execute a otimização. A ferramenta mostra
as pré-visualizações original e otimizada, a economia de bytes e a marcação final
para que você possa copiá-la ou baixar um arquivo `.optimized.svg`. O SVG nunca
precisa sair do seu dispositivo.

## Notas práticas

- Mantenha a predefinição segura quando o SVG depender de CSS externo, IDs
  usados por scripts ou referências de símbolos que você não consiga inspecionar
  facilmente.
- Use a predefinição agressiva para ícones, logotipos e ilustrações simples
  exportados em que remover dimensões e incorporar estilos seja aceitável.
- Pré-visualize a imagem otimizada antes de substituir a arte de origem,
  especialmente quando a origem usar máscaras, gradientes, filtros ou recursos
  vinculados.
