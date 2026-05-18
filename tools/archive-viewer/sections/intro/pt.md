Um visualizador de arquivos compactados permite inspecionar um arquivo compactado antes de extraí-lo. Esta ferramenta abre arquivos ZIP, TAR, GZ, TGZ e TAR.GZ diretamente no navegador para que você possa confirmar o que há dentro, navegar por pastas, pré-visualizar arquivos legíveis e baixar apenas a entrada de que precisa.

## Quando usar

Use quando receber um pacote compactado e quiser dar uma olhada rápida sem descompactar todo o arquivo. Ele é útil para verificar pacotes de versão, modelos baixados, pacotes de registros, instantâneos de código-fonte ou um anexo `.gz` de arquivo único.

## Privacidade e manuseio de arquivos

O conteúdo do arquivo compactado é lido localmente na sessão do navegador. O arquivo não é enviado para InBrowser.App. Entradas de texto grandes são limitadas na pré-visualização para manter a página responsiva; baixe a entrada quando precisar inspecionar o arquivo completo.

## Formatos de arquivo suportados

O visualizador oferece suporte a arquivos ZIP padrão, arquivos TAR não compactados, arquivos únicos compactados com GZIP e arquivos TAR encapsulados em GZIP (`.tgz` ou `.tar.gz`). Arquivos protegidos por senha ou criptografados não são suportados nesta primeira passagem da reescrita.

## Comportamento da pré-visualização

Arquivos semelhantes a texto, como JSON, Markdown, registros, código-fonte, CSV, XML, YAML e TOML, podem ser pré-visualizados com destaque de sintaxe quando houver uma linguagem correspondente disponível. Arquivos de imagem comuns podem ser pré-visualizados visualmente, e documentos PDF abrem no visualizador de PDF integrado do navegador quando disponível. Outros arquivos binários continuam disponíveis para baixar, mas a ferramenta não tentará renderizá-los.
