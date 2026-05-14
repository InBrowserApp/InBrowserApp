## O que é HighwayHash?

HighwayHash é uma função de hash rápida com chave, criada pelo Google para fingerprinting de alto desempenho e verificações de integridade. Ela usa uma chave de 256 bits e pode produzir saída de 64 bits, 128 bits ou 256 bits a partir da mesma entrada de texto ou arquivo.

## Quando usar

- Criar somas de verificação determinísticas com chave para chaves de cache, IDs de objeto, particionamento ou tabelas internas de consulta.
- Comparar arquivos ou payloads de texto com a mesma chave quando a velocidade importa mais do que ampla compatibilidade criptográfica.
- Gerar fingerprints de 128 bits ou 256 bits quando um hash maior, que não seja de senha, for útil para fluxos de trabalho de integridade.

## Opções de chave e saída

Insira a chave como exatamente 32 bytes de dados hexadecimais, como `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. O prefixo `0x` é opcional, e a ferramenta aceita espaços, dois-pontos, hifens e sublinhados para facilitar a leitura de chaves longas. Deixar a chave em branco usa a chave padrão da biblioteca, o que é conveniente para verificações rápidas, mas não deve ser tratado como segredo.

## Observações de segurança

HighwayHash não substitui HMAC, assinaturas digitais nem hash de senhas. Use-o para fingerprints rápidos com chave e fluxos de trabalho de soma de verificação, não para comprovar autenticidade entre sistemas que precisam de verificação criptográfica padrão.
