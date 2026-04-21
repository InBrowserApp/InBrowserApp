## O que é xxHash (XXH64)?

xxHash é um algoritmo de hash não criptográfico extremamente rápido que foca em velocidade e performance mantendo boas propriedades de distribuição. XXH64 é a variante de 64 bits que produz um valor hash de 64 bits (8 bytes), tipicamente exibido como número hexadecimal de 16 caracteres.

**Características principais:**

- **Extremamente rápido**: Otimizado para velocidade, muito mais rápido que funções hash criptográficas
- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Boa distribuição**: Fornece excelente distribuição de hash para tabelas hash
- **Não criptográfico**: Não adequado para propósitos de segurança, projetado para performance
- **Saída maior**: Hash de 64 bits fornece melhor resistência a colisões que variantes de 32 bits
- **Otimizado para plataforma**: Usa instruções SIMD quando disponíveis para velocidade máxima

**Usos comuns:**

- Tabelas hash e estruturas de dados
- Verificações de integridade de arquivos (não-segurança)
- Deduplicação de dados
- Checksums para transmissão de dados
- Aplicações críticas de performance
- Indexação de banco de dados
- Geração de chaves de cache
