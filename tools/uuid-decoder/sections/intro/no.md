# Hva er en UUID-dekoder?

En UUID-dekoder forklarer strukturen inne i en universelt unik identifikator. Den normaliserer vanlige formater som limes inn, sjekker at verdien er en 128-biters UUID, og viser versjon, variant, rå heksadesimale byte og kopieringsklare numeriske representasjoner.

UUID-er behandles ofte som ugjennomsiktige strenger, men versjonsnibbelen forteller hvordan identifikatoren ble laget. Versjon 4-UUID-er er tilfeldige, versjon 3 og 5 er navnebaserte hasher, og tidsordnede versjoner som 1, 6 og 7 kan inneholde tidsstempelinformasjon.

## Når bør du bruke den

Bruk dette verktøyet når du må inspisere en identifikator fra logger, databaser, API-er, sporingsdata eller testfiksturer. Det er nyttig for å bekrefte om en UUID er tilfeldig eller tidsbasert, konvertere den til desimal eller Base64 for et annet system, og oppdage om nodefeltet i en UUID v1 eller v6 kan eksponere en MAC-lignende identifikator.

Dekoderen kjører i nettleseren din og sender ikke UUID-verdier til en server. Den godtar kanoniske UUID-er, `urn:uuid:`-verdier, UUID-er med krøllparenteser, inndata med store bokstaver og heksadesimale UUID-er på 32 tegn uten bindestreker.

## Hva bør du være oppmerksom på

UUID-versjons- og variantfelt beskriver bitoppsettet, ikke om identifikatoren faktisk er globalt unik i praksis. En UUID som ser gyldig ut, kan fortsatt være duplisert hvis den ble generert dårlig eller kopiert ved en feil.

For UUID-er i versjon 1 og versjon 6 kan nodefeltet se ut som en MAC-adresse. Moderne generatorer kan i stedet sette multicast-biten og bruke en tilfeldig node, så behandle det som en nodeidentifikator med mindre du kontrollerer generatoren.
