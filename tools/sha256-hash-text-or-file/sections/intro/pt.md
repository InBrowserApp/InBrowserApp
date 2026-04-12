## O que é SHA-256?

SHA-256 (Secure Hash Algorithm 256-bit) é uma função hash criptográfica que produz um valor hash de 256 bits (32 bytes), tipicamente renderizado como um número hexadecimal de 64 caracteres. Faz parte da família de funções hash SHA-2 projetadas pela NSA e publicadas pelo NIST.

**Características principais:**

- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Computação rápida**: Rápido de calcular para qualquer entrada dada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Irreversível**: Computacionalmente inviável reverter o hash para encontrar a entrada original
- **Resistente a colisões**: Muito difícil encontrar duas entradas diferentes que produzam o mesmo hash

**Usos comuns:**

- Assinaturas digitais e certificados
- Blockchain e criptomoedas (Bitcoin usa SHA-256)
- Armazenamento de senhas (com salting apropriado)
- Verificação de integridade de arquivos
- Algoritmos de prova de trabalho
