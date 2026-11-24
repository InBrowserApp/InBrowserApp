## Convertir JSON en una hoja de cálculo de Excel

Pega un array JSON o abre un archivo `.json` local, revisa la vista previa y haz clic en **Descargar XLSX**. El conversor crea una hoja de cálculo con una fila de encabezados. Cada objeto ocupa una fila y todos los campos que aparezcan en el array se incluyen como columnas. Así puedes preparar para Excel los registros de una API, una lista de productos o una exportación de datos. Si la respuesta de la API contiene los registros dentro de un campo como `data`, pega el array de ese campo.

## Expandir campos JSON anidados en columnas

La opción **Expandir campos anidados** está activada de forma predeterminada. Por ejemplo, los dos registros siguientes generan las columnas `name`, `contact.city` y `tags`.

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

Al desactivar la opción, `contact` ocupa una sola columna con texto JSON como `{"city":"Oslo"}`. Los arrays quedan en una sola celda en ambos modos, de modo que `tags` no añade filas. Los campos que faltan o tienen el valor `null` se muestran como celdas en blanco.

## Cómo guarda Excel los valores JSON

Los números y los booleanos suelen convertirse en números y valores lógicos de Excel. Los números que quedan fuera de la precisión o del rango de Excel se guardan como texto para conservar sus dígitos. Las cadenas JSON siguen siendo texto, por lo que los identificadores como `"00123"`, las fechas escritas como cadenas y los textos que empiezan por `=` conservan sus caracteres originales.

## Vista previa y descarga desde el navegador

La vista previa muestra la primera parte de la hoja. El archivo XLSX descargado incluye todos los registros y columnas. La conversión se ejecuta en tu navegador y tus datos JSON se quedan en tu dispositivo. Para exportar a texto sin formato, usa el [Convertidor JSON → CSV](../json-to-csv-converter/).
