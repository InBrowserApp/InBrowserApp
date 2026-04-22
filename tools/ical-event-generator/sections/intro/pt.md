# Crie arquivos de calendário sem sair do navegador

Esta ferramenta gera arquivos de evento `.ics` padrão diretamente no navegador. Você pode definir eventos com horário ou de dia inteiro, escolher uma estratégia de fuso horário, adicionar lembretes e exportar a entrada final do calendário sem sincronizar dados com um servidor.

## Por que usar

- É útil quando você precisa apenas de um arquivo de calendário, e não de todo o fluxo de uma conta de calendário.
- Mantém agendas sensíveis no ambiente local e ainda assim gera um anexo de evento baseado em padrão.
- Permite ajustar regras de recorrência e lembretes antes de baixar o arquivo `.ics` final.

## Fluxo sugerido

1. Preencha o resumo do evento, o local, as notas e a URL de referência opcional.
2. Escolha o intervalo do evento e decida se vai exportar timestamps em `UTC` ou preservar o fuso original com `TZID`.
3. Adicione recorrência e lembretes apenas quando necessário, depois baixe o arquivo e anexe-o onde você compartilhar o evento.

## Observações

- A saída em `UTC` costuma ser a opção mais segura quando você quer ampla compatibilidade com calendários.
- A saída com `TZID` preserva o contexto original de agendamento para clientes que entendem fusos nomeados.
- Para eventos de dia inteiro, o formulário mantém a data final inclusiva, embora o arquivo ICS a armazene como data final exclusiva.
