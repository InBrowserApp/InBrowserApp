## Explore bancos SQLite no navegador

Abra um banco SQLite 3 para explorar tabelas e visualizações, examinar colunas, índices, chaves estrangeiras e instruções CREATE ou executar uma consulta SQL somente leitura. Experimente o banco de exemplo para explorar a área de trabalho. Seu arquivo é processado localmente e nunca é modificado.

## Consultar e exportar resultados

Selecione uma tabela ou visualização para carregar suas linhas e edite o SQL para filtrar, ordenar ou juntar dados. Execute uma instrução SELECT, WITH ou EXPLAIN com **Executar consulta** ou **Ctrl/⌘ + Enter**. Clique em uma célula para examinar e copiar seu valor completo.

Escolha um limite de resultados de 100, 1.000 ou 10.000 linhas e navegue pelo resultado com 50 linhas por página. As consultas têm um limite de 10 segundos e os resultados são limitados a 5 MiB. As exportações CSV e JSON incluem todas as linhas carregadas, de todas as páginas.

O JSON usa matrizes separadas de nomes de colunas e linhas para preservar nomes duplicados e valores NULL. Inteiros são strings decimais exatas e BLOBs contêm um valor hexadecimal `$blob`. O CSV inclui uma linha de cabeçalho, usa campos vazios para NULL e adiciona um apóstrofo antes de textos semelhantes a fórmulas.

## Arquivos SQLite compatíveis

Abra um arquivo `.db`, `.sqlite` ou `.sqlite3` não criptografado de até 50 MiB. Para um banco que usa WAL, crie uma cópia após um checkpoint antes de abri-lo; arquivos auxiliares WAL e journal não são carregados. Extensões SQLite personalizadas não são compatíveis. Arquivos e consultas não são salvos automaticamente.
