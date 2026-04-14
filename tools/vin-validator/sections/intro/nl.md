## Wat is een VIN?

Een voertuigidentificatienummer (VIN) is een code van 17 tekens die een voertuig uniek identificeert.

- `1M8GDM9AXKP042788`
- De letters I, O en Q worden niet gebruikt
- Het 9e teken is een controlecijfer

### VIN-structuur

1. **WMI** (positie 1-3): World Manufacturer Identifier (wereldwijde fabrikantcode)
2. **VDS** (positie 4-8): Vehicle Descriptor Section (voertuigbeschrijving)
3. **Controlecijfer** (positie 9): berekend op basis van alle andere tekens
4. **VIS** (positie 10-17): Vehicle Identifier Section (voertuigidentificatie)

### Controlecijfer

Elke letter wordt omgezet naar een getal (A=1, B=2, ... waarbij I, O en Q worden overgeslagen). Elke positie heeft een wegingsfactor. De gewogen som modulo 11 levert het controlecijfer op; 10 wordt weergegeven als X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = controlecijfer`

Deze tool valideert alleen de opmaak en controlecijferregels. Registratie in de echte wereld wordt niet gecontroleerd.
