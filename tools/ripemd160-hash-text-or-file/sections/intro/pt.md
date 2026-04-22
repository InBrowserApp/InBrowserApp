## O que é RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) é uma função hash criptográfica que produz um valor hash de 160 bits (20 bytes), tipicamente representado como um número hexadecimal de 40 caracteres. Foi desenvolvido em 1996 por Hans Dobbertin, Antoon Bosselaers e Bart Preneel como parte do projeto europeu RACE.

**Características principais:**

- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Computação rápida**: Razoavelmente rápido de calcular para qualquer entrada dada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Tamanho de saída fixo**: Sempre produz um hash de 160 bits independentemente do tamanho da entrada
- **Estrutura paralela de duas linhas**: Usa duas linhas de computação paralelas para segurança aprimorada

**Status de segurança:**
✅ **RIPEMD-160 é considerado criptograficamente seguro** sem ataques práticos conhecidos. Fornece uma boa margem de segurança e ainda é recomendado para aplicações criptográficas onde um hash de 160 bits é suficiente.

**Usos comuns:**

- Geração de endereços Bitcoin (codificação Base58Check)
- Assinaturas digitais e certificados
- Verificação de integridade de dados
- Protocolos criptográficos que requerem hashes de 160 bits
- Alternativa ao SHA-1 quando necessário

**Comparação com outros algoritmos:**

- Mais seguro que MD5 e SHA-1
- Saída menor que SHA-256 (160 bits vs 256 bits)
- Boas características de desempenho
- Bem estudado e confiável na comunidade criptográfica

**Recomendado para:**

- Aplicações que requerem segurança de hash de 160 bits
- Operações criptográficas relacionadas ao Bitcoin
- Compatibilidade com sistemas legados onde RIPEMD-160 é especificado
