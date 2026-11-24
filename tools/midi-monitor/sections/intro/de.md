## So verbindest du ein MIDI-Keyboard oder einen Controller

Schließe ein MIDI-Gerät an und prüfe, ob dein Betriebssystem es erkennt. Wähle **MIDI aktivieren**, erlaube bei Nachfrage den MIDI-Zugriff im Browser und wähle einen Eingang aus. Verwende einen kompatiblen Browser und rufe die Seite über HTTPS auf. Der Monitor empfängt die Nachrichten des ausgewählten Eingangs und zeigt sie lokal an.

## So testest du Noten und Anschlagstärke

Drücke eine Taste oder ein Pad und beobachte die Klaviatur und das Nachrichtenprotokoll. Note On zeigt die Note und ihre Anschlagstärke, normalerweise einen Wert von 1 bis 127. Note Off oder ein Note On mit der Anschlagstärke 0 gibt die Note frei. Die Klaviatur bezeichnet die MIDI-Note 60 als C4. Ändere die Anfangsoktave, um einen anderen Bereich anzuzeigen. Gehaltene Noten werden auch aufgeführt, wenn sie außerhalb des angezeigten Bereichs liegen.

## So prüfst du CC, Pitchbend und MIDI-Clock

Bewege einen Drehregler, Fader oder ein Pedal, um die zugehörige Control-Change-Nummer (CC) und ihren Wert zu sehen. Viele Sustain-Pedale senden zum Beispiel CC 64. Pitchbend wird mit dem Mittelwert 0 angezeigt. MIDI-Clock-Impulse werden getrennt vom Nachrichtenprotokoll gezählt. Eine Standard-MIDI-Clock sendet 24 Impulse pro Viertelnote. Das Protokoll enthält Kanalnummern und rohe Hexadezimalbytes zur Untersuchung einzelner Nachrichten.

## Warum reagiert mein MIDI-Eingang nicht?

Prüfe Kabel, Stromversorgung und Gerätemodus und stelle sicher, dass der ausgewählte Anschluss zum Controller gehört. Schließe andere Anwendungen, die den Eingang möglicherweise verwenden, und verbinde ihn erneut. Die Unterstützung hängt vom Browser und Betriebssystem ab. Dieses Tool empfängt Standard-MIDI-Nachrichten mit normalem MIDI-Zugriff. Gerätespezifische System-Exclusive-Nachrichten (SysEx) erfordern eine zusätzliche Berechtigung.
