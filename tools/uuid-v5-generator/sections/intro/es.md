Genera identificadores UUID v5 a partir de un UUID de espacio de nombres y un nombre sin enviar ninguno de los valores a un servidor. UUID v5 es útil cuando necesitas un identificador estable que pueda recrearse más adelante a partir de la misma entrada, como un ID para un nombre de dominio, URL, ruta de objeto, identificador de cuenta o registro de prueba.

## Cómo funciona UUID v5

UUID v5 combina un UUID de espacio de nombres con una cadena de nombre, calcula el hash de esos bytes con SHA-1 y luego aplica los bits de versión y variante de RFC 4122. Como la entrada es determinista, `example.com` dentro del espacio de nombres DNS siempre produce el mismo UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Elegir un espacio de nombres

Usa `ns:DNS` para nombres de dominio, `ns:URL` para URLs, `ns:OID` para identificadores de objeto y `ns:X.500 DN` para nombres distinguidos X.500. También puedes pegar tu propio espacio de nombres UUID cuando tu aplicación necesite identificadores limitados a un producto, inquilino, conjunto de datos o migración.

## Cuándo usarlo

Elige UUID v5 cuando la reproducibilidad importe más que la aleatoriedad. Es una buena opción para importaciones deterministas, datos de prueba, registros con espacio de nombres y sistemas que necesitan que el mismo elemento lógico reciba el mismo ID en distintas ejecuciones. Para tokens secretos o ID públicos impredecibles, usa en su lugar un generador aleatorio.
