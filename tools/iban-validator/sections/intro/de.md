## Was ist IBAN?

IBAN (International Bank Account Number) ist eine standardisierte Kennung für Bankkonten, die für internationale Zahlungen verwendet wird.

### IBAN-Struktur

Eine IBAN beginnt mit einem zweibuchstabigen Ländercode, zwei Prüfziffern und einer länderspezifischen BBAN.

### Prüfsummenprüfung

Die IBAN-Gültigkeit wird mit dem ISO-13616-Mod-97-Algorithmus geprüft.

1. Leerzeichen entfernen und die ersten vier Zeichen ans Ende verschieben
2. Buchstaben in Zahlen umwandeln (A=10, B=11, ..., Z=35)
3. Mod 97 berechnen; eine gültige IBAN ergibt den Rest 1

Jedes Land definiert eine feste Länge und Struktur für den BBAN-Teil.
