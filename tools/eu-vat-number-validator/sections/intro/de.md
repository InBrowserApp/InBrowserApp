## Was ist eine EU-USt-IdNr.?

Eine Umsatzsteuer-Identifikationsnummer wird von einem EU-Mitgliedstaat an Unternehmen vergeben, die für die Mehrwertsteuer registriert sind. Sie beginnt mit einem zweistelligen Ländercode (zum Beispiel `BE` für Belgien oder `EL` für Griechenland), gefolgt von einer länderspezifischen Folge aus Ziffern und manchmal Buchstaben. Steuerbehörden nutzen sie, um grenzüberschreitenden Handel und Erstattungsanträge zu verfolgen. Fehler auf Rechnungen, in Verträgen oder in Beschaffungsunterlagen können daher schnell eine Zahlung blockieren oder eine Prüfung auslösen.

## Was dieses Tool tatsächlich prüft

Dieser Checker führt drei unabhängige Prüfungen durch, alle in Ihrem Browser:

1. **Ländercode** – die ersten beiden Buchstaben müssen zu einem EU-Mitgliedstaat passen, der am Umsatzsteuersystem teilnimmt (einschließlich des besonderen Codes `EL` für Griechenland).
2. **Format** – die verbleibenden Zeichen müssen dem dokumentierten USt-IdNr.-Format des jeweiligen Landes entsprechen. Zum Beispiel besteht die belgische USt-IdNr. aus genau zehn Ziffern, die österreichische beginnt mit `U` gefolgt von acht Ziffern, und die niederländische hat die Form `<nine digits>B<two digits>`.
3. **Prüfsumme** – wo in den Umsatzsteuerregeln eines Landes eine deterministische Prüfsumme existiert (Österreich, Belgien, Dänemark, Finnland, Frankreich, Deutschland, Italien, Niederlande, Polen, Portugal, Spanien, Schweden), wird die letzte Ziffer oder der letzte Buchstabe neu berechnet und verglichen.

Eine Nummer, die alle drei Prüfungen besteht, ist syntaktisch korrekt aufgebaut. Das ist nicht dasselbe wie die Bestätigung, dass das Unternehmen aktuell registriert ist – dafür benötigen Sie weiterhin den VIES-Dienst der Europäischen Kommission oder die lokale Steuerbehörde. Dieses Tool wird am besten vor dieser abschließenden Prüfung eingesetzt, um Tippfehler, vertauschte Ziffern und Copy-Paste-Fehler abzufangen, die eine VIES-Abfrage aus dem falschen Grund scheitern lassen.

## Häufige Dinge, die es erkennt

- Nummern, die auf den ersten Blick korrekt aussehen, aber aus einem Nicht-EU-Land stammen (zum Beispiel mit `US` oder `UK` beginnen).
- Führende Nullen, die von einer Tabellenkalkulation entfernt wurden, wodurch die Nummer eine Ziffer zu kurz wird.
- Leerzeichen, Punkte oder Bindestriche, die ein Rechnungssystem eingefügt hat – das Tool entfernt sie und prüft das Ergebnis.
- Die klassische Verwechslung zwischen dem griechischen Ländercode `GR` und dem USt-Code `EL`, die die Formatprüfung sofort ablehnt.

## Was die Ergebniskarte anzeigt

Über eine einfache Gültig-/Ungültig-Anzeige hinaus schlüsselt das Ergebnis das Land, die normalisierte Nummer, das vom Land erwartete Format und den Status der Prüfsumme auf (bestanden, fehlgeschlagen oder übersprungen, weil das Land keine veröffentlicht). Dieses Detail ist nützlich, wenn Sie eine Ablehnung erklären müssen – „Format ist in Ordnung, Prüfsumme stimmt nicht" ist viel aussagekräftiger als „ungültig".

## Datenschutz

Jede Prüfung läuft lokal in Ihrem Browser. Nichts wird an einen Server gesendet, protokolliert oder irgendwo gespeichert außer im localStorage Ihres eigenen Browsers (für die letzte von Ihnen eingegebene Eingabe, damit sie ein Neuladen der Seite übersteht). Sie können die USt-IdNr. eines Kunden einfügen, ohne sich Sorgen zu machen, wo sie landet.
