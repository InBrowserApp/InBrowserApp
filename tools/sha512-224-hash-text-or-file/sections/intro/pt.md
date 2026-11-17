## O que é SHA-512/224 (FIPS 180-4)?

SHA-512/224 (FIPS 180-4) é uma função hash criptográfica da família SHA-2 que produz um resumo de 224 bits (28 bytes), geralmente representado como uma string hexadecimal de 56 caracteres. Baseia-se em SHA-512 com valores iniciais diferentes e uma saída truncada, fornecendo um resumo mais curto e mantendo a estrutura interna do SHA-512.

**Características principais:**

- **Determinística**: A mesma entrada sempre produz o mesmo hash
- **Cálculo rápido**: Rápida de calcular para qualquer entrada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Irreversível**: É computacionalmente inviável reverter o hash para encontrar a entrada original
- **Resistente a colisões**: É muito difícil encontrar duas entradas diferentes que produzam o mesmo hash

**Usos comuns:**

- Assinaturas digitais e certificados
- Verificações de integridade e somas de verificação
- Construções HMAC
- Verificação de arquivos e fluxos de processamento de dados
- Protocolos que exigem hashes de 224 bits
