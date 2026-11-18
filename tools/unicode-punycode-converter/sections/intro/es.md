## Convertir dominios Unicode a Punycode y viceversa

Pega un dominio como `bücher.com` en **Dominio Unicode** para obtener `xn--bcher-kva.com` en **Dominio ASCII**. Pega un dominio con prefijo `xn--` en **Dominio ASCII** para leerlo en Unicode. Los campos se actualizan mientras escribes y puedes copiar cualquiera de las dos versiones.

## Cuándo usar cada versión

Punycode representa los caracteres no ASCII de los nombres de dominio internacionalizados (IDN) mediante letras, dígitos y guiones ASCII. Una etiqueta convertida comienza por `xn--`. Las etiquetas que ya están en ASCII, como `com`, se conservan. Usa la versión ASCII en los ajustes de DNS o alojamiento que la soliciten. Usa la versión Unicode para leer un dominio de un registro o de un archivo de configuración.

## Qué pegar en el convertidor

Introduce solo el nombre de host. Para `https://bücher.com/catalog`, pega `bücher.com`. También puedes convertir subdominios. Por ejemplo, `www.bücher.com` se convierte en `www.xn--bcher-kva.com`.
