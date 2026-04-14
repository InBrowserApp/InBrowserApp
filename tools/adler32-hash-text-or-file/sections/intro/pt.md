## O que é Adler-32?

Adler-32 é um algoritmo de checksum rápido que gera um valor de 32 bits (normalmente 8 caracteres hexadecimais). Ele foi feito para detectar erros acidentais, não para segurança criptográfica.

**Pontos-chave:**

- **Rápido e determinístico**: A mesma entrada sempre gera a mesma saída
- **Verificação de integridade**: Útil para detectar corrupção em transferência ou armazenamento
- **Não criptográfico**: Não use para senhas, assinaturas ou proteção contra adulteração

**Usos comuns:**

- Verificação de transferência de arquivos
- Verificação de pacotes/arquivos compactados
- Checagens leves de integridade
