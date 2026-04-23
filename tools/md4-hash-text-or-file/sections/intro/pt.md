## O que é MD4?

MD4 (Message Digest Algorithm 4) é uma função hash criptográfica amplamente utilizada que produz um valor hash de 128 bits (16 bytes), tipicamente representado como um número hexadecimal de 32 caracteres. Foi projetado por Ron Rivest em 1990.

**Características principais:**

- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Computação rápida**: Rápido de calcular para qualquer entrada dada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Tamanho de saída fixo**: Sempre produz um hash de 128 bits independentemente do tamanho da entrada
- **Vulnerável a colisões**: Vulnerabilidades conhecidas tornam possível encontrar colisões

**Status de segurança:**
⚠️ **MD4 está criptograficamente quebrado e não deve ser usado para aplicações críticas de segurança**. Ataques de colisão foram demonstrados em 1995, e a geração prática de colisões tornou-se viável com o poder computacional moderno.

**Usos comuns (atuais e históricos):**

- Verificação de integridade de arquivos (não crítico para segurança)
- Checksums para detecção de corrupção de dados
- Sistemas legados que requerem MD4
- Geração de chaves de banco de dados (não criptográfico)
- Alguns protocolos e sistemas mais antigos

**Alternativas recomendadas:**

- SHA-256 ou SHA-3 para novas aplicações
- SHA-512 para requisitos de alta segurança
- BLAKE2 para aplicações de alto desempenho
