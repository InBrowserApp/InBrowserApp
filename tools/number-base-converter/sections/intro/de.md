Konvertieren Sie ganze Zahlen direkt im Browser zwischen Binär, Oktal, Dezimal, Hexadezimal, Base32, Base36, Base62, Base64 und benutzerdefinierten Basen von 2 bis 64. Alles wird lokal mit BigInt berechnet, sodass Sie große Werte prüfen können, ohne sie an einen Server zu senden.

## Wann es nützlich ist

Verwenden Sie dieses Tool, wenn dieselbe Ganzzahl in Logs, Protokollen, IDs oder Spezifikationen mit unterschiedlichen Alphabeten auftaucht. Sobald Sie ein Feld ändern, werden die anderen sofort neu berechnet. Das hilft bei Debugging, Dokumentation und manueller Prüfung.

## Unterschiede zwischen Basen

Bis Basis 36 werden Buchstaben ohne Beachtung der Groß- und Kleinschreibung akzeptiert. Höhere Basen behandeln Groß- und Kleinbuchstaben als unterschiedliche Ziffern, und die Base64-Zeile verwendet das numerische Alphabet `A-Z a-z 0-9 + /`, nicht die byteorientierte Base64-Textkodierung.

## Worauf Sie achten sollten

Es werden nur nicht negative Ganzzahlen unterstützt. Führende Nullen gelten als Formatierung, daher werden die Ausgaben normalisiert und können die eingegebene Auffüllung verlieren.
