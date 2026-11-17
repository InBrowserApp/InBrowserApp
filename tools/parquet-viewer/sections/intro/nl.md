## Inspecteer Parquet-bestanden in je browser

Open of sleep een `.parquet`-bestand om de gegevens te bekijken en het fysieke type, de logische annotatie en de herhaling van elk veld te inspecteren. Geneste groepen blijven zichtbaar in het schema. Het overzicht toont het aantal rijen, kolommen, rijgroepen, de compressie en het programma waarmee het bestand is gemaakt, indien beschikbaar. Je kunt het meegeleverde voorbeeld proberen zonder een bestand te kiezen.

## Blader door gegevens en exporteer CSV of JSON

Gegevens worden één pagina tegelijk geladen. Gebruik de paginabediening om door het bestand te bladeren en selecteer een cel om de volledige waarde te lezen. Schakel naar **Schema** om velden te inspecteren. Gebruik **Gegevens exporteren** om de huidige pagina of alle rijen te downloaden als UTF-8 CSV of een JSON-array. Exports van het hele bestand worden in batches voorbereid en kunnen worden geannuleerd.

CSV bevat kolomnamen en plaatst velden met komma’s, aanhalingstekens en regeleinden tussen aanhalingstekens. Null-waarden worden lege CSV-velden en blijven `null` in JSON. Geneste waarden gebruiken JSON; binaire waarden gebruiken hexadecimale tekst. Om 64-bits gehele getallen te behouden, schrijft JSON ze als tekenreeksen. Datums en tijdstempels gebruiken ISO-tekst, met millisecondeprecisie. Decimalen volgen de numerieke precisie van de lezer; deze viewer is daarom geen hulpmiddel voor verliesloze conversie van decimalen of tijdstempels met hoge precisie.

## Lokale verwerking

Je bestand wordt lokaal in een achtergrondworker gelezen en nooit geüpload. De viewer leest eerst de metadata in de footer en daarna alleen de rijbereiken die nodig zijn om te bladeren. Het decoderen van Parquet-rijgroepen kan nog steeds veel geheugen vereisen; de exportgrootte wordt beperkt door het beschikbare geheugen van je browser. hyparquet en het bijbehorende compressiepakket ondersteunen ongecomprimeerde gegevens en de codecs Snappy, Gzip, Brotli, Zstandard en LZ4. Versleutelde Parquet-bestanden worden niet ondersteund.
