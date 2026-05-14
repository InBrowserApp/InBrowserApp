## ¿Qué es bcrypt?

bcrypt es un algoritmo de hashing de contraseñas diseñado para almacenar contraseñas. Combina la contraseña con una sal aleatoria y repite trabajo costoso según un factor de coste, de modo que los atacantes necesiten más tiempo para probar cada intento.

## Cuándo usar esta herramienta

- Genera un hash bcrypt para una cuenta de prueba, un script de seed o un entorno de desarrollo local.
- Compara cómo distintos factores de coste cambian el formato de salida y el tiempo de ejecución.
- Crea un hash listo para copiar sin enviar la contraseña a un servidor.

## Cómo elegir el factor de coste

Los valores de coste más altos son más lentos y suelen ser más seguros, pero también hacen que cada intento de inicio de sesión sea más lento para tu aplicación. Un coste de alrededor de 10-12 es habitual en sistemas interactivos; los valores más altos pueden ser razonables para flujos de trabajo solo de administradores o de bajo volumen. Prueba el coste en el mismo tipo de hardware que verificará la contraseña.

## Qué debes tener en cuenta

- Cada hash generado usa una sal aleatoria nueva, por lo que la salida cambia incluso cuando la contraseña y el coste siguen siendo los mismos.
- Almacena el hash bcrypt, no la contraseña original.
- Usa bcrypt para contraseñas, no para sumas de comprobación de archivos, firmas ni hashing general.
- Mantén constante el comportamiento de verificación y evita revelar si existe una cuenta de usuario.
