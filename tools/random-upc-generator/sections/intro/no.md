## Generer tilfeldige UPC-A-koder

Velg et antall fra `1` til `1000`, og velg **Generer**. Hver linje inneholder én 12-sifret UPC-A-kode. Velg **Kopier alle** for å lime inn kodene i et testskjema eller regneark, eller velg **Last ned TXT** for å lagre kodene som tekst.

## Forstå kontrollsifferet og innledende nuller

En UPC-A-strekkode representerer en 12-sifret produktidentifikator kalt `GTIN-12`. Det siste sifferet er kontrollsifferet, som beregnes fra de første 11 sifrene. I `084044127435` er den innledende `0` en del av koden, og den siste `5` er kontrollsifferet. Kontrollsifferet gjør den vektede summen av alle de 12 sifrene til et multiplum av ti.

## Bruk kodene til testing i varehandelen

Bruk disse eksempelkodene til å teste produktskjemaer, lagerimport eller UPC-validering. Lagre dem som tekst slik at eventuelle innledende nuller bevares. For å skrive ut et strekkodebilde til testing, limer du inn en generert kode i [strekkodegeneratoren](/tools/barcode-generator/) og velger `UPC`. For en faktisk produktoppføring eller emballasje bruker du GTIN-nummeret som er tildelt produktet.
