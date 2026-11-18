## SHA-256-Prüfsumme für Text oder Dateien berechnen

Fügen Sie UTF-8-Text ein oder wählen Sie **Aus Datei importieren**, um den Hash aus den unveränderten Dateibytes zu berechnen. Kopieren Sie das hexadezimale Ergebnis, um es mit einer veröffentlichten Prüfsumme zu vergleichen. SHA-256 liefert einen 256-Bit-Hash, der als 64 Hexadezimalzeichen angezeigt wird.

Um einen Download zu prüfen, berechnen Sie den Hash der heruntergeladenen Datei und vergleichen Sie den vollständigen Hexadezimalwert mit dem Wert der Quelle. Bei Text ändern Leerzeichen, Groß- und Kleinschreibung und Zeilenumbrüche den Hash. Für einen schnellen Test ergibt der Text `abc` ohne abschließenden Zeilenumbruch diesen Wert:

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```
