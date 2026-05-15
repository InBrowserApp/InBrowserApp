# Was ist ein UUID-Decoder?

Ein UUID-Decoder erklärt die Struktur innerhalb eines Universally Unique Identifiers. Er normalisiert gängige eingefügte Formate, prüft, ob der Wert eine 128-Bit-UUID ist, und zeigt Version, Variante, rohe hexadezimale Bytes sowie kopierfertige numerische Darstellungen.

UUIDs werden oft als undurchsichtige Zeichenketten behandelt, doch das Versions-Nibble zeigt, wie die Kennung erzeugt wurde. UUIDs der Version 4 sind zufällig, Version 3 und 5 sind namensbasierte Hashes, und zeitgeordnete Versionen wie 1, 6 und 7 können Zeitstempelinformationen enthalten.

## Wann du es verwenden solltest

Verwende dieses Tool, wenn du eine Kennung aus Logs, Datenbanken, APIs, Traces oder Test-Fixtures prüfen musst. Es ist hilfreich, um zu bestätigen, ob eine UUID zufällig oder zeitbasiert ist, sie für ein anderes System in Dezimal oder Base64 umzuwandeln und zu erkennen, ob das Knotenfeld einer UUID v1 oder v6 möglicherweise eine MAC-artige Kennung offenlegt.

Der Decoder läuft in deinem Browser und sendet UUID-Werte nicht an einen Server. Er akzeptiert kanonische UUIDs, `urn:uuid:`-Werte, UUIDs in geschweiften Klammern, Eingaben in Großbuchstaben und 32-stellige hexadezimale UUIDs ohne Bindestriche.

## Worauf du achten solltest

UUID-Version und -Variante beschreiben das Bit-Layout, nicht ob die Kennung in der Praxis global eindeutig ist. Eine gültig aussehende UUID kann trotzdem doppelt vorkommen, wenn sie schlecht erzeugt oder versehentlich kopiert wurde.

Bei UUIDs der Version 1 und Version 6 kann das Knotenfeld wie eine MAC-Adresse aussehen. Moderne Generatoren können stattdessen das Multicast-Bit setzen und einen zufälligen Knoten verwenden; behandle es daher als Knotenkennung, sofern du den Generator nicht kontrollierst.
