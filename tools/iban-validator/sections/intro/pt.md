## O que é IBAN?

IBAN (International Bank Account Number) é um identificador padronizado de contas bancárias usado em pagamentos internacionais.

### Estrutura do IBAN

Um IBAN começa com um código de país de duas letras, dois dígitos de controle e um BBAN específico do país.

### Validação de checksum

A validade do IBAN é verificada pelo algoritmo mod-97 da ISO 13616.

1. Remova os espaços e mova os quatro primeiros caracteres para o fim
2. Converta letras em números (A=10, B=11, ..., Z=35)
3. Calcule mod 97; um IBAN válido deixa resto 1

Cada país define um comprimento e estrutura fixos para a parte BBAN.
