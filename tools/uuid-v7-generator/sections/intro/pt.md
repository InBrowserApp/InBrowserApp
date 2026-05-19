UUID v7 é um formato UUID moderno que coloca um timestamp Unix em milissegundos no início do identificador e preenche os bits restantes com aleatoriedade. Isso torna os valores globalmente únicos na prática, ao mesmo tempo que os mantém naturalmente ordenáveis pela hora de criação.

## O Que Esta Ferramenta Faz

Este gerador cria valores UUID v7 inteiramente no seu navegador. Você pode gerar um único identificador ou um lote de até 100 e depois copiar a lista ou baixá-la como arquivo de texto para dados iniciais, registros de banco de dados, dados de teste de eventos ou cargas de teste.

## Hora Atual Ou Personalizada

Use a hora atual para registros normais de aplicativos, chaves de importação e dados de teste que devem refletir quando foram criados. Mude para um timestamp personalizado quando precisar de exemplos com aparência determinística, linhas preenchidas retroativamente, eventos reproduzidos ou fixtures que devam ser ordenados em torno de um momento específico.

## Quando UUID v7 Ajuda

UUID v7 é útil quando você quer identificadores opacos que ainda se ordenem bem em bancos de dados, logs, filas e fluxos de eventos distribuídos. Em comparação com valores UUID v4 aleatórios, UUID v7 reduz a movimentação de índices porque registros mais recentes tendem a aparecer perto do fim de um espaço de chaves ordenado.

## Notas Sobre Ordenação E Segurança

A parte de timestamp registra milissegundos, não um valor privado ou secreto. Se um identificador não deve revelar a hora aproximada de criação, use um formato totalmente aleatório. Dentro de um lote gerado, esta ferramenta mantém os valores monotônicos para o mesmo milissegundo enquanto preserva os bits de versão e variante do UUID v7.
