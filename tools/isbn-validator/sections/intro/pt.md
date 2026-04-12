## O que é ISBN?

ISBN (International Standard Book Number) é um identificador de livros e edições.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Verificação ISBN-10

ISBN-10 tem 9 dígitos de dados e um dígito verificador (X significa 10).

1. Remova hífens e espaços
2. Multiplique por pesos de 10 a 2 e some
3. O dígito verificador torna a soma divisível por 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Verificação ISBN-13

ISBN-13 tem 12 dígitos de dados e um dígito verificador, geralmente começa com 978 ou 979.

1. Multiplique alternando por 1 e 3
2. Some os primeiros 12 dígitos
3. O dígito verificador torna a soma múltipla de 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

ISBN-10 válido vira ISBN-13 com prefixo 978; apenas ISBN-13 com 978 pode voltar.

`9780306406157` -> `0306406152`
