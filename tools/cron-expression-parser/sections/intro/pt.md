## Entenda Agendamentos Cron Antes de Usá-los em Produção

Expressões cron são compactas, mas um pequeno erro de campo pode executar uma tarefa com muito mais frequência, ou com muito menos frequência, do que o pretendido. Este analisador valida a expressão no seu navegador, explica o agendamento em linguagem simples, detalha cada campo e mostra uma prévia dos próximos horários de execução.

### Quando Usá-lo

- Verifique um agendamento de implantação, backup, limpeza ou notificação antes de adicioná-lo a um servidor, sistema de CI ou executor de tarefas.
- Compare uma expressão cron copiada com o agendamento que você realmente espera.
- Ensine ou depure a sintaxe cron alterando um campo por vez e observando a explicação ser atualizada.

### Formato Aceito

A ferramenta aceita expressões cron Unix padrão de cinco campos: minuto, hora, dia do mês, mês e dia da semana. Ela também aceita uma expressão de seis campos com segundos no início para agendadores que oferecem suporte à precisão no nível de segundos.

### Lendo o Resultado

O resumo fornece uma descrição em linguagem simples, enquanto a tabela de campos mostra como a expressão bruta é dividida. Os próximos horários de execução usam o fuso horário local do seu navegador, então compare-os com o fuso horário usado pelo agendador que executará a tarefa.

### Observações

- Valores de dia da semana geralmente usam `0` ou `7` para domingo, e nomes como `MON` ou `FRI` também são aceitos.
- Nomes de meses como `JAN` ou `DEC` podem facilitar a revisão de agendamentos de produção.
- Se o seu agendador usa um dialeto cron diferente, confirme tokens especiais como `?`, `L`, `W` ou `#` na documentação do próprio agendador.
