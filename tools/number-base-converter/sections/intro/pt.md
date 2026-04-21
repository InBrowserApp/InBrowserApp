Converta números inteiros entre binário, octal, decimal, hexadecimal, Base32, Base36, Base62, Base64 e bases personalizadas de 2 a 64 diretamente no navegador. Tudo é calculado localmente com BigInt, então você pode inspecionar valores grandes sem enviá-los a um servidor.

## Quando usar

Use esta ferramenta quando o mesmo inteiro aparecer em logs, protocolos, IDs ou especificações com alfabetos diferentes. Ao editar qualquer campo, os outros são recalculados imediatamente, o que ajuda em depuração, documentação e conferência manual.

## Diferenças entre as bases

Até a base 36, letras são aceitas sem diferenciar maiúsculas de minúsculas. Bases maiores tratam maiúsculas e minúsculas como dígitos diferentes, e a linha Base64 usa o alfabeto numérico `A-Z a-z 0-9 + /`, não a codificação Base64 textual orientada a bytes.

## Pontos de atenção

Somente inteiros não negativos são suportados. Zeros à esquerda são tratados como formatação, então a saída convertida é normalizada e pode perder o preenchimento que você digitou.
