## 将表格文件转换为 SQLite 数据库

添加一个或多个 CSV 或 Excel 文件（.xlsx 或 .xls）。每个 CSV 文件和每个包含数据的 Excel 工作表都会成为同一个数据库中的独立数据表。选择 **创建 SQLite 数据库** 之前，可以通过预览检查各列并重命名数据表。转换在浏览器中进行，文件始终留在你的设备上。

## 表格数据如何转换为数据表

默认使用首行作为列名。关闭数据表的 **使用首行作为列名** 选项后，首行会作为数据导入，列名则自动生成为 `column_1` 等形式。重复的表名或列名会添加数字后缀，因此添加同名文件时，两个数据表都会保留。

转换器会识别数值列，同时保留 `00123` 等文本标识符开头的零。空单元格会转换为 SQL `NULL` 值。Excel 日期保存为 ISO 日期或时间戳文本，公式单元格使用工作簿中保存的计算结果。如果显示的结果需要重新计算，请先在 Excel 中保存工作簿。

## 使用 SQL 查询结果

选择 **在 SQLite 查看器中打开** 即可浏览数据表并执行查询，也可以下载 `.sqlite` 数据库，在 SQLite 命令行、Python 或其他 SQLite 应用中使用。例如，转换 `orders.csv` 和一个包含 `customers` 工作表的 Excel 工作簿后，可以通过查询统计每位客户的订单数：

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

修改此示例时，请使用预览中显示的表名和列名。
