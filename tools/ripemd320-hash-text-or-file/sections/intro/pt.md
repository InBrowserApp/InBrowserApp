## O que é RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) é uma função hash criptográfica que produz um valor de hash de 320 bits (40 bytes), normalmente representado como um número hexadecimal de 80 caracteres. Faz parte da família RIPEMD desenvolvida na Europa como alternativa ao MD4/MD5.

Use esta ferramenta quando precisar calcular um hash RIPEMD-320 para texto colado, dados de configuração copiados ou um arquivo local. O cálculo é executado no seu navegador, portanto o conteúdo do arquivo não precisa ser enviado para um servidor.

**Características principais:**

- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Computação rápida**: Rápido de calcular para qualquer entrada dada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Tamanho de saída fixo**: Sempre produz um hash de 320 bits independentemente do tamanho da entrada
- **Unidirecional**: É computacionalmente inviável recuperar a entrada original a partir do hash

**Usos comuns:**

- Verificação de integridade de dados
- Impressões digitais e deduplicação
- Compatibilidade com sistemas legados

**Nota de segurança:**

RIPEMD-320 é útil principalmente quando um protocolo, arquivo, lista de somas de verificação ou sistema legado já o especifica. Para novos projetos sensíveis à segurança, prefira uma função hash atualmente padronizada, como SHA-256, SHA-512, SHA-3 ou BLAKE3, a menos que a compatibilidade com RIPEMD seja necessária.
