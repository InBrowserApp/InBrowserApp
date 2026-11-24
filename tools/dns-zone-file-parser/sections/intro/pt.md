## Como ler um arquivo de zona DNS

Abra uma exportação DNS no formato BIND ou cole o texto. Carregue o exemplo para ver um registro SOA, registros de endereços IPv4 e IPv6, registros de e-mail e um texto TXT. Cada linha mostra o nome, a classe, o tipo, o tempo de vida em segundos e os dados do registro. Filtre pelo nome, por um tipo como MX ou por parte de um valor. Depois, copie os registros visíveis como JSON para usar em um inventário ou uma migração.

## Como a origem, o TTL e os dados são interpretados

Quando `$ORIGIN` é `example.com.`, o nome relativo `www` é interpretado como `www.example.com.`. O símbolo `@` representa a origem atual e uma linha recuada herda o nome do registro anterior. Se o arquivo não tiver `$ORIGIN`, informe o domínio em Origem inicial. Um `$TTL` padrão de `1h` equivale a 3.600 segundos. Se um registro tiver seu próprio TTL, vale o dele. Os dados preservam as aspas, os caracteres de escape e os destinos relativos tal como aparecem no arquivo. Assim, `"hello; world"` continua sendo um único valor TXT, e `mail` continua sendo `mail` nos dados de um registro MX.

## O que aparece nos resultados

O analisador lê comentários, texto entre aspas e registros de várias linhas. Se houver um problema, a observação indica o número da linha e os registros que puderam ser lidos continuam visíveis. Se a zona usar `$INCLUDE` ou `$GENERATE`, expanda essas diretivas e cole os registros completos. A análise é feita no navegador, sem consultar servidores DNS nem testar se um provedor específico consegue carregar a zona.
