## Convertire JSON in un foglio di calcolo Excel

Incolla un array JSON o apri un file `.json` locale, controlla l’anteprima e seleziona **Scarica XLSX**. Il convertitore crea un foglio di lavoro con una riga di intestazione. Ogni oggetto occupa una riga e tutti i campi presenti nell’array diventano colonne. Puoi usarlo per preparare record di un’API, elenchi di prodotti e dati esportati. Se la risposta di un’API contiene i record in un campo come `data`, incolla l’array contenuto in quel campo.

## Espandere i campi JSON annidati in colonne

L’opzione **Espandi i campi annidati** è attiva per impostazione predefinita. Ad esempio, i due record qui sotto producono le colonne `name`, `contact.city` e `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Se disattivi l’opzione, `contact` resta in una sola colonna come testo JSON, ad esempio `{"city":"Oslo"}`. In entrambi i casi ogni array resta in una sola cella, quindi `tags` non aggiunge righe. I campi mancanti o con valore `null` corrispondono a celle vuote.

## Come Excel conserva i valori JSON

Excel conserva di norma i numeri come valori numerici e i booleani come valori logici. I numeri che superano la precisione o l’intervallo di valori di Excel vengono salvati come testo per preservarne le cifre. Le stringhe JSON restano testo, quindi gli identificativi come `"00123"`, le date scritte come stringhe e il testo che inizia con `=` mantengono i caratteri originali.

## Anteprima e download nel browser

L’anteprima mostra la parte iniziale del foglio. Il file XLSX scaricato include tutti i record e tutte le colonne. La conversione avviene nel browser e i dati JSON restano sul tuo dispositivo. Per esportare come testo semplice, usa il [Convertitore JSON → CSV](../json-to-csv-converter/).
