Remova restrições de palavra-passe de proprietário de um PDF diretamente no seu navegador. A ferramenta cria um novo PDF que já não inclui sinalizadores de permissão para edição, impressão, cópia ou extração de páginas.

## Quando usar

Use-a quando já tiver um PDF que abre normalmente, mas o documento bloqueia ações comuns como imprimir, copiar texto, editar páginas ou montar páginas noutra ferramenta de PDF. Isto é comum em formulários, relatórios exportados, faturas antigas e documentos criados com definições restritivas de permissões de PDF.

## Como funciona

Carregue um PDF, reveja o ficheiro selecionado e execute a etapa de remoção. A ferramenta executa qpdf num worker do navegador com a operação `--decrypt` de PDF e devolve um novo ficheiro PDF para transferir. O ficheiro original permanece inalterado, para que possa comparar ou descartar o resultado se não for a versão de que precisa.

## Privacidade e limitações

O PDF permanece nesta sessão do navegador; não é carregado para um servidor. Esta ferramenta remove restrições de permissões de palavra-passe de proprietário de PDFs que já podem ser abertos. Não recupera uma palavra-passe de utilizador/abertura perdida e não consegue desbloquear ficheiros danificados nem modos de encriptação não suportados pela compilação de qpdf para o navegador.
