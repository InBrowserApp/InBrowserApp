## O que é Base64?

O Base64 é útil quando um canal baseado em texto precisa transportar cargas binárias, como corpos de e-mail, blobs JSON ou pequenas data URLs. É uma camada de codificação, não uma camada de segurança.

## Quando usar

- Depuração rápida quando uma API retorna ou espera strings Base64.
- Conversão de texto do navegador em um formato de transporte seguro para logs ou cargas úteis.
- Verificar se um blob Base64 colado decodifica para o conteúdo esperado.

## O que ter em mente

- O Base64 aumenta o tamanho em cerca de um terço.
- Ele não criptografa nem oculta o valor original.
- Preenchimento inválido ou copiar e colar quebrado geralmente aparecem como erro de decodificação.
