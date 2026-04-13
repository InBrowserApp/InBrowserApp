## Czym jest VIN?

VIN (Vehicle Identification Number) to 17-znakowy kod, który jednoznacznie identyfikuje pojazd.

- `1M8GDM9AXKP042788`
- Litery I, O, Q nie są używane
- 9. znak to cyfra kontrolna

### Struktura VIN

1. **WMI** (pozycje 1-3): World Manufacturer Identifier (identyfikator producenta)
2. **VDS** (pozycje 4-8): Vehicle Descriptor Section (sekcja opisu pojazdu)
3. **Cyfra kontrolna** (pozycja 9): obliczana na podstawie pozostałych znaków
4. **VIS** (pozycje 10-17): Vehicle Identifier Section (sekcja identyfikacji pojazdu)

### Cyfra kontrolna

Każda litera jest zamieniana na liczbę (A=1, B=2, ... z pominięciem I, O, Q). Każda pozycja ma przypisaną wagę. Suma ważona modulo 11 daje cyfrę kontrolną; wartość 10 jest reprezentowana przez X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = cyfra kontrolna`

To narzędzie sprawdza jedynie format i cyfrę kontrolną. Nie weryfikuje rzeczywistej rejestracji pojazdu.
