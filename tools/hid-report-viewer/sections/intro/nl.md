## Een HID-apparaat verbinden in je browser

Sluit een ondersteund invoerapparaat aan, zoals een gamecontroller, joystick, pedaal of macropad. Selecteer **Apparaat verbinden** en kies het apparaat in de WebHID-kiezer. De viewer toont de leveranciers-ID (VID) en product-ID (PID), waarmee je de hardware kunt identificeren. Gebruik een geschikte desktopbrowser via HTTPS.

## HID-verzamelingen en rapport-ID’s lezen

Open een verzameling om de gebruikspagina, het gebruik en de rapport-ID’s te bekijken. De gebruikspagina groepeert verwante functies; het gebruik duidt een functie binnen die groep aan. Invoerrapporten bevatten gegevens van het apparaat, uitvoerrapporten beschrijven gegevens die een host kan verzenden en kenmerkrapporten beschrijven instellingen of de status van het apparaat. Rapport-ID 0 betekent dat de interface geen expliciete rapport-ID gebruikt.

## Veranderende invoerbytes inspecteren

Beweeg telkens één bedieningselement en bekijk de live rapporten in hexadecimaal. Gemarkeerde bytes verschillen van de vorige gegevens voor dezelfde rapport-ID. De rapport-ID wordt afzonderlijk van de gegevens weergegeven. Pauzeer het vastleggen om de laatste rapporten te bekijken, of wis de lijst en begin opnieuw. Zoek het rapportformaat van het apparaat op om knoppen, assen en andere velden te interpreteren.

## Waarom staat mijn apparaat of een verzameling niet in de lijst?

Controleer of het besturingssysteem het apparaat herkent en open de kiezer opnieuw. Browsers beschermen gangbare toetsenbord- en muisverzamelingen en sommige apparaten maken slechts een deel van hun rapporten beschikbaar voor het web. Deze viewer ontvangt invoerrapporten van het geselecteerde apparaat en bewaart de gegevens in dit tabblad. Probeer voor standaardbediening de [Gamepadtester](../gamepad-tester/) of [Toetsenbordtester](../keyboard-tester/).
