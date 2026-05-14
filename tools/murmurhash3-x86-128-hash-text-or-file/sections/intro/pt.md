## O que é MurmurHash3 (x86 128-bit)?

MurmurHash3 é um algoritmo de hash não criptográfico rápido, projetado para
somas de verificação repetíveis e bem distribuídas. A variante x86 128-bit
retorna um valor de 16 bytes, normalmente exibido como 32 caracteres
hexadecimais, o que a torna mais adequada do que hashes de 32 bits quando você
precisa de um identificador mais amplo para grandes conjuntos de registros,
arquivos ou chaves de cache.

**Onde ele ajuda:**

- **Tabelas hash e particionamento**: Crie chaves estáveis para buckets,
  partições ou tabelas de consulta.
- **Deduplicação**: Compare grandes conjuntos de texto ou arquivos com
  impressões digitais compactas de 128 bits antes de fazer verificações mais
  profundas.
- **Chaves de cache**: Produza identificadores determinísticos para artefatos
  de compilação, dados transformados ou conteúdo gerado.
- **Verificações de integridade sem segurança**: Detecte alterações acidentais
  durante o armazenamento ou a transferência quando garantias criptográficas
  não forem necessárias.

**Comportamento da semente:**

A semente opcional é um valor inteiro sem sinal de 32 bits. Use a mesma
semente quando precisar que os resultados correspondam aos de outro sistema, e
deixe-a em `0` quando não houver um requisito específico de compatibilidade.
Valores decimais e valores hexadecimais `0x` são aceitos; valores maiores são
ajustados ao mesmo intervalo de 32 bits usado pelo algoritmo.

**Notas de segurança:**

MurmurHash3 não é um algoritmo para hash de senhas, assinatura ou verificação
resistente a adulteração. Use SHA-256, HMAC ou uma ferramenta de hash de senhas
quando a saída precisar de propriedades de segurança. Esta ferramenta é mais
adequada para hashing local, sem conexão e orientado a desempenho, quando
velocidade e distribuição estável importam mais do que resistência a ataques.
