## Hva er en nil-UUID?

En nil-UUID er den standardiserte UUID-en der alle 128 biter er null. Den kanoniske tekstformen er `00000000-0000-0000-0000-000000000000`, og den brukes ofte til å bety at "ingen UUID er tildelt ennå."

## Når du bør bruke den

Bruk en nil-UUID når et API, en databasekolonne, en testfikstur eller en konfigurasjonsfil krever en verdi formet som en UUID, men den faktiske identifikatoren med hensikt mangler. Den er nyttig som plassholder i tester, importmaler, migreringsskript og protokoller som definerer en eksplisitt tom UUID-verdi.

## Hva du bør passe på

Ikke behandle nil-UUID-en som en generert unik identifikator. Den er samme verdi hver gang, så å lagre den der en ekte objekt-ID forventes, kan skjule manglende data, bryte antakelser om unikhet eller få poster til å se koblet ut når de ikke er det.
