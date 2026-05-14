## O que é um assinador de JWT?

Um assinador de JWT cria um JSON Web Token compacto serializando um cabeçalho e um payload, depois assinando-os com um segredo ou chave privada. O resultado é o token de três partes `header.payload.signature` usado por muitos sistemas de API, OAuth e sessões.

## Quando usar esta ferramenta

- Crie tokens de teste locais para desenvolvimento de API, ambientes de staging e demos.
- Compare como diferentes algoritmos alteram o cabeçalho e a assinatura do token.
- Adicione claims como `sub`, `iss`, `aud`, `exp`, `iat`, `scope` ou campos personalizados da aplicação sem escrever um script descartável.
- Gere tokens com segredos compartilhados HMAC ou com chaves privadas RSA/ECDSA no formato PKCS#8 PEM ou JWK.

## O que verificar antes de usar um token assinado

- Combine o algoritmo com o tipo de chave: `HS*` usa um segredo compartilhado, `RS*` e `PS*` usam chaves privadas RSA, e `ES*` usa chaves privadas EC.
- Adicione claims de expiração e audiência quando o serviço receptor as espera.
- Mantenha chaves privadas de produção fora de navegadores e máquinas compartilhados. Esta ferramenta roda localmente, mas não consegue proteger chaves de um dispositivo já comprometido.
- Lembre-se de que assinatura não é criptografia. Qualquer pessoa que receba o token pode decodificar o cabeçalho e o payload.
