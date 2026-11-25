## So normalisierst du Unicode-Text

Gib Text in das Feld **Originaltext** ein oder füge ihn ein. Wähle anschließend eine Normalisierungsform. Das Ergebnis aktualisiert sich beim Tippen und beim Wechsel der Form. Mit **Ergebnis kopieren** kannst du den normalisierten Text in einer anderen App verwenden. Die Umwandlung läuft im Browser und deine Eingabe bleibt auf deinem Gerät.

## Welche Unicode-Normalisierungsform soll ich wählen?

- **NFC (kanonische Komposition)** eignet sich als Standard für allgemeine Texte. Wo ein zusammengesetztes Zeichen existiert, verbindet NFC Buchstabe und Akzent zu einem Codepunkt. So kannst du gleichwertige Darstellungen vor dem Speichern oder Vergleichen vereinheitlichen.
- **NFD (kanonische Zerlegung)** zerlegt Zeichenfolgen in ihre kanonischen Bestandteile, etwa in einen Grundbuchstaben und einen kombinierenden Akzent. Das hilft dir, die einzelnen Akzente zu untersuchen oder zu verarbeiten.
- **NFKC (Kompatibilitätskomposition)** vereinheitlicht zusätzlich Kompatibilitätsvarianten wie Buchstaben in voller Breite und Ligaturen. Das ist etwa bei der Suche und beim Abgleich nützlich, wenn diese Unterschiede keine Rolle spielen.
- **NFKD (Kompatibilitätszerlegung)** verwendet dieselben Kompatibilitätszuordnungen und lässt das Ergebnis in zerlegter Form. Das kann die Textanalyse erleichtern.

## Warum kann normalisierter Text gleich aussehen?

Der Buchstabe **é** lässt sich als `U+00E9` speichern oder als **e** gefolgt von einem kombinierenden Akut (`U+0065 U+0301`). NFC ergibt die erste Darstellung, NFD die zweite. Unter **Codepunkte vergleichen** siehst du die Codepunktfolge am Anfang beider Texte, selbst wenn sie gleich aussehen.

Mit **Beispiel ausprobieren** siehst du auch Zeichen, die sich sichtbar verändern. Mit NFKC wird **ＡＢＣ ① ﬁ** zu **ABC 1 fi**. NFC erhält diese Kompatibilitätsunterschiede.

## Wann kann die Normalisierung die Bedeutung ändern?

NFKC und NFKD können Formatierungsmerkmale wie ein hochgestelltes Zeichen in einer Formel oder eine eingekreiste Zahl in einer Liste einebnen. Wähle NFC, wenn diese Unterschiede wichtig sind. Groß- und Kleinschreibung ändern, Akzente entfernen oder zwischen Kodierungen wie UTF-8 und UTF-16 wechseln sind eigene Verarbeitungsschritte.

Mehr dazu steht im [Anhang des Unicode-Standards zu Normalisierungsformen](https://www.unicode.org/reports/tr15/).
