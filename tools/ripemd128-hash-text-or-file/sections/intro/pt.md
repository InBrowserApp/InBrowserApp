## O que é RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) é uma função hash criptográfica que produz um valor de hash de 128 bits (16 bytes), normalmente representado como um número hexadecimal de 32 caracteres. Faz parte da família RIPEMD desenvolvida na Europa como alternativa ao MD4/MD5.

**Características principais:**

- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Computação rápida**: Rápido de calcular para qualquer entrada dada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Tamanho de saída fixo**: Sempre produz um hash de 128 bits independentemente do tamanho da entrada
- **Unidirecional**: É computacionalmente inviável recuperar a entrada original a partir do hash

**Usos comuns:**

- Verificação de integridade de dados
- Impressões digitais e deduplicação
- Compatibilidade com sistemas legados
