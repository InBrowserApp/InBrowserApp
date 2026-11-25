## Abrir um APK e ler o manifesto

Solte um arquivo `.apk` do Android ou escolha **Abrir APK ou manifesto**. O visualizador abre o `AndroidManifest.xml` incluído no APK, mesmo quando ele está no formato XML binário compilado usado pela maioria dos APKs. Você também pode abrir um manifesto já extraído em formato binário ou de texto. Experimente o APK de exemplo para explorar a visão geral e o XML decodificado. Seus arquivos ficam no navegador.

## Entender os campos de pacote, versão e SDK

O **Nome do pacote** identifica o app Android. O nome da versão é o rótulo exibido aos usuários. O código da versão é o número que o Android usa para ordenar as atualizações. O SDK mínimo indica o nível de API mais antigo do Android declarado no manifesto, e o SDK de destino indica o nível para o qual o app foi projetado. Os campos ausentes do manifesto aparecem como não especificados.

## Inspecionar permissões e exportar AndroidManifest.xml

A visão geral lista os nomes das permissões declaradas pelo pacote. No dispositivo, o Android determina quais permissões são concedidas com base na versão do sistema, nas configurações do app e nas escolhas do usuário. Abra **XML do manifesto** para consultar componentes, filtros de intent e declarações condicionais de permissões. Use **Copiar XML** ou **Baixar XML** para guardar o arquivo decodificado. Referências a recursos compilados podem aparecer como IDs, por exemplo `@0x7f010001`.

[Estrutura e elementos do manifesto do Android](https://developer.android.com/guide/topics/manifest/manifest-intro)
