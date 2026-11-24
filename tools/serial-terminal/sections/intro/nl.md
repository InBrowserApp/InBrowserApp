## De seriële terminal in de browser gebruiken

Sluit je Arduino, ESP32, Raspberry Pi Pico of USB-serieeladapter aan met een datakabel. Stel de baudrate van het apparaat in, bijvoorbeeld 9600 of 115200. Selecteer vervolgens **Verbinden** en kies de poort in de browser. Deze seriële monitor gebruikt 8 gegevensbits, geen pariteit, één stopbit en geen gegevensstroomregeling (8N1).

## Tekst en hexadecimale bytes verzenden

Tekst wordt verzonden in UTF-8. Kies LF, CR of CR + LF als je apparaat een regeleinde gebruikt om opdrachten te verwerken. Selecteer voor binaire opdrachten **Hexadecimaal** en voer volledige bytes in, zoals `41 54 0D 0A`. In de hexadecimale modus worden de bytes verzonden zoals ingevoerd, zonder automatisch regeleinde.

## Seriële logboeken lezen en opslaan

Het logboek toont ontvangen (RX) en verzonden (TX) gegevens met tijdstempels. Schakel over naar hexadecimaal om afzonderlijke bytes te bekijken als de tekst onleesbaar is. Pauzeer het scrollen om een eerdere vermelding te bekijken terwijl gegevens blijven binnenkomen, of download het bewaarde logboek als tekstbestand. Seriële gegevens blijven in dit tabblad totdat je ervoor kiest ze op te slaan.

## Waarom kan ik geen verbinding maken met mijn apparaat?

Gebruik een bijgewerkte browser die Web Serial ondersteunt en controleer of het besturingssysteem de seriële poort herkent. Probeer een andere kabel en sluit andere seriële monitors die de poort al gebruiken. Als het apparaat verbinding maakt maar onleesbare tekst produceert, controleer dan de baudrate en probeer de bytes hexadecimaal weer te geven.
