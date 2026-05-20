Gere identificadores UUID v5 a partir de um UUID de namespace e um nome sem enviar nenhum dos valores a um servidor. UUID v5 é útil quando você precisa de um identificador estável que possa ser recriado depois a partir da mesma entrada, como um ID para um nome de domínio, URL, caminho de objeto, identificador de conta ou registro de fixture.

## Como UUID v5 Funciona

UUID v5 combina um UUID de namespace com uma string de nome, aplica SHA-1 a esses bytes e, em seguida, aplica os bits de versão e variante do RFC 4122. Como a entrada é determinística, `example.com` dentro do namespace DNS sempre produz o mesmo UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Escolhendo Um Namespace

Use `ns:DNS` para nomes de domínio, `ns:URL` para URLs, `ns:OID` para identificadores de objeto e `ns:X.500 DN` para nomes distintos X.500. Você também pode colar seu próprio namespace UUID quando sua aplicação precisar de identificadores com escopo para um produto, tenant, conjunto de dados ou migração.

## Quando Usar

Escolha UUID v5 quando a reprodutibilidade for mais importante que a aleatoriedade. Ele é uma boa opção para importações determinísticas, fixtures de teste, registros com namespace e sistemas que precisam que o mesmo item lógico receba o mesmo ID entre execuções. Para tokens secretos ou IDs públicos imprevisíveis, use um gerador aleatório.
