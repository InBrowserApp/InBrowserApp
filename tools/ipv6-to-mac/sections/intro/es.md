## Cómo convertir IPv6 a dirección MAC

Solo puedes recuperar una dirección MAC a partir de una dirección IPv6 cuando
el identificador de interfaz IPv6 se derivó de esa MAC mediante EUI-64. Esto
es más común en direcciones link-local antiguas que empiezan por `fe80::` y
en algunas direcciones autoconfiguradas sin estado.

### Cuándo funciona

Esta conversión inversa funciona cuando los últimos 64 bits de la dirección
IPv6 todavía contienen un identificador de interfaz EUI-64.

- El identificador de interfaz se construyó a partir de una MAC de 48 bits.
- Los bytes del medio siguen siendo `ff:fe`.
- La dirección no fue generada por extensiones de privacidad ni por otro
  esquema de aleatorización.

### Cómo funciona la conversión

El convertidor reconstruye la dirección MAC con estos pasos:

1. Lee los últimos 64 bits de la dirección IPv6.
2. Elimina los bytes `ff:fe` insertados en medio del identificador de interfaz.
3. Invierte el bit universal/local del primer byte.
4. Da formato a los 48 bits restantes como una dirección MAC estándar.

### Por qué no aparece una MAC

Puede que no obtengas un resultado por varias razones:

- La sintaxis de la dirección IPv6 no es válida.
- La dirección es válida, pero no se generó a partir de una MAC mediante
  EUI-64.
- La dirección usa privacidad, aleatorización estable, DHCPv6 u otro método
  de asignación no basado en MAC.
