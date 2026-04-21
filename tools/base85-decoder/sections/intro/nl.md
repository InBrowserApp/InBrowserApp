## Waarom Base85-decodering belangrijk is

Base85 komt voor wanneer binaire gegevens via tekstsystemen moeten worden doorgegeven met minder overhead dan hexadecimaal of Base64. Je kunt het tegenkomen in PostScript- of PDF-stromen, ZeroMQ Z85-payloads, debugging-captures, gearchiveerde exports en tools die afdrukbare tekens nodig hebben in plaats van ruwe binaire bytes.

## Waar deze decoder bij helpt

Deze tool zet ASCII85- of Z85-tekst direct in de browser terug naar de oorspronkelijke bytes. Je kunt gecodeerde gegevens plakken, een bestand importeren, van alfabet wisselen om het bronsysteem te matchen, het gedecodeerde resultaat bekijken en de herstelde binaire data downloaden zonder iets naar een server te sturen.

## Wat je moet onthouden

- ASCII85 en Z85 zijn niet uitwisselbaar. Het verkeerde alfabet kiezen veroorzaakt meestal decodeerfouten of corrupte uitvoer.
- Base85 is een coderingsformaat, geen versleuteling. Het gedecodeerde resultaat kan platte tekst, gecomprimeerde inhoud of willekeurige binaire data zijn.
- Z85 vereist volledige groepen van 5 tekens, terwijl ASCII85 ook scheidingstekens en verkorte notaties zoals `z` voor nulblokken kan bevatten.
