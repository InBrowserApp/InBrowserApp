Gere KSUIDs localmente no navegador sem enviar o lote atual para outro serviço. Esta ferramenta é útil quando você precisa de identificadores que continuem únicos em sistemas distribuídos e ainda se ordenem aproximadamente pelo momento de criação em logs, feeds, importações ou registros ordenados.

## Por Que Usar KSUID

O KSUID combina um timestamp de 32 bits com 128 bits de aleatoriedade e codifica o resultado como uma string Base62 de 27 caracteres. Isso faz com que cada ID seja compacto, amigável para URL e fácil de armazenar, enquanto o timestamp embutido normalmente coloca os valores mais novos depois dos mais antigos.

## Escolha Entre Hora Atual E Hora Personalizada

Use a hora atual quando quiser IDs novos para dados de produção, demonstrações ou geração em lote do dia a dia. Mude para um timestamp personalizado quando precisar de fixtures reproduzíveis, registros preenchidos retroativamente, exemplos de migração ou casos de teste que devam parecer criados em um momento específico.

## O Que Saber Antes De Exportar

O KSUID mantém apenas precisão de segundos, então qualquer entrada com milissegundos é arredondada para baixo até o início daquele segundo. IDs criados no mesmo segundo continuam únicos, mas a ordem final também depende da parte aleatória. Por isso, trate o KSUID como ordenável por tempo, não como uma sequência estritamente contínua.
