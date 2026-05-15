# Gerador de CSR

Uma Certificate Signing Request (CSR) é uma mensagem PKCS#10 que contém sua chave pública, campos de Subject de identificação, extensões opcionais como Subject Alternative Names e uma assinatura feita com a chave privada correspondente. Autoridades certificadoras usam a CSR para emitir um certificado X.509 sem jamais receber sua chave privada.

Este gerador cria CSRs diretamente no seu navegador. Você pode gerar um novo par de chaves RSA ou ECDSA, ou importar uma chave privada PEM existente sem criptografia quando precisar renovar um certificado para uma chave que já está implantada.

## Quando usar

Use uma CSR quando precisar que uma autoridade certificadora emita ou renove um certificado TLS, S/MIME, de autenticação de cliente ou de serviço interno. A CSR comprova a posse da chave privada e carrega as informações de identidade pública que devem aparecer no certificado.

Para certificados TLS públicos, coloque nomes de host em Subject Alternative Names. O Common Name ainda é útil para legibilidade e sistemas legados, mas clientes modernos validam nomes DNS e endereços IP a partir de SAN.

## Como gerar uma CSR

Escolha se deseja gerar uma chave nova ou importar uma chave privada existente. Preencha os campos de Subject relevantes para sua solicitação de certificado e adicione entradas SAN para nomes DNS, endereços IP, endereços de email ou URIs. Gere a CSR e envie somente a CSR PEM para sua autoridade certificadora.

Se esta ferramenta gerar uma nova chave, baixe e armazene a chave privada antes de sair da página. Se você importar uma chave, a ferramenta gerará apenas a CSR e não reexportará a chave privada importada.

## Observações sobre chaves e formatos

RSA de 2048 bits é amplamente compatível; 3072 ou 4096 bits podem ser preferíveis para certificados internos de vida útil mais longa. ECDSA P-256 é compacta e amplamente aceita, enquanto P-384 ou P-521 podem ser exigidas por políticas mais rígidas. O fluxo de chave importada é compatível com blocos PEM PKCS#8 sem criptografia, RSA PRIVATE KEY e EC PRIVATE KEY.

Chaves privadas são sensíveis. Não as cole em sites não confiáveis, não as envie para autoridades certificadoras e não as inclua no controle de versão. Esta ferramenta é executada localmente no navegador, mas seu processo operacional ainda precisa de armazenamento e rotação de chaves seguros.
