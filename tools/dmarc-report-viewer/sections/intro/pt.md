## Como ler um relatório agregado DMARC

Abra o anexo de um relatório agregado enviado ao endereço indicado em `rua` no seu registro DMARC. O visualizador aceita XML, GZIP e arquivos ZIP com um único relatório XML. Você também pode colar o XML ou carregar o exemplo. O resumo mostra quem enviou o relatório, qual é o período em UTC e qual política foi publicada para o domínio. Os arquivos e o texto colado são processados no navegador.

## Como interpretar as contagens de mensagens

Cada registro de origem agrupa mensagens com o mesmo IP de origem e o mesmo resultado da avaliação. Ele pode representar várias mensagens, e um mesmo IP pode aparecer em mais de um registro. Os totais somam as contagens de cada linha. Uma mensagem passa no DMARC quando passa no SPF ou no DKIM e o domínio desse mecanismo está alinhado com o domínio visível no campo De (From). O visualizador conta uma falha quando as duas verificações de alinhamento falham. Se faltarem dados de alinhamento, o resultado aparece como desconhecido.

## Por que o alinhamento, a autenticação e a ação aplicada podem diferir

Expanda Resultados brutos de autenticação para ver os domínios, os resultados e os seletores DKIM registrados no relatório. SPF ou DKIM podem passar para outro domínio e ainda assim falhar na verificação de alinhamento do DMARC. A ação aplicada mostra o que o servidor destinatário fez com um grupo de mensagens. Se houver uma exceção, a ação pode diferir da política publicada. Filtre por IP de origem ou domínio do campo De para investigar um remetente sem alterar os totais do relatório.

## Quais formatos XML de DMARC o visualizador aceita

O visualizador lê relatórios agregados que seguem a RFC 9990, incluindo seu namespace DMARC, e relatórios antigos baseados na RFC 7489. A RFC 9990 descreve o formato XML usado para resumir a autenticação e as ações aplicadas em relatórios agregados. Se o sistema de e-mail compactar vários relatórios no mesmo arquivo, extraia o que você quer analisar e abra-o separadamente.
