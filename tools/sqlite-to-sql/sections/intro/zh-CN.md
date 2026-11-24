## 如何将 SQLite 导出为 SQL 文件

打开或拖入 SQLite 3 数据库文件，例如 `.db`、`.sqlite` 或 `.sqlite3` 文件。工具会自动生成 SQL 转储。开启**仅导出结构**可导出数据库结构而不包含表中的数据行，然后选择**下载 .sql 文件**保存完整脚本。您也可以试用示例数据库，查看输出效果。

## SQLite SQL 转储包含什么

SQL 转储是用于重建数据库的文本脚本。它包含用于创建表、索引、视图和触发器的 `CREATE` 语句；完整导出还包含表数据的 `INSERT` 语句。您可以用它在 Git 中查看结构变更、保留可读的备份，或将数据库迁移到另一个 SQLite 环境。

源文件始终留在您的设备上。如果源数据库使用预写日志（WAL），请导出一份独立的数据库副本。使用创建该数据库的应用或 SQLite 的备份命令，以确保副本包含日志中已提交的更改。

## 如何还原 SQL 转储

运行以下命令，将脚本导入新的 SQLite 数据库：

```sh
sqlite3 restored.sqlite < database.sql
```

将 `database.sql` 替换为您下载的文件名。脚本使用 SQLite 语法。还原使用虚拟表或扩展的数据库时，SQLite 安装环境中必须包含所需模块。

如需浏览数据表或将查询结果导出为 CSV 或 JSON，请打开 [SQLite 查看器](../sqlite-viewer/)。如需从电子表格创建数据库，请使用 [CSV 和 Excel 转 SQLite](../csv-excel-to-sqlite/)。
