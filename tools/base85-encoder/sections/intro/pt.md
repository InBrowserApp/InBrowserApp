## O que é Base85?

Base85 é uma codificação de binário para texto que transforma 4 bytes em 5 caracteres imprimíveis. Ela é mais compacta que Base64, e esta ferramenta permite escolher entre ASCII85 e Z85 conforme o formato esperado pelo destino.

## Quando usar

- Para codificar bytes, texto ou arquivos em canais apenas de texto mantendo uma saída relativamente compacta.
- Use ASCII85 quando precisar de um formato Base85 flexível que aceite bytes finais parciais.
- Use Z85 quando precisar de texto Base85 compatível com ZeroMQ e o comprimento de entrada for múltiplo exato de 4 bytes.

## O que ter em mente

- Base85 é um formato de codificação, não de criptografia.
- ASCII85 e Z85 usam alfabetos diferentes, portanto não são intercambiáveis.
- Z85 rejeita dados cujo tamanho em bytes não seja divisível por 4, enquanto ASCII85 consegue codificar blocos finais parciais.
