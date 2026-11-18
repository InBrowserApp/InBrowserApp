## Calcular la suma de verificación SHA-256 de un texto o archivo

Pega texto UTF-8 o selecciona **Importar desde archivo** para calcular el hash de los bytes originales del archivo. Copia el resultado hexadecimal para compararlo con una suma de verificación publicada. SHA-256 genera un hash de 256 bits que se muestra con 64 caracteres hexadecimales.

Para verificar una descarga, calcula el hash del archivo descargado y compara el valor hexadecimal completo con el publicado por la fuente. En el caso del texto, los espacios, las mayúsculas y los saltos de línea cambian el hash. Como prueba, el texto `abc` sin un salto de línea al final produce el siguiente resultado.

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```
