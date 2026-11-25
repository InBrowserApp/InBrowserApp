## Eine IPA-Datei öffnen und die Metadaten der Haupt-App lesen

Ziehe eine iOS-Datei mit der Endung `.ipa` hierher oder wähle **IPA-Datei öffnen**. Der Betrachter liest die Eigenschaftsliste der Haupt-App unter einem Pfad wie `Payload/Trail Notes.app/Info.plist`. Mit der Beispiel-IPA kannst du die Felder vorab ansehen. Das Archiv wird in deinem Browser entpackt und die Eigenschaftsliste dort gelesen.

## Paket-ID, Versionen und Plattformen verstehen

Die in `CFBundleIdentifier` gespeicherte Paket-ID identifiziert das App-Paket. `CFBundleShortVersionString` gibt die veröffentlichte Version an und `CFBundleVersion` identifiziert den Build. Unter `MinimumOSVersion` und `CFBundleSupportedPlatforms` findest du die Mindestversion des Betriebssystems und die im Paket eingetragenen Plattformnamen. Der Anzeigename stammt aus `CFBundleDisplayName` oder `CFBundleName`.

## Info.plist prüfen und exportieren

Wähle **Info.plist**, um die gesamte Eigenschaftsliste als lesbares XML zu sehen, einschließlich der Schlüssel, die in der Übersicht fehlen. Der Betrachter kann binäre und XML-Eigenschaftslisten lesen. Wähle **XML kopieren**, um die lesbare Fassung in einem anderen Werkzeug zu verwenden, oder **Info.plist herunterladen**, um die Originaldatei unverändert zu speichern. Am angezeigten Archivpfad erkennst du, aus welchem App-Paket die Metadaten stammen.

[Apple-Referenz zu Information Property Lists](https://developer.apple.com/documentation/bundleresources/information-property-list)
