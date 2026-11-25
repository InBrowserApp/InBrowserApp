## Convertir un archivo Plist binario a JSON

Elige **Abrir Plist binario** o arrastra un archivo `.plist` binario de Apple. Revisa el JSON formateado, cópialo o descárgalo como archivo `.json`. Las listas de propiedades binarias empiezan con la firma `bplist00` y se usan en los paquetes de aplicaciones de Apple, las preferencias y los datos archivados. El ejemplo muestra cómo se representan en JSON los valores de una lista de propiedades.

## Convertir JSON en una lista de propiedades binaria de Apple

Elige **JSON a Plist**, pega JSON o abre un archivo `.json` y selecciona **Convertir a Plist binario**. Descarga el archivo `.plist` resultante. Las cadenas, los valores booleanos, los números, las matrices y los objetos se convierten a los tipos equivalentes de las listas de propiedades. Sustituye `null` por un valor u omite su clave. Los archivos y el texto que pegues se procesan en tu navegador.

## Conservar fechas, bytes y enteros grandes

JSON carece de tipos nativos para fechas, datos binarios y UID de archivos con claves. Este conversor usa etiquetas explícitas `$plist` para mantener el significado de esos valores al convertir en ambos sentidos.

| Valor Plist                      | Ejemplo en JSON                                        |
| -------------------------------- | ------------------------------------------------------ |
| Fecha en UTC                     | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bytes en Base64                  | `{"$plist":"data","value":"AQID"}`                     |
| Entero grande como texto decimal | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID de un archivo con claves     | `{"$plist":"uid","value":42}`                          |

Conserva las etiquetas al volver a convertir a Plist. Para enteros fuera del rango seguro de JSON, usa la etiqueta de entero y escribe el valor decimal entre comillas. Si un diccionario tiene la misma estructura que una etiqueta, el conversor lo envuelve con la etiqueta `dictionary` para conservar sus claves. La conversión conserva la estructura y los valores compatibles. El orden de los objetos Plist, el tamaño de almacenamiento de los números y los bytes originales pueden cambiar.

[Estructura y tipos de las listas de propiedades de Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
