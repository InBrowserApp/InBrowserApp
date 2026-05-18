## O que esta ferramenta converte

Este conversor trata um UUID como o valor de 128 bits que ele realmente é e
mantém as representações comuns sincronizadas. Cole um UUID, valor Base64,
string hexadecimal, inteiro decimal, valor octal ou valor binário, e os outros
formatos serão atualizados localmente no seu navegador.

## Como ler os formatos

O campo UUID mostra a forma canônica com hifens. Hexadecimal são os mesmos 16
bytes como 32 dígitos hexadecimais minúsculos. Base64 é o Base64 padrão com
preenchimento para os 16 bytes brutos, não Base64 para os caracteres de texto
do UUID. Decimal, octal e binário mostram o UUID como um inteiro sem sinal de
128 bits; a saída binária é preenchida à esquerda até todos os 128 bits para
que os zeros iniciais continuem visíveis.

## O que observar

Valores fora do intervalo UUID de 128 bits são rejeitados. A entrada Base64
deve decodificar para exatamente 16 bytes. O conversor aceita variantes comuns
coladas, como UUIDs em maiúsculas, prefixos `urn:uuid:`, chaves, UUIDs
compactos de 32 hexadecimais, espaços ao redor de valores numéricos longos e
Base64 seguro para URL. Nada é enviado enquanto você converte ou gera o UUID de
exemplo.
