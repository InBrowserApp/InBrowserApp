## O que é a conversão JWK ↔ PEM?

JWK (JSON Web Key) é um formato JSON para chaves criptográficas usado em sistemas JOSE/JWT. Ele pode representar chaves RSA, EC ou OKP e pode aparecer em um JWK Set (JWKS).

PEM é uma chave ASN.1/DER codificada em Base64 com cabeçalhos como BEGIN PUBLIC KEY ou BEGIN PRIVATE KEY, comum em TLS, OpenSSL e muitos SDKs.

Esta ferramenta converte chaves em ambos os sentidos, preservando o material da chave ao escolher saída pública (SPKI) ou privada (PKCS8). Suporta RSA, EC (P-256/384/521) e OKP (Ed25519/X25519/Ed448/X448), e tudo roda localmente no navegador.

Escolha JWK → PEM quando uma biblioteca, gateway ou CLI esperar arquivos de chave no estilo OpenSSL. Escolha PEM → JWK quando precisar colocar uma chave em um JWKS, passá-la por configuração baseada em JSON ou usá-la em ambientes de navegador ou serverless. A conversão de chave privada preserva o material privado, então compartilhe apenas a saída pública quando isso for suficiente.

- Use uma chave JWK/JWKS em sistemas que aceitam apenas PEM.
- Exporte chaves PEM para bibliotecas JWT, gateways de API ou distribuição de chaves.
- Compartilhe chaves públicas com segurança sem expor dados da chave privada.
