## Cómo planificar subredes IPv4 con VLSM

Introduce el bloque principal en notación CIDR, por ejemplo 192.168.10.0/24. Añade una fila por red e indica cuántas direcciones de host necesita, incluidas las que quieras reservar para una puerta de enlace o futuras ampliaciones. Calcula el plan para ver cada red asignada con su máscara, rango de IP utilizables y dirección de difusión, además de los bloques CIDR que quedan disponibles.

Las máscaras de subred de longitud variable (VLSM) permiten dividir una red en subredes de distinto tamaño. La calculadora elige el bloque más pequeño que cubre cada necesidad y asigna primero los bloques mayores, alineándolos según su prefijo CIDR. Una subred estándar reserva las direcciones de red y de difusión. Por ejemplo, 50 hosts caben en un bloque /26 con 62 direcciones utilizables.

Elige un prefijo /31 solo para enlaces IPv4 punto a punto que admitan dos direcciones utilizables. Usa un /32 para una sola dirección, como la de una interfaz de bucle local (loopback) de un router. Ninguna de las dos opciones tiene dirección de difusión. El cálculo se realiza en tu navegador y los nombres de las subredes permanecen en él.
