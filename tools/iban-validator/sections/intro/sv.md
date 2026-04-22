## Vad är IBAN?

IBAN (International Bank Account Number) är en standardiserad identifierare för bankkonton som används vid internationella betalningar.

### IBAN-struktur

Ett IBAN börjar med en tvåbokstavskod för land, två kontrollsiffror och en landspecifik BBAN.

### Checksum-validering

IBAN:s giltighet kontrolleras med ISO 13616 mod-97-algoritmen.

1. Ta bort mellanslag och flytta de första fyra tecknen till slutet
2. Omvandla bokstäver till siffror (A=10, B=11, ..., Z=35)
3. Beräkna mod 97; ett giltigt IBAN ger resten 1

Varje land definierar en fast längd och struktur för BBAN-delen.
