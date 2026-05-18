# Combine arquivos PDF no seu navegador

Use este combinador de PDF quando precisar criar um documento a partir de vários PDFs de origem, como combinar páginas digitalizadas, juntar formulários assinados ou agrupar relatórios para compartilhamento. Adicione dois ou mais arquivos, revise a contagem de páginas e organize a fila antes de criar o PDF final.

## Como a ordem de combinação funciona

A ferramenta acrescenta todas as páginas do primeiro PDF, depois todas as páginas do PDF seguinte, continuando pela fila. Você pode reordenar arquivos com os controles de seta, arrastar linhas no desktop, remover enganos e pré-visualizar cada arquivo de origem antes de combinar.

## Privacidade e tratamento de arquivos

Toda a análise e combinação acontece localmente no seu navegador com `pdf-lib` e um worker em segundo plano. Seus arquivos não são enviados para InBrowser.App, e o link de download gerado existe apenas na sessão atual do navegador.

## Limites importantes

PDFs criptografados ou danificados não podem ser combinados de forma confiável. Se um arquivo estiver protegido por uma senha de proprietário, remova essa restrição primeiro e adicione novamente o PDF desbloqueado. Arquivos muito grandes podem demorar mais porque o navegador precisa copiar cada página para um novo documento.
