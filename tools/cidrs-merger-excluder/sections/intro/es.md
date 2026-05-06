## Qué hace esta herramienta

Esta herramienta combina bloques CIDR en el conjunto equivalente más pequeño y luego resta cualquier bloque CIDR que pongas en la lista de exclusión. Admite IPv4 e IPv6 en la misma ejecución, y todo el procesamiento ocurre localmente en tu navegador.

## Cómo funcionan la fusión y la exclusión

Primero se normaliza la lista de fusión: se borran los bits de host, las redes solapadas se combinan y las redes adyacentes se contraen cuando pueden representarse con un bloque CIDR más corto. Después, la lista de exclusión se resta de los rangos fusionados. La salida final se expande de nuevo en la lista CIDR mínima que cubre exactamente lo que queda.

## Cuándo resulta útil

Úsala al depurar reglas de firewall, preparar entradas de grupos de seguridad en la nube, revisar listas de permitidos de VPN, resumir tablas de rutas o eliminar rangos reservados de una asignación mayor. Es especialmente útil cuando una configuración copiada contiene bloques solapados o cuando una red amplia necesita que se eliminen algunos rangos más pequeños.

## Notas de entrada

Introduce un CIDR por línea, o separa varios CIDR con comas. Los bloques IPv4 e IPv6 se pueden pegar juntos, pero las exclusiones solo se aplican a bloques de la misma familia de direcciones. Las entradas no válidas se informan con su lista y número de línea para que puedas corregir entradas grandes pegadas sin tener que adivinar.
