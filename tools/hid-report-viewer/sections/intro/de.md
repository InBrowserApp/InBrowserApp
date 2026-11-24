## So verbindest du ein HID-Gerät im Browser

Schließe ein unterstütztes Eingabegerät an, zum Beispiel einen Gamecontroller, Joystick, ein Pedal oder ein Makropad. Wähle **Gerät verbinden** und anschließend das Gerät in der WebHID-Auswahl. Der Betrachter zeigt die Hersteller-ID (VID) und die Produkt-ID (PID) an, die bei der Identifizierung der Hardware helfen. Verwende einen kompatiblen Desktop-Browser über HTTPS.

## So liest du HID-Sammlungen und Berichts-IDs

Öffne eine Sammlung, um ihre Verwendungsseite, Verwendung und Berichts-IDs anzuzeigen. Die Verwendungsseite gruppiert verwandte Funktionen, während die Verwendung eine Funktion innerhalb dieser Gruppe bezeichnet. Eingabeberichte übertragen Daten vom Gerät, Ausgabeberichte beschreiben Daten, die ein Host senden kann, und Featureberichte beschreiben gerätespezifische Einstellungen oder Zustände. Die Berichts-ID 0 bedeutet, dass die Schnittstelle keine explizite Berichts-ID verwendet.

## So untersuchst du Änderungen an Eingabebytes

Bewege jeweils ein Bedienelement und beobachte dabei die laufenden Hex-Berichte. Hervorgehobene Bytes unterscheiden sich von den vorherigen Nutzdaten derselben Berichts-ID. Die Berichts-ID wird getrennt von den Nutzdaten angezeigt. Pausiere die Aufzeichnung, um die letzten Berichte zu untersuchen, oder lösche die Liste und beginne erneut. Schlage das Berichtsformat des Geräts nach, um Tasten, Achsen und andere Felder zu interpretieren.

## Warum wird mein Gerät oder eine Sammlung nicht angezeigt?

Prüfe, ob das Betriebssystem das Gerät erkennt, und öffne die Auswahl erneut. Browser schützen gängige Tastatur- und Maussammlungen, und manche Geräte stellen dem Web nur einen Teil ihrer Berichte zur Verfügung. Dieser Betrachter empfängt Eingabeberichte vom ausgewählten Gerät und speichert die Daten in diesem Tab. Für Standardbedienelemente kannst du den [Gamepad-Tester](../gamepad-tester/) oder den [Tastaturtester](../keyboard-tester/) ausprobieren.
