## O que é SHA-1?

SHA-1 (Secure Hash Algorithm 1) é uma função hash criptográfica que produz um valor hash de 160 bits (20 bytes), tipicamente renderizado como um número hexadecimal de 40 caracteres. Foi projetado pela NSA e publicado pelo NIST em 1995 como parte do Padrão de Assinatura Digital.

**Características principais:**

- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Computação rápida**: Rápido de calcular para qualquer entrada dada
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Irreversível**: Computacionalmente inviável reverter o hash para encontrar a entrada original
- **Vulnerável a colisões**: Vulnerabilidades conhecidas tornam possível encontrar colisões

**Status de segurança:**
⚠️ **SHA-1 está criptograficamente quebrado e não deve ser usado para aplicações críticas de segurança**. Ataques teóricos foram demonstrados em 2005, e ataques práticos de colisão foram alcançados em 2017.

**Usos comuns (históricos):**

- Assinaturas digitais e certificados (obsoleto)
- Sistema de controle de versão Git (para compatibilidade)
- Sistemas legados que requerem SHA-1
- Verificação de integridade de arquivos (não crítico para segurança)
- Algoritmos de prova de trabalho (algumas criptomoedas mais antigas)

**Alternativas recomendadas:**

- SHA-256 ou SHA-3 para novas aplicações
- SHA-512 para requisitos de alta segurança
