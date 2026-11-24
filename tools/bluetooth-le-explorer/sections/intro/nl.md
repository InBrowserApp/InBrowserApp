## Verbinding maken met een Bluetooth Low Energy-apparaat

Schakel Bluetooth in en zet het apparaat in een modus waarin het verbinding kan maken. Selecteer **Apparaat verbinden** en kies je apparaat in de browser. Deze verkenner vraagt toegang tot veelgebruikte GATT-services zoals Battery Service, Device Information, Heart Rate en Environmental Sensing. Voer voor een aangepaste GATT-service de UUID in voordat je de apparaatkiezer opent. Gebruik een 16-bits UUID zoals `180F` of een volledige 128-bits UUID uit de documentatie van het apparaat.

## GATT-kenmerken lezen

Klap een service uit om de kenmerken en de ondersteunde bewerkingen te bekijken. Selecteer **Lezen** om de huidige waarde op te vragen. Hexadecimaal toont de bytes precies zoals ze zijn ontvangen; UTF-8 is handig voor kenmerken die tekst bevatten. Een batterijniveau, meetwaarde of andere binaire waarde moet mogelijk worden geïnterpreteerd aan de hand van de specificatie van dat kenmerk.

## Bluetooth-meldingen vastleggen

Selecteer **Abonneren** bij een kenmerk dat meldingen of indicaties ondersteunt. Updates verschijnen met hun tijd en de UUID van het kenmerk. Download de laatste 100 meldingen als JSON-bestand om ze later te bekijken, of selecteer **Abonnement opzeggen** om die stroom te stoppen. De pagina bewaart het logboek lokaal.

## Waarom zie ik mijn apparaat of de services niet?

Ondersteuning voor Web Bluetooth hangt af van de browser en het besturingssysteem. Gebruik een ondersteunde browser via HTTPS, houd het apparaat in de buurt en verbreek de verbinding met andere apps als het apparaat slechts één verbinding toestaat. De browser geeft toegang tot geautoriseerde GATT-services op Bluetooth LE-apparaten. Bluetooth Classic-apparaten, zoals hoofdtelefoons die alleen audioprofielen aanbieden, vereisen een andere interface.
