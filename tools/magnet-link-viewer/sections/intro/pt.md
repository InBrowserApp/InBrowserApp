Um link magnet identifica um torrent BitTorrent por meio do hash de informação. O link também pode conter um nome de exibição, endereços de trackers, web seeds ou uma fonte de metadados. Para ver os nomes e tamanhos reais dos arquivos, um cliente precisa obter os metadados do torrent.

## Como examinar um link magnet

Cole um link `magnet:?` e selecione o botão de consulta. O visualizador mostra o hash de informação e os nomes ou endereços de trackers incluídos no link. Quando o WebTorrent obtém os metadados, o visualizador mostra o nome do torrent, os caminhos e tamanhos dos arquivos, o tamanho total e as informações das peças. Você pode filtrar a lista de arquivos e copiar o hash de informação.

## Por que alguns links magnet não são resolvidos

No navegador, o WebTorrent precisa de peers acessíveis que ofereçam suporte a WebRTC, normalmente encontrados por meio de um tracker WebSocket. Alguns links magnet também incluem uma fonte HTTPS de metadados que o navegador pode ler. Um link compatível com um cliente de torrent para computador ainda pode exceder o tempo limite aqui. Se você tiver o arquivo `.torrent`, use o visualizador de arquivos indicado para lê-lo imediatamente.

## A que a consulta se conecta

A consulta é executada no navegador. O WebTorrent pode se conectar a trackers, peers ou a uma fonte de metadados do torrent solicitado. Esses serviços podem ver seu endereço IP e o torrent consultado. O visualizador solicita metadados e não baixa os arquivos listados. Links magnet precisam conter um hash de informação BitTorrent v1 (`btih`), inclusive os que também identificam um torrent v2.
