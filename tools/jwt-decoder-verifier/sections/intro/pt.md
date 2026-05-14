## O que é um decodificador e verificador de JWT?

Um JSON Web Token é uma string compacta com três segmentos base64url: um cabeçalho, um payload e uma assinatura. Esta ferramenta decodifica o cabeçalho e o payload no seu navegador para que você possa inspecionar a estrutura do token sem enviá-lo a um servidor.

A verificação de assinatura confere se o token foi assinado com a chave e o algoritmo esperados. Use um segredo compartilhado para tokens HS256, HS384 ou HS512. Use uma chave pública PEM, JWK ou JWKS para tokens RS, PS e ES.

## Quando usar

Use o decodificador ao depurar fluxos de autenticação, verificar claims OAuth ou OpenID Connect, comparar ambientes ou confirmar que um backend está emitindo os valores esperados de público, emissor, assunto, expiração e identificador de chave.

Use a verificação quando você tiver o segredo ou a chave pública correspondente e precisar confirmar que o cabeçalho, o payload e a assinatura ainda pertencem ao mesmo conjunto. A ferramenta também destaca `exp`, `nbf` e `iat`, para que problemas comuns de relógio e expiração fiquem visíveis imediatamente.

## Notas de segurança

Payloads de JWT são apenas codificados, não criptografados. Qualquer pessoa com o token pode ler suas claims, a menos que o token seja um JWE criptografado separado, que esta ferramenta não processa.

Não cole tokens de produção nem segredos privados em máquinas compartilhadas. A ferramenta é executada localmente no seu navegador e não armazena o token nem o material de verificação, mas o fluxo de trabalho mais seguro ainda é usar tokens de teste de curta duração e chaves públicas sempre que possível.
