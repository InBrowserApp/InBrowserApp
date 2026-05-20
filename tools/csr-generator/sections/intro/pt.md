## O que é um CSR?

Uma Certificate Signing Request (CSR) é um pequeno documento PKCS#10 que uma autoridade certificadora (CA) precisa para emitir um certificado TLS ou de assinatura de código. Ele reúne a metade pública de um par de chaves, a identidade que você deseja que a CA ateste (o Sujeito) e quaisquer identificadores adicionais, como nomes DNS ou endereços IP (os Subject Alternative Names, ou SAN), tudo assinado pela chave privada correspondente.

Esta ferramenta constrói o CSR inteiramente no seu navegador usando a Web Crypto API e [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Nenhuma informação sobre sua chave ou solicitação é enviada a um servidor.

## Quando usar esta ferramenta

- Solicitar um certificado TLS de uma CA pública (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, etc.) quando o fluxo de trabalho delas pede que você cole seu próprio CSR.
- Gerar um CSR para uma autoridade certificadora interna — baseada em ACME, smallstep, EJBCA, AD CS — sem confiar em um formulário hospedado externamente.
- Reemitir um certificado com a mesma chave privada, importando uma chave PEM PKCS#8 existente e assinando apenas um novo CSR.

## Como preencher o formulário

- **Origem da chave** — escolha *Gerar nova* para criar um novo par de chaves, ou *Importar existente* para colar uma chave PEM PKCS#8 não criptografada. Chaves criptografadas, blocos legados `RSA PRIVATE KEY` e `EC PRIVATE KEY` não são aceitos; converta-os com `openssl pkcs8 -topk8 -nocrypt` primeiro.
- **Algoritmo** — RSA oferece a compatibilidade mais ampla por padrão. ECDSA produz assinaturas menores e tem amplo suporte em CAs modernas e clientes TLS.
- **Sujeito** — a maioria das CAs públicas ignora tudo exceto o Common Name e trata a lista DNS SAN como autoritativa, mas CAs privadas ainda podem precisar de um DN completo.
- **Entradas SAN** — liste os hostnames, IPs, endereços de e-mail ou URIs que você deseja que o certificado cubra. Um por linha ou separados por vírgula.

## O que ter em mente

- A chave privada exibida ao lado do CSR é gerada localmente e nunca sai do seu navegador. Salve-a antes de fechar a aba — sem a chave privada correspondente, o certificado assinado é inutilizável.
- CAs públicas exigem que o Common Name (ou pelo menos uma entrada SAN) seja um nome DNS que elas possam validar. SANs de endereço IP são úteis principalmente para certificados internos.
- A chave privada gerada não é criptografada. Adicione uma senha com `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` se necessário antes de armazená-la.
- Apenas RSA (2048/3072/4096) e ECDSA (P-256/P-384/P-521) são suportados. EdDSA foi intencionalmente omitido porque a aceitação em navegadores e CAs ainda é inconsistente.
