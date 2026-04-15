Erzeuge CUID2-Kennungen lokal im Browser, ohne den aktuellen Stapel an einen anderen Dienst zu senden. Das ist praktisch, wenn du kompakte öffentliche IDs für Datensätze, URLs, Einladungslinks, Fixtures oder clientseitige Platzhalter brauchst und Anzahl sowie Länge direkt steuern möchtest.

## Was CUID2 Anders Macht

CUID2 wurde entwickelt, um Kollisionen in verteilten Systemen zu reduzieren und gleichzeitig URL-tauglich zu bleiben. Jeder Wert beginnt mit einem Kleinbuchstaben, verwendet nur Kleinbuchstaben und Ziffern aus base36 und kombiniert Zähler, Host-Fingerprint und Zufallsentropie vor dem finalen Hash.

## Anzahl Und Länge Wählen

Nutze kürzere Ausgaben für kompakte Slugs in Demos, Testdaten oder temporären Links. Erhöhe die Länge, wenn du mehr Spielraum für langlebige Datensätze oder größere Lasten brauchst, und erhöhe die Anzahl, wenn du in einem Schritt einen ganzen Stapel erzeugen willst.

## Den Finalen Stapel Kopieren Oder Exportieren

Prüfe die erzeugte Liste und kopiere sie oder lade sie als Textdatei herunter, sobald das Format passt. Da alles lokal läuft, bleiben die Kennungen in deinem Browser, bis du sie bewusst verwendest oder teilst.
