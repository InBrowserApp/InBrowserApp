## So verbindest du ein Bluetooth-Low-Energy-Gerät

Schalte Bluetooth ein und versetze das Gerät in einen verbindungsbereiten Modus. Wähle **Gerät verbinden** und anschließend dein Peripheriegerät im Browser aus. Dieser Explorer fordert Zugriff auf gängige GATT-Dienste wie Battery Service, Device Information, Heart Rate und Environmental Sensing an. Gib bei einem eigenen GATT-Dienst dessen UUID ein, bevor du die Geräteauswahl öffnest. Verwende eine 16-Bit-UUID wie `180F` oder eine vollständige 128-Bit-UUID aus der Dokumentation des Geräts.

## So liest du GATT-Merkmale

Klappe einen Dienst auf, um seine Merkmale und deren unterstützte Vorgänge anzuzeigen. Wähle **Lesen**, um den aktuellen Wert abzurufen. Hex zeigt die Bytes genau so an, wie sie empfangen wurden. UTF-8 eignet sich für Merkmale, die Text enthalten. Ein Akkustand, ein Messwert oder ein anderer binärer Wert muss möglicherweise anhand der Spezifikation des jeweiligen Merkmals interpretiert werden.

## So erfasst du Bluetooth-Benachrichtigungen

Wähle **Abonnieren** bei einem Merkmal, das Notify oder Indicate unterstützt. Aktualisierungen erscheinen mit Uhrzeit und Merkmals-UUID. Lade die letzten 100 Benachrichtigungen zur späteren Prüfung als JSON-Datei herunter oder wähle **Abonnement beenden**, um den Datenstrom zu stoppen. Die Seite speichert das Protokoll lokal.

## Warum sehe ich mein Gerät oder seine Dienste nicht?

Die Unterstützung für Web Bluetooth hängt vom Browser und Betriebssystem ab. Verwende einen unterstützten Browser über HTTPS, halte das Gerät in der Nähe und trenne es von anderen Apps, falls es nur eine Verbindung zulässt. Der Browser stellt freigegebene GATT-Dienste auf Bluetooth-LE-Peripheriegeräten bereit. Bluetooth-Classic-Geräte wie Kopfhörer, die nur Audioprofile bereitstellen, benötigen eine andere Schnittstelle.
