Generer en gruppe UUID v4-identifikatorer direkte i nettleseren når du trenger tilfeldige ID-er for databaserader, API-fixtures, objektnøkler, testdata, importmaler eller enkeltstående driftsoppgaver.

## Hva UUID v4 gir

UUID v4 er en 128-biters identifikator som hovedsakelig bygges fra kryptografisk sikre tilfeldige byte. Versjons- og variantbitene er fastsatt av RFC 4122-oppsettet, så en UUID v4 har den kjente formen `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` samtidig som den fortsatt har et svært stort tilfeldig rom.

## Velg en praktisk gruppestørrelse

Standardgruppen gir deg nok ID-er for mange fixture- og regnearkarbeidsflyter uten at siden blir vanskelig å skanne. Øk antallet når du forbereder en større import, eller reduser det når du bare trenger noen få identifikatorer for et forespørselseksempel eller en manuell databaseendring.

## Kopier eller eksporter

Se gjennom den genererte listen, og kopier den deretter inn i editoren din eller last ned en ren tekstfil. Hver verdi genereres lokalt, og den gjeldende gruppen lastes aldri opp av dette verktøyet.

## Kollisjonsveiledning

Kollisjonsrisikoen for UUID v4 er ekstremt lav for vanlige applikasjonsbelastninger, men det er ikke en erstatning for en unikhetsbegrensning i databasen. Fortsett å håndheve unikhet der ID-en blir en primærnøkkel, offentlig token eller varig referanse.
