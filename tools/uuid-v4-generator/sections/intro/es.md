Genera un UUID v4 localmente en tu navegador cuando necesites un identificador
nuevo para registros de prueba, filas de bases de datos, ejemplos de API, cargas
de eventos, fixtures o archivos de configuración. La herramienta crea un UUID
canónico en minúsculas a la vez para mantenerse centrada en el flujo de trabajo
de un solo valor, sin solaparse con el generador por lotes independiente.

## Qué Significa UUID v4

Un UUID v4 es un identificador de 128 bits en el que los bits de versión y
variante son fijos, y los 122 bits restantes provienen de datos aleatorios. Eso
lo hace útil cuando necesitas identificadores que no revelen la hora de
creación, información de la máquina, contadores de secuencia ni detalles del
usuario.

## Cuándo Usarlo

Usa UUID v4 para IDs generados por el cliente, objetos simulados, registros
temporales, ejemplos públicos y sistemas distribuidos donde coordinar un
contador central sería incómodo. Es una buena opción predeterminada cuando el
orden de clasificación no es importante y solo necesitas un identificador con
baja probabilidad de colisión.

## Privacidad Y Fiabilidad

La generación se ejecuta en esta pestaña del navegador con Web Crypto, por lo
que el UUID no se envía a InBrowser.App ni a otro servicio. Copia el valor cuando
se vea correcto y vuelve a generarlo cada vez que necesites un identificador
nuevo para el siguiente registro o ejemplo.
