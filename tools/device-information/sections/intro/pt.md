## O que esta ferramenta mostra

A ferramenta Informações do Dispositivo reúne os detalhes visíveis para o
navegador sobre o dispositivo em uso agora. Ela agrupa os resultados em seções
de navegador, tela, hardware, rede, armazenamento e capacidades para que possa
ver rapidamente o que um site consegue detectar sem instalar software de
diagnóstico.

## Quando ela ajuda

Use-a quando precisar depurar layouts responsivos, reproduzir tickets de
suporte, comparar navegadores, confirmar se cookies ou armazenamento local estão
disponíveis, verificar dimensões da tela ou gerar uma captura JSON compacta
para um relatório de bug. Ela também é útil antes de testar canvas, WebGL, área
de transferência, service worker ou recursos dependentes de armazenamento.

## Notas sobre privacidade e precisão

A ferramenta é executada inteiramente no seu navegador e não envia a captura.
Navegadores ocultam ou arredondam deliberadamente alguns valores, especialmente
detalhes de memória, CPU, GPU, rede e user agent. Valores ausentes geralmente
significam que o navegador não expõe essa API, que a página não está em um
contexto seguro ou que uma configuração de privacidade bloqueou o acesso.

## Como ler os resultados

Trate os dados como a visão atual do navegador sobre o seu ambiente, não como
um inventário de hardware garantido. Redimensione a janela ou gire o
dispositivo e atualize a captura para atualizar valores de viewport, orientação
e tela. Use a ação Copiar JSON quando precisar compartilhar os valores
observados exatos com um desenvolvedor ou equipe de suporte.
