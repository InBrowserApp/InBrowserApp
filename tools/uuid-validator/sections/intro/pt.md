## O que é um validador de UUID?

Um validador de UUID verifica se um identificador está escrito no formato UUID padrão de 36 caracteres, como `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Ele é útil quando você precisa verificar IDs copiados de logs, APIs, bancos de dados, fixtures de teste ou entradas de usuários antes de confiar neles no código.

### Entrada compatível

Esta ferramenta valida texto UUID canônico com cinco grupos hexadecimais no layout `8-4-4-4-12`. Letras maiúsculas são aceitas e normalizadas para minúsculas. O UUID nil (`00000000-0000-0000-0000-000000000000`) e o UUID max (`ffffffff-ffff-ffff-ffff-ffffffffffff`) são tratados como valores especiais válidos.

### Detalhes da validação

Para UUIDs padrão, o validador verifica o nibble da versão e os bits da variante. As versões de 1 a 8 são reconhecidas, abrangendo UUIDs legados da RFC 4122 e layouts mais recentes da RFC 9562, como UUID v6, v7 e v8. O painel de resultados também divide o UUID em seus cinco segmentos para que você possa inspecionar os bytes exatos que estão sendo validados.

### Privacidade

A validação é executada inteiramente no seu navegador. O UUID que você cola não é enviado, portanto a ferramenta é segura para uso com identificadores internos, chaves de banco de dados e amostras de logs de produção que devem permanecer locais.
