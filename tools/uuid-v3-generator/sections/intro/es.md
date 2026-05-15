## ¿Qué es UUID v3?

UUID v3 es un formato UUID basado en nombre. Toma un UUID de espacio de
nombres y un nombre, calcula su hash con MD5 y da formato al resultado como un
UUID estándar. El comportamiento importante es el determinismo: el mismo
espacio de nombres y el mismo nombre siempre producen el mismo UUID.

Esta herramienta se ejecuta íntegramente en tu navegador. El espacio de
nombres, el nombre y el UUID generado permanecen en tu dispositivo salvo que
copies el resultado en otro lugar.

## Cuándo usarlo

- Usa UUID v3 cuando necesites un identificador estable para un nombre conocido,
  como un nombre DNS, URL, ruta de objeto o nombre de usuario.
- Elige el espacio de nombres que coincida con el tipo de nombre que estás
  identificando. DNS y URL son los ajustes predefinidos más comunes.
- Reutiliza siempre el mismo espacio de nombres. Cambiar el espacio de nombres
  cambia todos los UUID generados, incluso cuando el nombre sigue siendo el
  mismo.
- Prefiere UUID v5 u otro identificador moderno cuando puedas elegir y necesites
  un UUID basado en nombre con un hash más fuerte. UUID v3 existe por
  compatibilidad con sistemas que esperan específicamente UUID basados en MD5.

## Notas sobre seguridad

UUID v3 no es un ID aleatorio ni secreto. Cualquiera que conozca el espacio de
nombres y el nombre puede volver a generar el mismo UUID. No lo uses para
contraseñas, tokens de sesión, claves de API u otros valores que deban ser
impredecibles.
