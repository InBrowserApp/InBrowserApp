## Hva er IBAN?

IBAN (International Bank Account Number) er en standardisert identifikator for bankkontoer som brukes ved internasjonale betalinger.

### IBAN-struktur

En IBAN starter med en todelt landskode, to kontrollsifre og en landspesifikk BBAN.

### Checksum-validering

IBANs gyldighet kontrolleres med ISO 13616 mod-97-algoritmen.

1. Fjern mellomrom og flytt de fire første tegnene til slutten
2. Konverter bokstaver til tall (A=10, B=11, ..., Z=35)
3. Beregn mod 97; et gyldig IBAN gir resten 1

Hvert land definerer en fast lengde og struktur for BBAN-delen.
