## Slik kobler du til en HID-enhet i nettleseren

Koble til en støttet inndataenhet, for eksempel en spillkontroller, joystick, pedal eller et makrotastatur. Velg **Koble til enhet** og velg enheten i WebHID-velgeren. Viseren viser leverandør-ID (VID) og produkt-ID (PID), som bidrar til å identifisere maskinvaren. Bruk en kompatibel nettleser på en datamaskin over HTTPS.

## Slik leser du HID-samlinger og rapport-ID-er

Åpne en samling for å se brukssiden, bruken og rapport-ID-ene. Brukssiden grupperer beslektede funksjoner, mens bruken identifiserer en funksjon i gruppen. Inndatarapporter inneholder data fra enheten, utdatarapporter beskriver data en vert kan sende, og funksjonsrapporter beskriver enhetsspesifikke innstillinger eller tilstander. Rapport-ID 0 betyr at grensesnittet ikke bruker en eksplisitt rapport-ID.

## Slik undersøker du endringer i inndatabyte

Beveg én kontroll om gangen mens du følger de løpende hex-rapportene. Uthevede byte er forskjellige fra forrige datainnhold med samme rapport-ID. Rapport-ID-en vises separat fra datainnholdet. Sett registreringen på pause for å undersøke de nyeste rapportene, eller tøm listen og begynn på nytt. Slå opp enhetens rapportformat for å tolke knapper, akser og andre felt.

## Hvorfor vises ikke enheten eller en samling?

Kontroller at operativsystemet gjenkjenner enheten, og åpne deretter velgeren på nytt. Nettlesere beskytter vanlige tastatur- og mussamlinger, og noen enheter gjør bare et utvalg av rapportene tilgjengelige for nettet. Denne viseren mottar inndatarapporter fra den valgte enheten og beholder dataene i denne fanen. For standardkontroller kan du prøve [spillkontrolltesteren](../gamepad-tester/) eller [tastaturtesteren](../keyboard-tester/).
