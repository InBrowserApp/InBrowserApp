CIDR Parser convierte un bloque como `10.24.8.19/21` o `2001:db8:abcd::123/64` en la red que realmente quieres usar. Normaliza entradas con dirección de host, muestra la subred canónica y expone los límites que normalmente necesitas al escribir reglas de firewall, documentar rangos o comprobar si una asignación es demasiado grande.

## Qué muestra

El resultado empieza con un resumen rápido y después divide el bloque en detalles prácticos: CIDR canónico, recuentos de direcciones totales y utilizables, inicio y fin del rango, además de los valores enteros del bloque. Para IPv4 también muestra la máscara de red, la máscara wildcard y la dirección de broadcast. Para IPv6 mantiene el mismo flujo y oculta los campos que no aplican.

## Por qué importa la canonicalización

Muchos valores CIDR pegados incluyen bits de host. Eso está bien para personas, pero routers, ACLs y documentación suelen necesitar la dirección de red canónica. Al reescribir el bloque antes de copiar cualquier dato, la herramienta ayuda a detectar supuestos off-by-one antes de que lleguen a la configuración.

## Notas prácticas

- Los bloques IPv4 `/31` y `/32` se tratan como completamente utilizables, coherente con usos modernos punto a punto y host-route.
- Los bloques IPv6 muestran todo el espacio de direcciones y el rango utilizable sin inventar un concepto de broadcast.
- Todo se ejecuta localmente en el navegador, por lo que las subredes internas no salen de la página mientras las inspeccionas.
