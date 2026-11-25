## Generera slumpmässiga VIN för testning

Ange antalet från `1` till `1000` och välj sedan **Generera**. Varje rad innehåller ett fordonsidentifieringsnummer (VIN) med 17 tecken. Välj **Kopiera alla** för att klistra in alla nummer i ett testformulär eller kalkylblad, eller **Ladda ner TXT** för att spara en textfil med ett VIN per rad.

## Läs VIN och kontrollsiffran

De första tre tecknen utgör tillverkarens identifierare. Tecken fyra till åtta beskriver fordonet och det nionde tecknet är kontrollsiffran. De sista åtta tecknen utgör fordonets identifieringsdel. Bokstäverna `I`, `O` och `Q` utelämnas för att undvika förväxling med siffror. Kontrollsiffran beräknas utifrån de andra 16 tecknen och kan vara en siffra från `0` till `9` eller `X`. I `1M8GDM9AXKP042788` är till exempel det nionde tecknet `X`.

## Använd ett exempel-VIN i testdata

Använd de genererade VIN-numren för att testa obligatoriska fält, massimport eller validering av format och kontrollsiffra. För att testa att värdet avvisas, ändra bara det nionde tecknet till en annan siffra och skicka värdet igen. Generatorn skapar syntetiska VIN, så fält som ser ut att ange tillverkare, modellår eller serienummer ska betraktas som exempeldata. För registrering, sökning efter reservdelar eller fordonshistorik ska du använda det VIN som finns på fordonet eller i dess dokument.
