## O que é Argon2?

Argon2 é um algoritmo de hash de palavras-passe concebido para tornar dispendiosa a quebra offline de palavras-passe. Combina computação repetida com um custo de memória configurável, para que os atacantes precisem de tempo e memória em cada tentativa de adivinhar a palavra-passe.

**Porque Argon2id é geralmente a opção predefinida:**

- Equilibra a resistência a ataques por canal lateral e à quebra por GPU melhor do que usar Argon2i ou Argon2d na maioria dos sistemas de armazenamento de palavras-passe
- A saída codificada armazena o algoritmo, a versão, a memória, a iteração, o paralelismo, o salt e o hash numa única string portátil
- Um salt aleatório exclusivo impede que palavras-passe idênticas produzam hashes armazenados idênticos
- As definições de memória e iterações podem ser aumentadas à medida que o seu ambiente de verificação se torna mais rápido

**Como usar esta ferramenta:**

1. Introduza a palavra-passe para a qual quer criar um hash.
2. Mantenha o salt gerado ou crie um novo salt aleatório.
3. Escolha a variante Argon2 e ajuste a memória, as iterações, o paralelismo e o comprimento do hash para o sistema que irá verificar o hash.
4. Gere o hash codificado e armazene essa string completa na base de dados da sua aplicação.

**Notas de segurança:**

- Não armazene nem registe a palavra-passe em texto simples.
- Use um novo salt aleatório para cada palavra-passe.
- Use o segredo opcional apenas se o seu verificador também tiver esse mesmo segredo; caso contrário, o hash não poderá ser verificado mais tarde.
- Prefira as definições de memória e iterações mais elevadas que mantenham a latência de início de sessão aceitável para utilizadores reais.
