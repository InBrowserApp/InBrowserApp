## Convertire un file Plist binario in JSON

Scegli **Apri Plist binario** o trascina qui un file `.plist` binario di Apple. Controlla il JSON formattato, copialo o scaricalo come file `.json`. Gli elenchi di proprietà binari iniziano con la firma `bplist00` e si trovano nei pacchetti delle app Apple, nelle preferenze e nei dati archiviati. L’esempio mostra come vengono rappresentati in JSON i valori di un elenco di proprietà.

## Convertire JSON in un elenco di proprietà binario di Apple

Scegli **JSON in Plist**, incolla il JSON o apri un file `.json`, poi scegli **Converti in Plist binario**. Scarica il file `.plist` ottenuto. Stringhe, booleani, numeri, array e oggetti vengono convertiti nei tipi corrispondenti degli elenchi di proprietà. Sostituisci `null` con un valore o ometti la relativa chiave. I file e il testo incollato vengono elaborati nel browser.

## Conservare date, byte e numeri interi grandi

JSON non ha tipi nativi per date, dati binari o UID di archivi con chiavi. Il convertitore usa tag espliciti `$plist` per conservare il significato di questi valori in entrambe le direzioni.

| Valore Plist                           | Esempio JSON                                           |
| -------------------------------------- | ------------------------------------------------------ |
| Data in UTC                            | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Byte in Base64                         | `{"$plist":"data","value":"AQID"}`                     |
| Intero grande come testo decimale      | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID di un archivio con chiavi          | `{"$plist":"uid","value":42}`                          |
| Numero reale di grande valore assoluto | `{"$plist":"real","value":"1e+100"}`                   |

Mantieni i tag quando riconverti in Plist. Per gli interi fuori dall’intervallo sicuro di JSON, usa il tag per gli interi e scrivi il valore decimale tra virgolette. Se un dizionario ha la stessa struttura di un tag, il convertitore lo racchiude in un tag `dictionary` per conservarne le chiavi. La conversione conserva la struttura e i valori supportati. L’ordine degli oggetti Plist, il tipo numerico dei reali a valore intero come `1.0` e i byte originali possono cambiare.

[Struttura e tipi degli elenchi di proprietà Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
