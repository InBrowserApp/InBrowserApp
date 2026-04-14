## Was ist eine VIN?

Eine Fahrzeug-Identifizierungsnummer (VIN) ist ein 17-stelliger Code, der ein Fahrzeug eindeutig identifiziert.

- `1M8GDM9AXKP042788`
- Die Buchstaben I, O, Q werden nicht verwendet
- Das 9. Zeichen ist eine Pr\u00fcfziffer

### Aufbau der VIN

1. **WMI** (Positionen 1-3): Weltherstellerkennung (World Manufacturer Identifier)
2. **VDS** (Positionen 4-8): Fahrzeugbeschreibungsteil (Vehicle Descriptor Section)
3. **Pr\u00fcfziffer** (Position 9): wird aus allen anderen Zeichen berechnet
4. **VIS** (Positionen 10-17): Fahrzeugkennzeichnungsteil (Vehicle Identifier Section)

### Pr\u00fcfziffer

Jeder Buchstabe wird in eine Zahl umgewandelt (A=1, B=2, \u2026 I, O, Q werden \u00fcbersprungen). Jede Position hat eine Gewichtung. Die gewichtete Summe modulo 11 ergibt die Pr\u00fcfziffer; 10 wird durch X dargestellt.

`(w1\u00d7v1 + w2\u00d7v2 + ... + w17\u00d7v17) mod 11 = Pr\u00fcfziffer`

Dieses Tool validiert ausschlie\u00dflich Format- und Pr\u00fcfzifferregeln. Es \u00fcberpr\u00fcft keine reale Fahrzeugzulassung.
