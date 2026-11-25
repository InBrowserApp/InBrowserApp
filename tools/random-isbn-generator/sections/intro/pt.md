## Gerar números ISBN-10 ou ISBN-13 aleatórios

Escolha `ISBN-13` para formulários atuais de catálogo e venda de livros ou `ISBN-10` para registros antigos. Defina uma quantidade de `1` a `1000`, escolha se deseja incluir hífens e selecione **Gerar**. Copie o lote ou baixe um arquivo TXT com um ISBN por linha.

## Entender o formato e o dígito verificador

O Número Internacional Normalizado para Livro (ISBN) identifica a edição e o formato de um livro. Os valores `ISBN-13` gerados usam o prefixo `978` e terminam em um dígito verificador numérico. Um `ISBN-10` pode terminar em `X`, que representa dez no cálculo da soma de verificação. Dois exemplos são `978-0-306-40615-7` e `0-8044-2957-X`. Os hífens facilitam a leitura dos grupos e não alteram o dígito verificador.

## Usar os resultados como dados de teste

Use estes identificadores de exemplo para testar formulários de catálogo, importações e a validação de ISBN. Para testar um erro de soma de verificação, troque apenas o último caractere por outro dígito e tente importar novamente. Em uma planilha ou banco de dados, armazene os ISBNs como texto para preservar um zero inicial ou um `X` final. Para um livro publicado, consulte o ISBN na capa da edição ou no registro da editora.
