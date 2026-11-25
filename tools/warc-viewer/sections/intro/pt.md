## Abrir um arquivo da web WARC

Selecione ou solte um arquivo `.warc` ou `.warc.gz` ou experimente o arquivo de exemplo. O visualizador lista os registros de captura e abre a primeira página HTML arquivada que encontrar. Filtre por URL ou tipo de registro para achar uma captura e alterne entre a prévia da página e os detalhes do registro. Indexar um arquivo grande pode demorar. O arquivo fica no seu navegador.

## Consultar datas de captura e cabeçalhos

Um arquivo Web ARChive (WARC) armazena registros coletados por um rastreador ou uma ferramenta de arquivamento ao visitar um site. Vários registros podem ter a mesma URL. Use a data da captura em UTC e o status HTTP original para diferenciá-los. Um registro de resposta contém o que o servidor retornou. Um registro de solicitação descreve o que o rastreador enviou. Um registro de revisita pode apontar para outra captura sem salvar outra cópia da página. Você pode consultar esses registros mesmo quando não há prévia da página.

## O que a prévia inclui?

A prévia estática usa o HTML e as imagens e folhas de estilo compatíveis que estão no mesmo arquivo. A ausência de recursos pode mudar o layout ou deixar espaços vazios. Os scripts ficam desativados e a prévia não faz solicitações ao site original, por isso recursos interativos como login e reprodução de vídeo ficam indisponíveis. O visualizador aceita WARC 1.0 e 1.1, inclusive registros compactados com gzip.

[Especificação do formato WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
