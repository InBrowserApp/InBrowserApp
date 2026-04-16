## O que é Validação de Cartão de Crédito?

A validação de cartão de crédito é um processo para verificar se um número de cartão é potencialmente válido antes de processar uma transação. Usa o algoritmo de Luhn e identificação da bandeira para verificar o formato.

### Algoritmo de Luhn

O algoritmo de Luhn (também conhecido como Mod 10) é uma fórmula de soma de verificação usada para validar números de identificação. Veja como funciona:

1. Começando pelo dígito mais à direita, duplique cada segundo dígito
2. Se a duplicação resultar em um número maior que 9, subtraia 9 do resultado
3. Some todos os dígitos. Se o total for divisível por 10, o número é válido

### Bandeiras de Cartões Suportadas

As bandeiras são identificadas pelo BIN (Número de Identificação Bancária) ou IIN (Número de Identificação do Emissor), que são os primeiros dígitos do número do cartão.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
