## ¿Qué es un VIN?

Un Número de Identificación Vehicular (VIN) es un código de 17 caracteres que identifica de forma única a un vehículo.

- `1M8GDM9AXKP042788`
- Las letras I, O, Q no se utilizan
- El noveno carácter es un dígito de control

### Estructura del VIN

1. **WMI** (posiciones 1-3): Identificador Mundial del Fabricante
2. **VDS** (posiciones 4-8): Sección Descriptora del Vehículo
3. **Dígito de control** (posición 9): calculado a partir de todos los demás caracteres
4. **VIS** (posiciones 10-17): Sección Identificadora del Vehículo

### Dígito de control

Cada letra se translitéra a un número (A=1, B=2, ... omitiendo I, O, Q). Cada posición tiene un peso. La suma ponderada módulo 11 da el dígito de control; el 10 se representa con X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = dígito de control`

Esta herramienta solo valida el formato y las reglas del dígito de control. No verifica el registro real del vehículo.
