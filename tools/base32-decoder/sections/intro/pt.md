## O que é Base32?

Base32 é útil quando um canal somente de texto ou que não diferencia maiúsculas de minúsculas precisa transportar dados binários, como segredos OTP, tokens seguros para DNS ou valores de configuração exportados. É uma camada de codificação, não uma camada de segurança.

## Quando usar

- Decodificar segredos ou tokens Base32 de volta para seus bytes originais.
- Inspecionar valores copiados da configuração de TOTP, de exportações de integração ou de arquivos de configuração.
- Verificar se os dados Base32 colados têm caracteres válidos e padding correto antes do uso.

## O que ter em mente

- Base32 aumenta o tamanho mais do que Base64.
- Ele não criptografa nem oculta o valor original.
- Alguns sistemas omitem o padding `=`, mas caracteres inválidos ainda causam erros de decodificação.
