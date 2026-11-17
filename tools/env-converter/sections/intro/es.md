## Convertir la configuración del entorno

Pega un archivo `.env` y elige JSON o YAML, o convierte un objeto JSON/YAML plano a `.env`. Importa archivos locales, intercambia la entrada y la salida, y copia o descarga el resultado. Todo se ejecuta en tu navegador; la configuración nunca se sube ni se guarda en el historial del navegador o en el almacenamiento local.

### Valores y comillas

Las variables de entorno son cadenas: `PORT=3000`, `DEBUG=false` y `CODE=0012` se mantienen como `"3000"`, `"false"` y `"0012"`. Los números y booleanos de JSON/YAML se convierten en cadenas. Null, los arrays y los objetos anidados necesitan un valor de cadena explícito. Pon entre comillas valores YAML como `0012` cuando importe su representación exacta.

El analizador admite líneas en blanco, comentarios con `#`, un prefijo `export` y comillas simples, dobles o invertidas con valores de varias líneas. Solo se expanden las secuencias `\n` y `\r` entre comillas dobles. Las demás comillas y barras invertidas se mantienen literalmente, siguiendo el comportamiento habitual de dotenv. Las claves usan letras, dígitos y guiones bajos y no pueden empezar por un dígito. La salida elige un estilo de comillas que conserve el valor.

### Comprobaciones de configuración

Las claves `.env` duplicadas muestran sus números de línea; se usa la última definición. Las comillas sin cerrar, el texto después de las comillas de cierre y las asignaciones no válidas muestran errores con enlaces a la línea afectada. Las comillas tipográficas generan una advertencia. Las claves duplicadas en JSON/YAML son errores.

Los comentarios, el estilo de comillas original y el formato no se conservan. Las referencias como `${NAME}` y los comandos de shell se mantienen literalmente y nunca se ejecutan. Los distintos cargadores de `.env` tienen reglas diferentes; esta herramienta sigue el subconjunto documentado en lugar de interpretar scripts de shell.

Consulta la [especificación de .env de Node.js](https://nodejs.org/api/environment_variables.html#dotenv) y las [reglas de análisis de dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
