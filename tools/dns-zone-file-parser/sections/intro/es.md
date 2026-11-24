## Cómo leer un archivo de zona DNS

Abre una exportación DNS en formato BIND o pega el texto. Carga el ejemplo para ver un registro SOA, registros de direcciones IPv4 e IPv6, registros de correo y una cadena TXT. Cada fila muestra el nombre, la clase, el tipo, el tiempo de vida en segundos y los datos del registro. Filtra por nombre, por un tipo como MX o por parte de un valor. Después, copia los registros visibles en formato JSON para un inventario o una migración.

## Cómo se interpretan el origen, el TTL y los datos

Si `$ORIGIN` es `example.com.`, el nombre relativo `www` se interpreta como `www.example.com.`. El símbolo `@` representa el origen actual y una línea con sangría hereda el nombre del registro anterior. Si el archivo carece de `$ORIGIN`, indica el dominio en Origen inicial. Un `$TTL` predeterminado de `1h` equivale a 3600 segundos. Si un registro tiene su propio TTL, se usa ese valor. Los datos del registro conservan las comillas, los caracteres de escape y los destinos relativos tal como aparecen en el archivo. Así, `"hello; world"` sigue siendo un solo valor TXT y `mail` sigue siendo `mail` en los datos de un registro MX.

## Qué muestran los resultados

El analizador admite comentarios, texto entre comillas y registros de varias líneas. Si detecta un problema, indica el número de línea y muestra los registros que pudo leer. Si la zona usa `$INCLUDE` o `$GENERATE`, expande esas directivas y pega los registros completos. El análisis se realiza en tu navegador, sin consultar servidores DNS ni comprobar si un proveedor concreto puede cargar la zona.
