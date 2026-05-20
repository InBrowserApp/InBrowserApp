O Gerador de UUID v6 cria UUIDs baseados em tempo que mantêm o formato familiar de UUID, colocando o carimbo de data/hora primeiro para ordenação lexical natural. Ele é executado inteiramente no seu navegador, portanto os identificadores gerados e os valores opcionais de nó nunca saem da página.

## Quando o UUID v6 ajuda

Use UUID v6 quando precisar de identificadores que continuem amplamente compatíveis com ferramentas de UUID, mas que também se ordenem de forma próxima à ordem de criação em logs, índices de banco de dados, fluxos de eventos ou scripts de migração. O UUID v6 é semanticamente mais próximo do UUID v1: ele usa um carimbo de data/hora gregoriano, uma sequência do relógio e um campo de nó de 48 bits, mas reorganiza os bits do carimbo de data/hora para que IDs mais novos sejam ordenados depois dos mais antigos.

## IDs de nó e privacidade

Geradores clássicos de UUID v1 costumam usar um endereço MAC real como campo de nó. Esta ferramenta usa por padrão um ID de nó aleatório e administrado localmente para cada UUID gerado, de modo que não expõe um endereço de hardware. Mude para um nó personalizado somente quando precisar intencionalmente de saída compatível com v1 para fixtures de teste, verificações de interoperabilidade ou sistemas controlados.

## Sequência do relógio e hora personalizada

A sequência do relógio ajuda a evitar colisões quando os carimbos de data/hora se repetem ou os relógios retrocedem. A sequência aleatória padrão é a mais segura para uso normal. Carimbos de data/hora, IDs de nó e sequências do relógio personalizados são úteis para exemplos determinísticos, mas valores personalizados repetidos devem ser usados com cuidado em dados de produção.
