## Generar números ISBN-10 o ISBN-13 aleatorios

Elige `ISBN-13` para formularios actuales de catálogos y ventas de libros, o `ISBN-10` para registros antiguos. Indica una cantidad de `1` a `1000`, elige si quieres incluir guiones y selecciona **Generar**. Copia el lote o descarga un archivo TXT con un ISBN por línea.

## Entender el formato y el dígito de control

El número internacional normalizado del libro (ISBN) identifica la edición y el formato de un libro. Los valores `ISBN-13` generados usan el prefijo `978` y terminan en un dígito de control numérico. Un `ISBN-10` puede terminar en `X`, que representa diez en el cálculo de la suma de verificación. Dos ejemplos son `978-0-306-40615-7` y `0-8044-2957-X`. Los guiones facilitan la lectura de los grupos y no alteran el dígito de control.

## Usar los resultados como datos de prueba

Usa estos identificadores de ejemplo para probar formularios de catálogos, importaciones y la validación de ISBN. Para probar un error de suma de verificación, cambia solo el último carácter por otro dígito y vuelve a intentar la importación. En una hoja de cálculo o base de datos, guarda los ISBN como texto para conservar un cero inicial o una `X` final. Para un libro publicado, consulta el ISBN en la cubierta de la edición o en el registro de la editorial.
