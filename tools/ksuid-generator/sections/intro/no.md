Generer KSUID lokalt i nettleseren uten å sende den gjeldende batchen til en annen tjeneste. Dette verktøyet passer når du trenger identifikatorer som holder seg unike i distribuerte systemer og samtidig kan sorteres omtrent etter opprettelsestid i logger, strømmer, importer eller ordnede poster.

## Hvorfor Bruke KSUID

KSUID kombinerer et 32-bits tidsstempel med 128 bits tilfeldig data og koder resultatet som en Base62-streng på 27 tegn. Det gjør hver ID kompakt, URL-vennlig og enkel å lagre, samtidig som det innebygde tidsstempelet vanligvis plasserer nyere verdier etter eldre.

## Velg Nåværende Eller Egendefinert Tid

Bruk nåværende tid når du vil ha nye ID-er for produksjonsdata, demoer eller vanlig batchgenerering. Bytt til et egendefinert tidsstempel når du trenger reproduserbare fixtures, tilbakefylte poster, migreringseksempler eller testtilfeller som skal se ut som om de ble opprettet på et bestemt tidspunkt.

## Dette Bør Du Vite Før Eksport

KSUID beholder bare sekundpresisjon, så inndata med millisekunder rundes ned til starten av det sekundet. ID-er som opprettes i samme sekund, er fortsatt unike, men den endelige rekkefølgen påvirkes også av den tilfeldige payloaden. Tenk derfor på KSUID som tids-sorterbar, ikke som strengt sekvensiell.
