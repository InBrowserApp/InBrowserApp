Gere ULIDs localmente no navegador para registros, eventos, logs, fixtures e sistemas distribuídos que precisam de identificadores compactos com prefixos ordenáveis por tempo. Cada valor é criado neste dispositivo e pode ser copiado ou baixado sem enviar o lote para outro serviço.

## Por Que Usar ULID

ULID significa Universally Unique Lexicographically Sortable Identifier. Ele combina um timestamp Unix em milissegundos de 48 bits com 80 bits de aleatoriedade e então codifica o resultado como uma string Crockford Base32 de 26 caracteres. Esse formato torna os ULIDs seguros para URL, adequados para bancos de dados e naturalmente ordenáveis por hora de criação.

## Hora Atual Ou Personalizada

Use a hora atual para registros normais de aplicativos, chaves de importação e dados de teste que devem refletir quando foram criados. Mude para um timestamp personalizado quando precisar de exemplos com aparência determinística, linhas preenchidas retroativamente, eventos reproduzidos ou fixtures que devam ser ordenados em torno de um momento específico.

## Lotes Monotônicos

Quando o modo de lote monotônico está ativado, os IDs gerados para o mesmo milissegundo incrementam seu segmento aleatório para que o lote permaneça lexicograficamente ordenado de cima para baixo. Desative-o quando quiser que cada linha use um novo segmento aleatório. Ambos os modos mantêm o timestamp visível nos primeiros dez caracteres.
