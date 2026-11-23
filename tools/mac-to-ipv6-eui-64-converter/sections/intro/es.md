## Cómo se forma la dirección

EUI-64 modificado inserta `ff:fe` entre las dos mitades de la dirección MAC e invierte el bit universal/local del primer byte. Por ejemplo, `00:11:22:33:44:55` se convierte en el identificador de interfaz `211:22ff:fe33:4455`. Con el prefijo `2001:db8:1:2::/64`, la dirección resultante es `2001:db8:1:2:211:22ff:fe33:4455`.

Introduce `fe80::/64` para obtener una dirección de enlace local. Para añadir el nombre de la interfaz, usa el [convertidor de enlace local](/es/tools/mac-address-to-ipv6-link-local-address-converter/). Si quieres configurar una dirección de unidifusión, usa un prefijo /64 asignado a tu red. El ejemplo usa un prefijo reservado para documentación.
