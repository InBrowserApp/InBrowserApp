## Gerar datas aleatórias num intervalo

Introduza uma **Data inicial** e uma **Data final**, escolha um formato de saída e selecione **Gerar**. Ambas as datas limite estão incluídas, pelo que um intervalo de `2024-02-28` a `2024-03-01` também pode produzir o dia bissexto `2024-02-29`. A mesma data pode aparecer várias vezes num conjunto. Copie os resultados ou transfira um ficheiro de texto `UTF-8` com uma data por linha.

## Escolher uma data ISO ou localizada

Use **ISO (YYYY-MM-DD)** para dados de teste, importações para folhas de cálculo ou datas que devam ser ordenadas cronologicamente como texto. Use **Data localizada** para apresentar a data do calendário gregoriano no idioma da página. Por exemplo, `2024-02-29` aparece como `Feb 29, 2024` na página em inglês e como `29.02.2024` na página em alemão.

## Usar o mesmo dia do calendário em diferentes fusos horários

O intervalo usa os limites dos dias em UTC. Uma data escolhida em qualquer um dos extremos mantém-se no mesmo dia do calendário onde quer que o gerador seja apresentado. Ao definir a mesma data inicial e final, é gerada apenas essa data, o que é útil para testar dias bissextos ou o primeiro ou último dia de um mês.
