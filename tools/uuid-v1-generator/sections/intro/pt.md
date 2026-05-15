Gere identificadores UUID v1 localmente no navegador quando precisar de valores que incluam o horário de criação e um identificador de nó. Esta ferramenta é útil para integrações legadas, importações de banco de dados, fixtures ordenadas e sistemas que ainda esperam UUIDs versão 1 do RFC 4122.

## Quando UUID v1 ajuda

UUID v1 armazena um carimbo de data/hora, uma sequência de relógio e um valor de nó de 48 bits em uma string UUID padrão de 36 caracteres. Isso torna os IDs gerados aproximadamente ordenáveis pelo horário de criação, enquanto continuam compatíveis com sistemas que aceitam colunas UUID comuns, URLs, logs e payloads de API.

## Privacidade e identificadores de nó

A geração clássica de UUID v1 usava um endereço MAC real da placa de rede, o que pode expor informações de hardware. Esta ferramenta começa com um endereço MAC aleatório administrado localmente. Você pode inserir um valor de nó específico ao corresponder a um sistema legado, mas evite usar endereços reais de hardware em exemplos públicos ou dados compartilhados.

## Sequência de relógio e geração em lote

A sequência de relógio é um valor de 14 bits que ajuda a evitar colisões quando o mesmo nó gera IDs por volta do mesmo momento. A geração em lote mantém todos os IDs no mesmo milissegundo e incrementa o tique de 100 nanossegundos para cada linha, de modo que cada valor no resultado permaneça distinto.
