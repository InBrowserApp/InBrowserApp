## O que é um Max UUID?

Um max UUID é o UUID padronizado cujos 128 bits estão todos definidos como um. Sua forma textual canônica é `ffffffff-ffff-ffff-ffff-ffffffffffff`, e ele costuma ser usado para representar o maior valor de UUID possível.

## Quando usá-lo

Use um max UUID quando uma API, consulta de banco de dados, fixture ou verificação de intervalo precisar de um limite superior em formato de UUID ou de um valor sentinela. Ele é útil em testes, scripts de migração, cursores de paginação e protocolos que definem um valor máximo explícito de UUID.

## Cuidados

Não trate o max UUID como um identificador único gerado. Ele é sempre o mesmo valor, portanto armazená-lo onde se espera um ID de objeto real pode ocultar lógica de sentinela, quebrar pressupostos de unicidade ou fazer registros serem ordenados inesperadamente no fim.
