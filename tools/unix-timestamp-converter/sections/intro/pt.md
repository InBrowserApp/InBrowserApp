## Converter um timestamp Unix em data

Cole um timestamp para ver a data e a hora no fuso horário do seu dispositivo, em UTC e no formato ISO 8601, além do tempo decorrido ou restante. Por exemplo, `1704067200` segundos e `1704067200000` milissegundos correspondem a `2024-01-01T00:00:00.000Z` em ISO 8601.

## Converter uma data em timestamp Unix

Altere **Data e Hora** para converter a data e a hora locais em um timestamp Unix na unidade selecionada. Clique em **Agora** para obter o timestamp atual. Para registros e APIs, use o valor ISO 8601 que termina em `Z` quando precisar indicar claramente que o horário está em UTC.

## Escolher segundos, milissegundos ou nanossegundos

Os timestamps Unix medem o tempo a partir de 1º de janeiro de 1970 às 00:00:00 UTC. A opção **Auto** interpreta até 10 dígitos como segundos, de 11 a 13 como milissegundos e valores com mais dígitos como nanossegundos. Se você souber a unidade de origem, selecione-a manualmente. Isso ajuda em especial com timestamps antigos em milissegundos ou quando a data exibida parece incorreta. A data é exibida com precisão de milissegundos.
