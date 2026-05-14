## O que é o SipHash-128-2-4?

SipHash-128-2-4 é uma função de hash rápida com chave, projetada para mensagens curtas e proteção de tabelas de hash. Ela usa uma chave secreta de 128 bits e produz uma saída de 128 bits, geralmente exibida como um valor hexadecimal de 32 caracteres.

## Quando usar

- Proteger tabelas de hash no lado do servidor contra ataques de hash-flooding quando a chave permanece privada.
- Criar somas de verificação determinísticas com chave para chaves de cache, fragmentação ou tabelas internas de consulta.
- Comparar trechos de texto ou arquivos com a mesma chave quando autenticação criptográfica não for necessária.

## Formato da chave

Insira a chave como exatamente 16 bytes de dados hexadecimais, como `0x000102030405060708090a0b0c0d0e0f`. O prefixo `0x` é opcional, e a ferramenta aceita espaços, dois-pontos, hifens e sublinhados para facilitar a leitura de chaves longas.

## Observações de segurança

SipHash-128-2-4 não substitui HMAC, assinaturas digitais nem hash de senhas. Use-o para fluxos de trabalho de tabelas de hash e somas de verificação com chave, não para comprovar autenticidade entre sistemas que precisam de garantias de segurança criptográfica.
