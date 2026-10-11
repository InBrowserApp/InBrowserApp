## Opgemaakte tekst lokaal converteren

Open een lokaal `.rtf`-document, converteer het naar PDF, bekijk de resulterende pagina’s en download dezelfde PDF die in de voorvertoning wordt getoond. Gebruik de [RTF-viewer](../rtf-viewer/) om te lezen zonder conversie.

## PDF-weergave en compatibiliteit

De conversie-engine geeft paginaformaten, afdrukstand, kopteksten, voetteksten, pagina-einden, tabellen en ondersteunde ingesloten PNG/JPEG-afbeeldingen weer. Ondersteunde tekst blijft selecteerbaar. De oorspronkelijke RTF-tekencoderingen en Unicode-escapes worden doorgegeven aan de engine; er wordt geen OCR toegevoegd aan gescande tekst. Ontbrekende lettertypen worden vervangen door meegeleverde lettertypen, waardoor regelafbrekingen, afstanden en paginering kunnen veranderen. Complexe opmaak kan afwijken van de oorspronkelijke toepassing. Controleer elke pagina voordat je op de PDF vertrouwt.

De PDF is een statische export. Formulierbesturingselementen worden weergegeven zoals ze worden afgedrukt. Opmerkingen, macro’s en digitale handtekeningen worden niet behouden of gecontroleerd. Ingesloten objecten, externe documentbronnen, niet-ondersteunde afbeeldingsformaten en niet-ondersteunde veldinstructies worden geweigerd. Beschadigde of onleesbare bestanden leiden tot een foutmelding, zonder een onvolledig bestand ter download aan te bieden. Het wijzigen van de bestandsextensie verandert het onderliggende formaat niet.

## Privacy en browserbronnen

De conversie vindt plaats op je apparaat. Bij de eerste conversie wordt ongeveer 90 MB aan engine- en lettertypebestanden gedownload, die je browser mogelijk in de cache bewaart; het document zelf wordt nooit geüpload. De engine wordt pas geladen nadat je een bestand kiest. Een actuele browser met ondersteuning voor WebAssembly en gedeeld geheugen is vereist. Grote of complexe documenten kunnen tijd en geheugen vergen. Je kunt annuleren, het bestand sluiten of vervangen. Er is geen vaste limiet voor de bestandsgrootte of het aantal pagina’s.
