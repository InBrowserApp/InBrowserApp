## O que é a conversão JWK ↔ PEM?

JWK (JSON Web Key) é material de chave em formato JSON usado por JOSE/JWT, endpoints JWKS e configurações serverless ou de navegador. É fácil para software ler, mas menos aceito por CLIs e infraestrutura que esperam arquivos de chave.

PEM envolve dados de chave DER com rótulos BEGIN/END, o formato que OpenSSL, ferramentas TLS, gateways de API e muitos SDKs normalmente solicitam.

Este conversor conecta esses formatos localmente no seu navegador. Ele lida com contêineres de chave RSA, EC (P-256/384/521) e OKP, permite escolher PEM público SPKI ou privado PKCS8 ao partir de JWK, e pode transformar blocos PEM suportados de volta em JWK JSON formatado ou compacto.

Use saída pública quando você só precisa de verificação ou distribuição. Conversões privadas expõem material de chave privada na tela e em downloads, então trate o resultado como um segredo e feche a aba ao terminar.

- Mova chaves entre configuração JWKS/JSON e arquivos PEM no estilo OpenSSL.
- Extraia uma chave pública antes de compartilhá-la com verificadores JWT, gateways ou clientes.
- Converta localmente sem enviar material de chave para um servidor.
