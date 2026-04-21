Convierte enteros entre binario, octal, decimal, hexadecimal, Base32, Base36, Base62, Base64 y bases personalizadas de 2 a 64 directamente en el navegador. Todo se calcula localmente con BigInt, así que puedes inspeccionar valores grandes sin enviarlos a un servidor.

## Cuándo usarlo

Úsalo cuando el mismo entero aparezca en registros, protocolos, identificadores o especificaciones con alfabetos distintos. Al editar cualquier campo, los demás se recalculan al instante, lo que resulta útil para depurar, documentar y verificar manualmente.

## Diferencias entre bases

Hasta base 36, las letras se aceptan sin distinguir mayúsculas y minúsculas. Las bases mayores tratan mayúsculas y minúsculas como dígitos distintos, y la fila Base64 usa el alfabeto numérico `A-Z a-z 0-9 + /`, no la codificación Base64 orientada a bytes.

## Qué tener en cuenta

Solo se admiten enteros no negativos. Los ceros iniciales se tratan como formato, así que la salida convertida se normaliza y puede perder el relleno que escribiste.
