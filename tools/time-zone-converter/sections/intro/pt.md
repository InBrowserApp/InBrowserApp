## Para que esta ferramenta serve

Use este conversor para transformar uma data e hora locais de um fuso horário IANA na hora local equivalente de outro fuso. Ele ajuda quando você precisa comparar horários entre cidades sem somar offsets manualmente nem adivinhar se o horário de verão está ativo.

## Casos de uso comuns

- Verificar se uma reunião em Tóquio cai no mesmo dia de calendário em Nova York ou Londres.
- Confirmar offsets antes de publicar horários, alertas ou janelas de suporte.
- Copiar os valores correspondentes de ISO 8601, UTC ou timestamp Unix para logs e APIs.

## Como este conversor funciona

- Digite uma data e hora local no formato `YYYY-MM-DD HH:mm:ss.SSS` em qualquer um dos lados e depois escolha os fusos de origem e destino.
- O lado editado mais recentemente vira a referência. A ferramenta converte esse instante para UTC internamente e então mostra a hora local equivalente no outro fuso.
- Use `Now` para preencher rapidamente o horário atual ou `Swap` para inverter a comparação. Os offsets podem mudar perto das transições de horário de verão.
