## Para que serve esta ferramenta

Use esta calculadora para medir com precisão o tempo decorrido entre
duas datas e horas locais, mesmo quando pertencem a fusos IANA
diferentes. Ela é útil quando você precisa de uma resposta confiável
sem converter offsets manualmente nem adivinhar o efeito do horário de
verão.

## Casos de uso comuns

- Comparar um horário de início em uma cidade com um horário de término
  em outra.
- Medir o tempo decorrido entre logs, incidentes, voos ou janelas de
  suporte registrados em fusos horários diferentes.
- Verificar se dois timestamps atravessam a meia-noite, um fim de
  semana ou uma mudança de horário de verão.

## Como esta calculadora funciona

- Digite a data e a hora locais de início e fim no formato
  `YYYY-MM-DD HH:mm:ss.SSS` e depois escolha o fuso horário de cada
  lado.
- A ferramenta converte internamente ambos os timestamps para UTC e
  então mostra a duração com sinal, a duração absoluta, a duração ISO
  8601 e os totais de milissegundos até dias.
- Use `Now` para preencher rapidamente a hora atual ou `Swap` para
  inverter a comparação. Os offsets podem mudar durante as transições
  de horário de verão.
