## O que é KSUID?

KSUID (K-Sortable Unique IDentifier) é um identificador base62 de 27 caracteres que incorpora um timestamp de 32 bits (segundos desde 2014-05-13) e 128 bits de dados aleatórios.

**Pontos-chave:**

- **Ordenável por tempo**: a ordem lexicográfica segue o horário de criação.
- **Alta unicidade**: 128 bits de aleatoriedade por ID.
- **Precisão de segundos**: KSUID armazena segundos, milissegundos são arredondados para baixo.
