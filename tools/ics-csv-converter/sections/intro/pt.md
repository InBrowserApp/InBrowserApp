## Exportar eventos de calendário ICS para CSV

Escolha **ICS para CSV**, abra um arquivo iCalendar ou cole o conteúdo e selecione **Converter**. A planilha tem uma linha por evento registrado com título, início, término, local, descrição e, quando houver, regra de recorrência. Baixe o CSV para conferir ou editar os dados no Excel ou nas Planilhas Google. Eventos de dia inteiro usam datas sem horário e a data de término fica fora do intervalo. Por exemplo, um evento que ocupa o dia 12 de maio termina em 13 de maio.

## Criar um arquivo ICS a partir de linhas CSV

Escolha **CSV para ICS** e selecione **Testar um exemplo** para conferir os cabeçalhos. Inclua pelo menos as colunas `Title` e `Start`. Use `2026-05-12` para um evento de dia inteiro, `2026-05-12T09:00:00` para um horário local ou `2026-05-12T09:00:00Z` para um horário em UTC. A ferramenta também reconhece cabeçalhos do Google Agenda, como `Subject`, `Start Date`, `Start Time` e `All Day Event`. Baixe o ICS para importar os eventos no seu calendário.

## Guardar o calendário original para um backup completo

O CSV reúne os detalhes dos eventos em linhas. As séries recorrentes são representadas pelas respectivas regras, sem gerar datas individuais. As definições de fuso horário incluídas no arquivo são preservadas. Anexos, lembretes, participantes, datas excluídas de séries recorrentes e status de cancelamento ficam no calendário original. A conversão é feita no navegador.
