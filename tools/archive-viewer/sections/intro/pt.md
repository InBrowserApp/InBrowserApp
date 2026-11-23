Abra um arquivo 7z, RAR, ZIP ou TAR para navegar pelas pastas antes de extrair o conteúdo. Selecione um arquivo para pré-visualizá-lo ou baixá-lo separadamente.

## Quando usar

Use quando receber um pacote compactado e quiser dar uma olhada rápida sem descompactar todo o arquivo. Ele é útil para verificar pacotes de versão, modelos baixados, pacotes de registros, instantâneos de código-fonte ou um anexo `.gz` de arquivo único.

## Privacidade e manuseio de arquivos

O conteúdo do arquivo compactado é lido localmente na sessão do navegador. O arquivo não é enviado para InBrowser.App. Entradas de texto grandes são limitadas na pré-visualização para manter a página responsiva; baixe a entrada quando precisar inspecionar o arquivo completo.

## Formatos de arquivo suportados

O visualizador abre arquivos ZIP, 7z, RAR4 e RAR5, TAR, CPIO, AR (incluindo pacotes `.deb`), CAB, ISO 9660 e LHA. Ele também abre arquivos individuais e pacotes TAR compactados com GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA ou UNIX compress (`.Z`). Por exemplo, abra um pacote de distribuição `.tar.zst` para navegar pelas pastas ou um log `.zst` para baixar o arquivo descompactado.

Use um aplicativo de desktop para extrair arquivos criptografados, arquivos divididos em partes, arquivos RAR4 sólidos ou entradas com mais de 512 MiB nos formatos recém-adicionados. Arquivos sólidos grandes podem demorar mais para abrir ou extrair porque o visualizador pode precisar processar as entradas anteriores.

## Comportamento da pré-visualização

Arquivos semelhantes a texto, como JSON, Markdown, registros, código-fonte, CSV, XML, YAML e TOML, podem ser pré-visualizados com destaque de sintaxe quando houver uma linguagem correspondente disponível. Arquivos de imagem comuns podem ser pré-visualizados visualmente, e documentos PDF abrem no visualizador de PDF integrado do navegador quando disponível. Outros arquivos binários continuam disponíveis para baixar, mas a ferramenta não tentará renderizá-los.
