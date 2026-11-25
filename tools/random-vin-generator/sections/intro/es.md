## Generar VIN aleatorios para pruebas

Elige una cantidad entre `1` y `1000` y selecciona **Generar**. Cada línea contiene un número de identificación vehicular (VIN) de 17 caracteres. Selecciona **Copiar todo** para pegar el lote en un formulario de prueba o una hoja de cálculo, o **Descargar TXT** para guardar un archivo de texto con un VIN por línea.

## Interpretar el VIN y su dígito de control

Los tres primeros caracteres forman el identificador del fabricante. Los caracteres del cuarto al octavo describen el vehículo y el noveno es el dígito de control. Los últimos ocho caracteres forman la sección de identificación del vehículo. Se omiten las letras `I`, `O` y `Q` para evitar confundirlas con números. El dígito de control se calcula a partir de los otros 16 caracteres y puede ser un número de `0` a `9` o `X`. Por ejemplo, en `1M8GDM9AXKP042788`, el noveno carácter es `X`.

## Usar un VIN de ejemplo en un caso de prueba

Usa los VIN generados para probar campos obligatorios, importaciones masivas o la validación del formato y del dígito de control. Para probar el rechazo, cambia únicamente el noveno carácter por otro dígito y vuelve a enviar el valor. El generador produce VIN sintéticos, por lo que los campos que parecen indicar el fabricante, el año del modelo o el número de serie deben tratarse como datos de ejemplo. Para el registro, la búsqueda de piezas o el historial del vehículo, usa el VIN que figura en el vehículo o en sus documentos.
