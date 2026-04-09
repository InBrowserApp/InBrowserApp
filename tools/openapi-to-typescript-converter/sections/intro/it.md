## Cos'è OpenAPI To TypeScript Converter?

OpenAPI to TypeScript Converter trasforma un documento OpenAPI 3.x in tipi TypeScript generati direttamente nel browser. È utile quando vuoi un'anteprima rapida dei tipi, un file di dichiarazione scaricabile o un modo sicuro per provare le opzioni di `openapi-typescript` senza inviare lo schema a un server.

## Quando Usarlo

Usa questo strumento quando hai già uno schema OpenAPI in JSON o YAML e vuoi modelli tipizzati di richieste e risposte per app frontend, prototipi di SDK o revisioni delle API. È particolarmente utile per confrontare le opzioni di generazione prima di salvare l'output nel repository.

## Prima Di Generare

Questa riscrittura nel browser supporta documenti OpenAPI 3.0 e 3.1 raggruppati. Se lo schema contiene ancora target `$ref` esterni, raggruppali o incorporali prima, poi genera qui l'output TypeScript finale.
