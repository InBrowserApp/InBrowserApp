## Crie agendamentos cron visualmente

Expressões cron são compactas, mas uma pequena alteração no campo errado pode
levar uma tarefa de "manhãs em dias úteis" para "a cada minuto". Este gerador
dá controles próprios a cada campo para que você crie uma expressão padrão de
cinco campos sem memorizar todas as regras de sintaxe.

### Quando ela ajuda

- Criar agendamentos para jobs de CI, backups, pré-aquecimento de cache,
  relatórios e outras tarefas recorrentes.
- Começar com uma predefinição conhecida e ajustar um campo por vez.
- Pré-visualizar os próximos horários locais de execução antes de colar a
  expressão em um agendador.

### Como usar

1. Escolha uma predefinição rápida ou mantenha a expressão padrão e edite cada
   campo manualmente.
2. Escolha se cada campo deve executar em todos os valores, em um intervalo,
   em valores específicos ou em uma faixa.
3. Revise a expressão gerada e a prévia das próximas execuções, depois copie-a
   para o seu agendador.

### Observações

- Esta ferramenta gera cron padrão de cinco campos: minuto, hora, dia do mês,
  mês e dia da semana.
- Domingo é mostrado como `0`, aceito por agendadores cron comuns no estilo
  Unix.
- Se tanto o dia do mês quanto o dia da semana estiverem restritos, muitas
  implementações de cron executam quando qualquer um dos campos corresponde.
  Alguns sistemas diferem, então verifique essa combinação no agendador de
  destino.
