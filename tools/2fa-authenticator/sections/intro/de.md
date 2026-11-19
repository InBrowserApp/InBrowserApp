## 2FA-Code aus einem Einrichtungsschlüssel oder QR-Code erzeugen

Öffne auf der Website, die du schützen möchtest, die Einstellungen für die Zwei-Faktor-Authentifizierung und wähle die Einrichtung per Authenticator-App. Lade den QR-Code hoch oder scanne ihn. Du kannst auch den Einrichtungsschlüssel oder einen `otpauth://`-Link einfügen und **Konto hinzufügen** wählen. Kopiere den aktuellen Code in das Bestätigungsfeld der Website, um die Einrichtung abzuschließen.

## Konten aus einer anderen Authenticator-App übernehmen

Wähle in Google Authenticator **Konten übertragen** und exportiere die gewünschten Konten. Scanne die Export-QR-Codes hier mit **Kamera verwenden** oder lade die gespeicherten QR-Code-Bilder zusammen hoch. Öffne im [ursprünglichen InBrowser.App Authenticator](https://authenticator.inbrowser.app/) **Export**, wähle **Google Authenticator**, lade das QR-Code-Bild herunter und lade es hier hoch.

TOTP-Konten aus Google-Transfer-QR-Codes werden mit einem Intervall von 30 Sekunden importiert. Um eigene Intervalle aus der ursprünglichen App zu behalten, übertrage die Konten einzeln. Öffne über das Zahnrad beim jeweiligen Konto **Config**, klappe **Key URI** auf und füge den Link hier ein.

Deine Konten werden in diesem Browser gespeichert. Lade über **Konten exportieren** eine Sicherung herunter, bevor du die Website-Daten löschst oder den Browser wechselst. Bewahre die Sicherung sicher auf, da sie deine Einrichtungsschlüssel enthält.

## Warum wird mein Bestätigungscode abgelehnt?

Die meisten Websites verwenden zeitbasierte Codes (TOTP). Prüfe, ob dein Gerät die Uhrzeit automatisch einstellt. Wenn der aktuelle Code gleich abläuft, warte auf den nächsten. Zählerbasierte Codes (HOTP) ändern sich erst, wenn du **Nächster Code** wählst. Achte in beiden Fällen auf das richtige Konto und übernimm die Einstellungen der Website, falls sie von den Standardwerten abweichen.
