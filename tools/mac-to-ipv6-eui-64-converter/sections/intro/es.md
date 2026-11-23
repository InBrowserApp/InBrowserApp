## Cómo convertir una dirección MAC a IPv6

Introduce una dirección MAC de 48 bits con dos puntos, guiones, puntos o sin separadores. Añade el prefijo de red IPv6 `/64` que quieras usar. El convertidor admite la notación abreviada y la completa. Todos los bits de host del prefijo deben estar a cero. La dirección IPv6 se actualiza mientras escribes y queda lista para copiar. El botón **Probar un ejemplo** rellena ambos campos.

## Cómo se forma la dirección con EUI-64 modificado

En una subred `/64`, el prefijo de red aporta los primeros 64 bits y el identificador de interfaz, los últimos 64. EUI-64 modificado inserta `ff:fe` entre las dos mitades de la dirección MAC e invierte el bit universal/local del primer byte. Por ejemplo, `00:11:22:33:44:55` se convierte en el identificador de interfaz `211:22ff:fe33:4455`. Con el prefijo `2001:db8:1:2::/64`, la dirección resultante es `2001:db8:1:2:211:22ff:fe33:4455`.

## Prefijos IPv6 habituales

- **Enlace local.** Usa `fe80::/64` para comunicarte en el mismo enlace. El botón **Usar prefijo de enlace local** rellena el prefijo y conserva la dirección MAC que introdujiste. Para añadir un nombre de interfaz como `%eth0`, usa el [convertidor de IPv6 de enlace local](/es/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Dirección local única (ULA).** El botón **Usar ejemplo ULA** rellena `fd12:3456:789a:1::/64`, un ejemplo del rango `fd00::/8` destinado a redes internas. Para crear un prefijo único para tu red, usa el [generador de ULA IPv6](/es/tools/ipv6-ula-generator/).
- **Unidifusión global.** Introduce una subred `/64` del bloque que te haya asignado tu proveedor de Internet, tu proveedor de servicios en la nube o el administrador de tu red.
- **Documentación.** El prefijo `2001:db8:1:2::/64` pertenece al rango `2001:db8::/32`, reservado para documentación y ejemplos.

## ¿Coincidirá con la dirección IPv6 de mi dispositivo?

El resultado es la dirección que EUI-64 modificado genera para tu prefijo. Un dispositivo puede usar otro identificador de interfaz, como uno estable o temporal generado para proteger la privacidad. Si ya tienes una dirección IPv6 con un identificador de interfaz derivado de una dirección MAC, puedes recuperar la MAC con el [convertidor de IPv6 a MAC](/es/tools/ipv6-address-to-mac-address-converter/).
