## Examinar arquivos SQLite localmente

Abra um banco SQLite 3 para navegar pelas tabelas e visualizações, examinar definições de colunas, índices, chaves estrangeiras e instruções CREATE ou executar uma consulta SQL somente leitura. Experimente o banco de exemplo para explorar a área de trabalho sem escolher um arquivo. Arquivos e consultas ficam no navegador e não são salvos automaticamente.

## Consultar e exportar resultados

Selecione uma tabela para visualizar suas linhas. Edite o SQL e use **Executar consulta** ou **Ctrl/⌘ + Enter** para executar uma instrução SELECT, WITH ou EXPLAIN. O limite de resultados restringe o número de linhas carregadas; a paginação exibe 50 linhas por vez. Uma consulta também pode parar ao atingir o limite de 5 MiB de resultados ou após 10 segundos. O cancelamento mantém a interface responsiva e recarrega a cópia instantânea do banco na próxima consulta.

As exportações CSV e JSON contêm o resultado carregado, incluindo linhas de outras páginas. O JSON armazena nomes de colunas e matrizes de linhas separadamente, preservando nomes duplicados e valores NULL. Inteiros SQLite tornam-se strings decimais exatas e BLOBs tornam-se objetos com um valor hexadecimal `$blob`. O CSV usa campos vazios para NULL, coloca caracteres especiais entre aspas e adiciona um apóstrofo antes de textos semelhantes a fórmulas para um uso mais seguro em planilhas.

## Bancos compatíveis e limites

Abra um arquivo `.db`, `.sqlite` ou `.sqlite3` não criptografado de até 50 MiB. O arquivo original nunca é modificado. Esta ferramenta carrega uma cópia instantânea em memória, então o uso de memória pode exceder o tamanho do arquivo. Arquivos auxiliares WAL e journal não são importados; crie uma cópia limpa após um checkpoint no seu aplicativo de banco de dados antes de abri-la aqui. Bancos criptografados, extensões SQLite personalizadas e edição de bancos não são compatíveis.
