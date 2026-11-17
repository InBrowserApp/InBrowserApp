## Abra uma captura HAR

Exporte um arquivo HAR (HTTP Archive) do painel Rede do navegador após registrar as requisições que deseja investigar. Abra ou solte o arquivo `.har` ou `.json` aqui, ou carregue o exemplo. O limite do arquivo é de 20 MiB e 20.000 entradas.

## Encontre requisições lentas ou malsucedidas

Pesquise por URL, método, status ou tipo MIME e ordene por hora de início, duração ou tamanho transferido. As requisições usam a mesma escala de tempo, medida a partir da primeira requisição. Selecione uma para inspecionar cabeçalhos, cookies, parâmetros, corpos e fases de tempo.

O filtro de falhas inclui os status 0, 4xx e 5xx. O status 0 significa que nenhuma resposta HTTP foi registrada; o filtro 3xx inclui respostas 304 de cache. TLS faz parte do tempo de conexão.

## Leia os dados registrados

O processamento ocorre no navegador. Os detalhes disponíveis dependem da exportação. Tamanhos desconhecidos são excluídos dos totais; o intervalo da captura fica indisponível quando falta a duração de uma requisição. A cascata continua usando os inícios registrados e os términos conhecidos.

As prévias dos corpos preservam o texto registrado. As prévias e suas cópias, assim como os valores de cada campo, são limitados a 100.000 caracteres. Corpos codificados permanecem codificados.
