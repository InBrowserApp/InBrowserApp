## O que é BLAKE3?

BLAKE3 é uma função hash criptográfica moderna derivada do BLAKE2. Ela foi projetada para desempenho muito alto e paralelismo mantendo segurança robusta. Produz um hash padrão de 256 bits e suporta comprimento de saída extensível (XOF).

**Principais características:**

- **Comprimento de saída extensível**: Pode produzir hashes de qualquer comprimento
- **Alto desempenho**: Rápida e paralelizável em CPUs modernas
- **Determinístico**: A mesma entrada sempre produz o mesmo hash
- **Efeito avalanche**: Pequenas mudanças na entrada produzem saídas drasticamente diferentes
- **Irreversível**: Computacionalmente inviável reverter o hash para encontrar a entrada original
- **Resistente a colisões**: Muito difícil encontrar duas entradas diferentes que produzam o mesmo hash
- **Hash com chave**: Suporta uma chave opcional de 32 bytes para funcionalidade MAC
- **Derivação de chaves**: Pode derivar subchaves a partir de material de chave e contexto

**Usos comuns:**

- Verificação de integridade de arquivos
- Armazenamento endereçado por conteúdo e deduplicação
- Assinaturas digitais e certificados
- Armazenamento e autenticação de senhas
- Protocolos e sistemas criptográficos
