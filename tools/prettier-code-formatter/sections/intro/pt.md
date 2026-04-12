## O Que É o Prettier Code Formatter?

O Prettier Code Formatter executa o pipeline oficial standalone do Prettier
diretamente no navegador, para que você possa normalizar arquivos-fonte sem
enviar o código para um servidor. Ele é útil quando você precisa de uma
passagem rápida de formatação, quer comparar diferentes configurações de
largura de linha ou precisa de um arquivo limpo para copiar ou baixar
imediatamente.

## Formatos Suportados

Este rewrite mantém a ferramenta focada nos formatos que o Prettier já lida
bem no navegador: JavaScript, TypeScript, Flow, JSON, HTML, CSS, SCSS, Less,
Markdown, MDX, YAML, GraphQL e formatos de template relacionados, como Vue e
Handlebars. O seletor de idioma controla qual parser é executado, e a
importação de arquivo detecta automaticamente o parser quando a extensão é
reconhecida.

## Como Este Rewrite Funciona

O rewrite mantém a lógica pesada de formatação fora do caminho principal da UI.
As solicitações de formatação são montadas a partir de configuração pura da
ferramenta e então executadas por um pipeline Prettier carregado sob demanda e
com worker, para que a digitação normal continue responsiva. Entradas grandes
pausam a formatação automática e trocam para a ação explícita `Formatar agora`,
o que é mais previsível do que tentar reformatar um arquivo grande a cada
tecla.
