## Hva Er en Max UUID?

En max UUID er den standardiserte UUID-en der alle 128 bit er satt til ett. Den kanoniske tekstformen er `ffffffff-ffff-ffff-ffff-ffffffffffff`, og den brukes ofte til å bety den høyest mulige UUID-verdien.

## Når Du Skal Bruke Den

Bruk en max UUID når et API, databasespørring, testoppsett eller områdekontroll trenger en UUID-formet øvre grense eller sentinelverdi. Den er nyttig i tester, migreringsskript, pagineringspekere og protokoller som definerer en eksplisitt maksimumsverdi for UUID.

## Hva Du Bør Passe På

Ikke behandle max UUID som en generert unik identifikator. Den er samme verdi hver gang, så hvis den lagres der en ekte objekt-ID forventes, kan den skjule sentinel-logikk, bryte antakelser om unikhet eller få poster til å sorteres uventet til slutten.
