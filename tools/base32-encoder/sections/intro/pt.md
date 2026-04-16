## O que é Base32?

Base32 é útil quando um canal somente de texto ou que não diferencia maiúsculas de minúsculas precisa transportar dados binários, como segredos OTP, tokens seguros para DNS ou valores de configuração exportados. É uma camada de codificação, não uma camada de segurança.

## Quando usar

- Codificar bytes, texto ou arquivos em Base32 antes de enviá-los por canais somente de texto.
- Preparar segredos OTP, configurações exportadas ou blobs binários para sistemas que esperam entrada Base32.
- Converter bytes brutos de arquivos em uma string fácil de copiar para transporte, logs ou entrada manual.

## O que ter em mente

- Base32 aumenta o tamanho mais do que Base64.
- Ele não criptografa nem oculta o valor original.
- Alguns sistemas exigem padding `=`, enquanto outros aceitam saída sem padding, então vale seguir o que o destinatário espera.
