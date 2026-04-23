## Wofuer dieses Tool da ist

Mit diesem Tool kannst du Base58-Zeichenfolgen oder Textdateien direkt im
Browser wieder in ihre urspruenglichen Bytes zurueckdecodieren. Es eignet sich,
wenn du Daten aus APIs, Wallets, Logs, QR-Ablaufen oder Import- und
Export-Schritten pruefen willst, ohne den Inhalt an einen Server zu senden.

## Wann du das Alphabet wechseln solltest

Base58 hat kein einheitliches Alphabet. Bitcoin, Flickr und Ripple verwenden
unterschiedliche Zeichenreihenfolgen. Wenn ein Wert die Validierung nicht
besteht oder zwar dekodiert wird, aber das Ergebnis nicht stimmt, solltest du
zum Alphabet des Quellsystems wechseln.

## Worauf du achten solltest

Das Ausgabefeld zeigt eine UTF-8-Vorschau, wenn sich die dekodierten Bytes als
Text lesen lassen. Bei Binardaten oder nicht-textuellen Inhalten ist es sicherer,
die .bin-Datei herunterzuladen und die Originalbytes zu pruefen. Eingefuegte
Leerzeichen und Zeilenumbrueche werden ignoriert, daher lassen sich auch aus
E-Mails, Dokumenten oder Terminals kopierte Umbrueche dekodieren.
