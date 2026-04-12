## O que é codificação URL?

A codificação URL (também chamada de codificação por porcentagem) é um método para converter caracteres especiais em um formato que pode ser transmitido com segurança pela internet. URLs só podem conter certos caracteres, então qualquer caractere não permitido deve ser codificado.

**Como funciona:**

- Caracteres especiais são convertidos para `%` seguido de seu código ASCII hexadecimal
- Exemplo: um espaço se torna `%20`, `{'@'}` se torna `%40`
- Apenas letras (A-Z, a-z), números (0-9) e alguns símbolos (- \_ . ~) não precisam de codificação

**Exemplos comuns:**

- Espaço → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Por que é necessário:**

- URLs têm caracteres reservados com significados especiais
- Garante que os dados sejam transmitidos corretamente
- Previne conflitos com a estrutura da URL
- Necessário para formulários web e chamadas de API
