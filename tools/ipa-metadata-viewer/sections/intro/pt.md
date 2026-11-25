## Abrir um IPA e ler os metadados do app principal

Solte um arquivo `.ipa` do iOS ou escolha **Abrir arquivo IPA**. O visualizador lê a lista de propriedades do app principal em um caminho como `Payload/Trail Notes.app/Info.plist`. Use o IPA de exemplo para conhecer os campos antes de abrir seu próprio arquivo. A extração do pacote e a leitura da lista de propriedades acontecem no navegador.

## Entender o ID do pacote, as versões e as plataformas

O ID do pacote, armazenado em `CFBundleIdentifier`, identifica o pacote do app. `CFBundleShortVersionString` indica a versão de lançamento, e `CFBundleVersion` identifica a compilação. Consulte `MinimumOSVersion` e `CFBundleSupportedPlatforms` para ver a versão mínima do sistema e os nomes das plataformas registrados no pacote. O nome de exibição vem de `CFBundleDisplayName` ou `CFBundleName`.

## Inspecionar e exportar Info.plist

Selecione **Info.plist** para ver a lista de propriedades completa em XML legível, incluindo as chaves que não aparecem na visão geral. O visualizador lê listas de propriedades binárias e XML. Escolha **Copiar XML** para usar a versão legível em outra ferramenta ou **Baixar Info.plist** para salvar o arquivo original sem alterações. O caminho exibido no pacote mostra de qual app vieram os metadados.

[Referência da Apple sobre listas de propriedades de informações](https://developer.apple.com/documentation/bundleresources/information-property-list)
