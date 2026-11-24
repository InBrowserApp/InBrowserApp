## Converti fogli di calcolo in un database SQLite

Aggiungi uno o più file CSV o Excel (.xlsx o .xls). Il database contiene una tabella per ogni file CSV e per ogni foglio Excel con dati. Usa l’anteprima per controllare le colonne e rinominare le tabelle prima di selezionare **Crea database SQLite**. La conversione avviene nel browser e i file restano sul tuo dispositivo.

## Come vengono importate righe e colonne

Per impostazione predefinita, i valori della prima riga diventano i nomi delle colonne. Disattiva **Usa la prima riga come intestazione** per importare quella riga tra i dati e generare nomi di colonna come `column_1`. Ai nomi di tabelle o colonne duplicati viene aggiunto un numero, così puoi conservare entrambe le tabelle anche se i file hanno lo stesso nome.

Il convertitore riconosce le colonne numeriche e conserva gli zeri iniziali degli identificatori testuali come `00123`. Le celle vuote diventano valori SQL `NULL`. Le date di Excel vengono salvate come testo in formato ISO, sotto forma di date o timestamp. Per le celle con formule si usano i risultati salvati nella cartella di lavoro. Per aggiornarli, ricalcola le formule e salva il file in Excel prima della conversione.

## Interroga il risultato con SQL

Seleziona **Apri nel Visualizzatore SQLite** per sfogliare le tabelle ed eseguire query. Puoi anche scaricare il database `.sqlite` per usarlo con la riga di comando di SQLite, con Python o con un’altra applicazione compatibile. Per esempio, converti `orders.csv` e una cartella di lavoro Excel con un foglio chiamato `customers`, poi esegui questa query per contare gli ordini di ciascun cliente.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Per adattare l’esempio ai tuoi dati, usa i nomi di tabelle e colonne mostrati nell’anteprima.
