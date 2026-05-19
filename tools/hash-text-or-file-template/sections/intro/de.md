## Was ist ein Text- oder Datei-Hash?

Eine Hash-Funktion wandelt Text oder Dateibytes in einen Hashwert fester Länge um. Dieselbe Eingabe und derselbe Algorithmus erzeugen immer denselben Hashwert. Dadurch eignen sich Hashes als wiederholbarer Fingerabdruck, ohne private Daten hochladen zu müssen.

## Wann Sie dieses Tool verwenden sollten

Verwenden Sie dieses Tool, um Download-Prüfsummen zu prüfen, zwei Dateien auf Gleichheit zu vergleichen, schnell einen Fingerabdruck für einen Textausschnitt zu notieren oder Systeme zu debuggen, die SHA-Hashwerte veröffentlichen. Beim Import einer Datei werden die Dateibytes direkt gehasht, während der Textmodus den im Editor angezeigten UTF-8-Text hasht.

## Einen Algorithmus wählen

SHA-256 ist eine solide Voreinstellung für neue Integritätsprüfungen. SHA-384 und SHA-512 liefern längere SHA-2-Hashwerte, wenn ein anderes System diese Formate erwartet. SHA-1 ist für Vergleiche mit Altsystemen enthalten, sollte aber nicht für neue sicherheitsrelevante Designs verwendet werden.

## Datenschutz und Einschränkungen

Das Hashing läuft lokal in Ihrem Browser über Web Crypto, und Dateien werden nicht hochgeladen. Ein Hash ist keine Verschlüsselung: Er kann ein Geheimnis nicht allein schützen, und die Passwortspeicherung braucht eine spezielle Passwort-Hashing-Funktion mit Salt und Arbeitsfaktor.
