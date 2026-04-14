## O que é o Escape de Unicode?

O escape de Unicode converte caracteres em sequências codificadas que representam os seus pontos de código Unicode. Isso é essencial quando o código-fonte, arquivos de configuração ou formatos de dados não podem conter certos caracteres diretamente.

**Formatos de escape comuns:**

- `\uXXXX` — JavaScript / JSON, usado na maioria das linguagens de programação
- `\u{XXXXX}` — JavaScript ES6+, suporta caracteres suplementares sem pares substitutos
- `&#xXXXX;` / `&#DDDD;` — Entidades HTML em formato hexadecimal ou decimal
- `U+XXXX` — Notação Unicode padrão usada em documentação
- `\xXX` / `%XX` — Codificação ao nível de bytes UTF-8, comum em URLs e linguagens tipo C
- `\UXXXXXXXX` — Formato Python de 8 dígitos para qualquer ponto de código
- `0xXXXX` — Notação literal hexadecimal

## Quando usar esta ferramenta

- Incorporar caracteres não-ASCII em código-fonte ou arquivos de configuração que exigem codificação ASCII-safe
- Depurar texto corrompido inspecionando os pontos de código Unicode subjacentes
- Converter entre diferentes notações de escape ao portar entre linguagens ou formatos
- Preparar texto para contextos JSON, HTML ou URL que precisam de caracteres codificados como entidades

## Como funciona

Digite ou cole texto simples à esquerda e a ferramenta faz o escape dos caracteres não-ASCII usando o formato selecionado. Cole texto escapado à direita e ele detecta e decodifica automaticamente todos os formatos suportados simultaneamente. Tudo é executado localmente no navegador.
