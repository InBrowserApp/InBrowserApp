## Convert spreadsheets into a SQLite database

Add one or more CSV or Excel files (.xlsx or .xls). Each CSV file and each Excel worksheet with data becomes its own table in a single database. Use the preview to check the columns and rename tables before selecting **Create SQLite database**. The conversion runs in your browser and your files stay on your device.

## How spreadsheet data becomes tables

The first row supplies column names by default. Turn off **Use first row as column names** for a table to import that row as data and generate names such as `column_1`. Duplicate table or column names get numbered suffixes, so adding another file with the same name keeps both tables.

The converter detects numeric columns without dropping leading zeros from text identifiers such as `00123`. Empty cells become SQL `NULL` values. Excel dates are stored as ISO date or timestamp text, and formula cells use the results saved in the workbook. Save the workbook in Excel first if the displayed results need recalculating.

## Query the result with SQL

Choose **Open in SQLite Viewer** to browse tables and run a query, or download the `.sqlite` database to use with the SQLite command line, Python, or another SQLite app. For example, convert `orders.csv` and an Excel workbook with a sheet named `customers`, then use a query to count orders by customer:

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Use the table and column names from your own preview when adapting this example.
