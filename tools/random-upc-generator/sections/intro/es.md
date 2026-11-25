## Generar códigos UPC-A aleatorios

Indica una cantidad entre `1` y `1000` y selecciona **Generar**. Cada línea contiene un código UPC-A de 12 dígitos. Selecciona **Copiar todo** para pegar el lote en un formulario de prueba o una hoja de cálculo, o **Descargar TXT** para guardar los códigos como texto.

## Interpretar el dígito de control y los ceros iniciales

Un código de barras UPC-A representa un identificador de producto de 12 dígitos denominado `GTIN-12`. El último dígito es el dígito de control, calculado a partir de los primeros 11. En `084044127435`, el `0` inicial forma parte del código y el `5` final es su dígito de control. Este hace que la suma ponderada de los 12 dígitos sea un múltiplo de diez.

## Usar los códigos para pruebas comerciales

Usa estos códigos de ejemplo para probar formularios de productos, importaciones de inventario o la validación de UPC. Guárdalos como texto para conservar los ceros iniciales. Para imprimir una imagen de código de barras de prueba, pega un código generado en el [Generador de Códigos de Barras](/es/tools/barcode-generator/) y selecciona `UPC`. Para una ficha de producto real o su embalaje, utiliza el GTIN asignado al producto.
