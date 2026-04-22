## O que é HMAC?

HMAC (Código de Autenticação de Mensagem baseado em Hash) é um mecanismo criptográfico que combina uma chave secreta com uma função hash para verificar tanto a integridade quanto a autenticidade de uma mensagem.

**Como funciona:**

1. A chave secreta é combinada com a mensagem
2. Uma função hash (como SHA-256) processa os dados combinados
3. O resultado é um código de autenticação de tamanho fixo

**Casos de uso comuns:**

- **Autenticação de API**: Assinatura de solicitações de API para verificar o remetente
- **Tokens JWT**: Usado em algoritmos HS256/HS384/HS512
- **Verificação de Mensagem**: Garantir que os dados não foram adulterados
- **Assinaturas de Webhook**: Validação de payloads de webhook

**Notas de segurança:**

- Sempre use uma chave secreta forte e aleatória
- Mantenha sua chave secreta confidencial
- SHA-256 ou superior é recomendado para novas aplicações
- SHA-1 é considerado fraco e deve ser evitado para usos críticos de segurança
