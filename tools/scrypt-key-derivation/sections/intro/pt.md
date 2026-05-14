## O que é scrypt?

scrypt é uma função de derivação de chaves baseada em senha (KDF) resistente por uso de memória. Ela transforma uma senha e um salt em bytes de chave determinísticos enquanto consome intencionalmente tempo de CPU e memória, o que torna a tentativa de adivinhar senhas em grande escala mais cara do que hashing simples.

**Pontos principais:**

- Usa `N` (fator de custo), `r` (tamanho do bloco) e `p` (paralelismo)
- Configurações mais altas de `N` e `r` aumentam o custo de memória e computação
- Produz a mesma chave derivada somente quando a senha, o salt, os parâmetros e o comprimento de saída correspondem

**Boas práticas:**

- Use um salt aleatório exclusivo para cada senha ou segredo
- Armazene `N`, `r`, `p`, o formato do salt e o comprimento de saída junto à chave derivada
- Ajuste os parâmetros no dispositivo mais lento que você precisa oferecer suporte antes de usá-los em produção
