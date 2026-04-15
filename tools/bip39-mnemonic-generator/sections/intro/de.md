Erzeuge BIP39-Seed-Phrasen im Browser, prüfe importierte Mnemoniken, bevor du ihnen vertraust, und konvertiere zwischen roher Entropie und Wallet-Wörtern, ohne sensibles Material an einen anderen Dienst zu senden. Das Tool ist nützlich, wenn du Erzeugung, Prüfsummenprüfung und Low-Level-Recovery in einer einzigen Arbeitsfläche bündeln willst.

## Gezielt erzeugen

Wähle eine unterstützte Wortliste und Wortanzahl und generiere so lange neu, bis du die Seed-Phrase hast, die du speichern möchtest. Die passende Entropie wird direkt daneben angezeigt, damit du die genaue Stärke prüfen und beide Darstellungen gemeinsam dokumentieren kannst.

## Vor dem Import prüfen

Nutze den Prüfmodus, wenn dir jemand eine Mnemonik gibt und du vor dem Import in eine andere Wallet schnell Prüfsumme und Wortanzahl kontrollieren willst. Bei einem gültigen Ergebnis wird auch die wiederhergestellte Entropie angezeigt, was beim Vergleich mehrerer Recovery-Quellen oder beim Debuggen von Ableitungsschritten hilft.

## Entropie mit Bedacht umwandeln

Der Konvertierungsmodus funktioniert in beide Richtungen: rohe Entropie zu Wörtern und Mnemonik zurück zu Entropie. Das ist praktisch für Testdaten, deterministische Wallet-Demos und Incident-Reviews, in denen du bestätigen musst, dass eine Phrase unter einer bestimmten BIP39-Wortliste noch den erwarteten Bytes entspricht.
