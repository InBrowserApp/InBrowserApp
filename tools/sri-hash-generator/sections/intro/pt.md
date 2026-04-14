## O que é Integridade de Sub-recursos (SRI)?

Integridade de Sub-recursos (SRI) é um recurso de segurança que permite aos navegadores verificar se os arquivos que eles buscam (por exemplo, de um CDN) não foram modificados inesperadamente. Funciona comparando o hash criptográfico de um recurso com um hash fornecido no HTML.

**Como funciona:**

1. Gerar um hash criptográfico do seu arquivo de recurso
2. Incluir o hash no atributo integrity das tags script ou link
3. Navegador busca o recurso e calcula seu hash
4. Navegador compara o hash calculado com o hash fornecido
5. Se os hashes coincidirem, o recurso carrega; se não, o carregamento é bloqueado

**Benefícios:**

- **Segurança**: Protege contra modificações maliciosas de recursos de terceiros
- **Proteção CDN**: Garante que arquivos servidos por CDN não foram alterados
- **Segurança da cadeia de fornecimento**: Valida a integridade de dependências externas
- **Suporte do navegador**: Amplamente suportado em navegadores modernos

**Algoritmos suportados:**

- SHA-256 (mínimo recomendado)
- SHA-384 (recomendado)
- SHA-512 (máxima segurança)
