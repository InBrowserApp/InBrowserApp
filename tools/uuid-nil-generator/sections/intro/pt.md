## O que é um UUID Nil?

Um UUID nil é o UUID padronizado cujos 128 bits são todos zero. Sua forma textual canônica é `00000000-0000-0000-0000-000000000000`, e ele costuma ser usado para indicar que "nenhum UUID foi atribuído ainda."

## Quando usá-lo

Use um UUID nil quando uma API, coluna de banco de dados, fixture ou arquivo de configuração exigir um valor com formato de UUID, mas o identificador real estiver intencionalmente ausente. Ele é útil como placeholder em testes, modelos de importação, scripts de migração e protocolos que definem um valor de UUID vazio explícito.

## Com o que tomar cuidado

Não trate o UUID nil como um identificador único gerado. Ele é o mesmo valor todas as vezes, portanto armazená-lo onde se espera um ID de objeto real pode ocultar dados ausentes, quebrar pressupostos de unicidade ou fazer registros parecerem conectados quando não estão.
