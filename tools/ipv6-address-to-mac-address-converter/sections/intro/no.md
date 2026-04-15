## Hvordan konvertere IPv6 til MAC-adresse

Du kan bare hente tilbake en MAC-adresse fra en IPv6-adresse når
IPv6-grensesnittidentifikatoren er avledet fra den MAC-adressen med
EUI-64-metoden. Dette er vanligst for eldre link-local-adresser som starter
med `fe80::`, og for noen statsløst autokonfigurerte adresser.

### Når det fungerer

Denne omvendte konverteringen fungerer når de siste 64 bitene i IPv6-adressen
fortsatt inneholder en EUI-64-grensesnittidentifikator.

- Grensesnittidentifikatoren ble bygget fra en 48-bits MAC-adresse.
- Byteene i midten er fortsatt `ff:fe`.
- Adressen ble ikke opprettet med privacy extensions eller en annen
  randomiseringsmetode.

### Hvordan konverteringen fungerer

Konvertereren bygger opp MAC-adressen på nytt med disse trinnene:

1. Les de siste 64 bitene i IPv6-adressen.
2. Fjern de innsatte byteene `ff:fe` fra midten av
   grensesnittidentifikatoren.
3. Snu universal/local-biten i den første byten.
4. Formater de resterende 48 bitene som en standard MAC-adresse.

### Hvorfor ingen MAC vises

Du kan få tomt resultat av flere grunner:

- IPv6-adressen har ugyldig syntaks.
- Adressen er gyldig, men ble ikke laget fra en MAC-adresse med EUI-64.
- Adressen bruker privacy, stable-random, DHCPv6 eller en annen
  tildelingsmetode som ikke er MAC-basert.
