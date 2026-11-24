## Slik bruker du den serielle terminalen i nettleseren

Koble til Arduino, ESP32, Raspberry Pi Pico eller USB-til-seriell-adapteren med en datakabel. Angi baudraten enheten bruker, for eksempel 9600 eller 115200. Velg deretter **Koble til** og velg porten i nettleseren. Denne serielle monitoren bruker 8 databiter, ingen paritet, én stoppbit og ingen flytkontroll (8N1).

## Sende tekst og heksadesimale byte

Tekst sendes i UTF-8. Velg LF, CR eller CR + LF hvis enheten bruker en linjeavslutning til å sende inn kommandoer. For binære kommandoer velger du **Hex** og skriver inn fullstendige byte, for eksempel `41 54 0D 0A`. I Hex-modus sendes bytene slik de er skrevet inn, uten automatisk linjeavslutning.

## Lese og lagre serielle logger

Loggen viser mottatte (RX) og sendte (TX) data med tidsstempler. Bytt til Hex for å undersøke enkeltbyte når teksten ser uleselig ut. Sett rullingen på pause for å se på en tidligere oppføring mens data fortsatt kommer inn, eller last ned den lagrede delen av loggen som en tekstfil. Serielle data blir værende i denne fanen til du velger å lagre dem.

## Hvorfor får jeg ikke koblet til enheten?

Bruk en oppdatert nettleser med støtte for Web Serial, og kontroller at operativsystemet gjenkjenner serieporten. Prøv en annen kabel, og lukk andre serielle monitorer som allerede bruker porten. Hvis enheten kobles til, men viser uleselig tekst, må du kontrollere baudraten og prøve å vise bytene i Hex.
