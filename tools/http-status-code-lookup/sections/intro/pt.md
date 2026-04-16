## O que e um codigo de status HTTP?

Codigos de status HTTP sao codigos de resposta de tres digitos retornados por um servidor para mostrar o que aconteceu com uma requisicao. Eles aparecem com frequencia nas ferramentas de desenvolvedor do navegador, nas respostas de API, nos logs do servidor, nos monitores de disponibilidade e nos paineis de proxy reverso.

### Como ler as principais familias de status

- **1xx Informativo:** O servidor recebeu a requisicao e o processamento ainda esta em andamento.
- **2xx Sucesso:** A requisicao foi concluida com sucesso.
- **3xx Redirecionamento:** O cliente precisa seguir outro destino ou reutilizar um resultado em cache.
- **4xx Erro do cliente:** A propria requisicao tem um problema, como recurso ausente, entrada invalida ou falha de autenticacao.
- **5xx Erro do servidor:** O servidor ou uma dependencia upstream falhou ao processar uma requisicao valida.

### Quando este lookup e util

Use esta ferramenta quando precisar confirmar o significado de um codigo, comparar codigos parecidos como 401 e 403 ou 502 e 504, ou pesquisar uma frase vista em uma mensagem de erro. A busca funciona por codigo, nome do status e descricao localizada.

### Por que a interpretacao correta importa

Durante a depuracao, o codigo de status costuma ser a pista mais rapida. Uma resposta 4xx normalmente aponta para a requisicao, as credenciais ou o recurso de destino. Uma resposta 5xx normalmente aponta para a aplicacao, o gateway ou um servico upstream. Ler primeiro a categoria ajuda a escolher o proximo passo com mais precisao.
