## Converter planilhas em um banco de dados SQLite

Adicione um ou mais arquivos CSV ou Excel (.xlsx ou .xls). Cada arquivo CSV e cada aba do Excel que contém dados vira uma tabela separada no mesmo banco. Confira as colunas na prévia, renomeie as tabelas se precisar e selecione **Criar banco SQLite**. A conversão acontece no navegador e os arquivos ficam no seu dispositivo.

## Como os dados da planilha viram tabelas

Por padrão, a primeira linha fornece os nomes das colunas. Para importar essa linha como dados, desmarque **Usar a primeira linha como cabeçalho** na tabela. O conversor vai gerar nomes como `column_1`. Nomes de tabela ou coluna repetidos recebem sufixos numéricos. Assim, você pode adicionar outro arquivo com o mesmo nome e manter as duas tabelas.

O conversor detecta as colunas numéricas e preserva os zeros à esquerda de identificadores de texto como `00123`. Células vazias recebem o valor SQL `NULL`. Datas do Excel são armazenadas como texto em formato ISO, com ou sem horário. Para células com fórmulas, o conversor usa os resultados salvos no arquivo do Excel. Se precisar atualizar esses resultados, recalcule as fórmulas e salve o arquivo no Excel antes de importar.

## Consultar os dados com SQL

Selecione **Abrir no Visualizador SQLite** para explorar as tabelas e executar consultas. Você também pode baixar o arquivo `.sqlite` e usá-lo com o SQLite na linha de comando, no Python ou em outro aplicativo compatível. Por exemplo, converta `orders.csv` e um arquivo do Excel com uma aba chamada `customers`. A consulta a seguir conta os pedidos por cliente.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Para adaptar o exemplo, use os nomes de tabela e coluna que aparecem na sua prévia.
