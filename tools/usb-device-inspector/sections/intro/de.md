## So untersuchst du ein USB-Gerät im Browser

Verbinde das Gerät mit einem Datenkabel, wähle **Gerät auswählen** und wähle es im WebUSB-Dialog des Browsers aus. Die Gerätekarte zeigt die Hersteller-ID (VID), die Produkt-ID (PID) und verfügbare Angaben zur Identifizierung. Die USB-Version stammt aus dem Gerätedeskriptor. Die tatsächliche Verbindungsgeschwindigkeit hängt auch vom Kabel, Anschluss und Betriebssystem ab.

## So liest du Konfigurationen, Schnittstellen und Endpunkte

Klappe eine Konfiguration auf, um die Funktionen ihrer Schnittstellen zu sehen. Eine Schnittstelle kann mehrere alternative Einstellungen haben, jede mit eigener Klasse, Unterklasse, eigenem Protokoll und eigenen Endpunkten. IN-Endpunkte übertragen Daten zum Host, OUT-Endpunkte zum Gerät. Der Endpunkttyp und die Paketgröße beschreiben, wie der Endpunkt Daten überträgt.

## Was zeigt die Zugriffsprüfung?

Wähle **Zugriff prüfen**, um zu sehen, ob der Browser das ausgewählte Gerät öffnen kann. Die Prüfung verwendet das Geräte-Handle und gibt es anschließend frei. Der Zugriff auf Schnittstellen kann weiterhin vom Treiber des Betriebssystems oder einer anderen Anwendung abhängen. Der Inspektor liest die vom Browser bereitgestellten Deskriptoren und verändert keine Geräteeinstellungen.

## Warum kann ich mein USB-Gerät nicht sehen oder öffnen?

Falls dein Gerät in der Auswahl fehlt, versuche es mit einem Datenkabel und prüfe, ob das Betriebssystem es erkennt. Wenn der Browser den Zugriff verweigert, prüfe die USB-Berechtigung der Website oder die Browserrichtlinie. Wenn die Auswahl gelingt, das Öffnen aber fehlschlägt, schließe Apps, die das Gerät möglicherweise verwenden, und prüfe die Treiberanforderungen für dein Gerät und deine Plattform. Manche USB-Klassen werden vom Browser geschützt. Unter [Geräteinformationen](../device-information/) findest du die Fähigkeiten dieses Browsers und Systems.
