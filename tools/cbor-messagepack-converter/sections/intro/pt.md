## Inspecione dados binários de APIs

CBOR e MessagePack são formatos compactos de serialização binária para dados estruturados. Use este conversor para inspecionar respostas de APIs, mensagens WebSocket ou valores em cache como JSON, ou para criar dados binários a partir de JSON para depuração. Todo o processamento acontece no navegador; as entradas não são enviadas nem salvas.

## Codifique JSON ou decodifique bytes

Escolha o formato binário e a direção da conversão. Para codificar, insira JSON e escolha Hex, Base64 ou Base64URL para a saída. Para decodificar, cole os bytes e selecione a codificação de entrada. Alterar a codificação de entrada reinterpreta o texto que já está no editor.

Abra um arquivo JSON ao codificar ou um arquivo binário bruto `.cbor`, `.msgpack` ou `.bin` ao decodificar. Textos codificados, como Hex ou Base64, devem ser colados no editor. Converta e depois copie o texto exibido ou baixe o resultado. Os downloads binários contêm os bytes reais e podem ser importados novamente.

## Preserve os valores e entenda os limites

Os literais inteiros preservam todos os dígitos dentro do intervalo de 64 bits compatível com o formato. Valores que JSON não pode representar, como campos binários, tags CBOR e extensões MessagePack, aparecem como wrappers tipados explícitos. Ative JSON estendido para codificar esses wrappers de volta para binário; deixe-o desativado para objetos JSON comuns que usem chaves de wrapper.

Por exemplo, com JSON estendido ativado, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` codifica um inteiro exato e dois bytes binários.

Cada conversão processa um valor, com limite de entrada de 1 MiB. Bytes do JSON formatado conta o JSON formatado exibido, não a entrada original. A recodificação preserva os valores compatíveis, mas pode alterar a ordem dos mapas ou a escolha da codificação binária. Abra “Formatos e preservação de tipos” acima para consultar a sintaxe dos wrappers e os tipos incompatíveis.
