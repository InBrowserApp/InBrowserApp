## Was ist Argon2?

Argon2 ist ein Passwort-Hashing-Algorithmus, der Offline-Passwort-Cracking teuer machen soll. Er kombiniert wiederholte Berechnungen mit konfigurierbaren Speicherkosten, sodass Angreifer für jeden Passwortversuch sowohl Zeit als auch Speicher benötigen.

**Warum Argon2id meist die Standardwahl ist:**

- Es bietet für die meisten Passwortspeichersysteme eine bessere Balance zwischen Schutz vor Seitenkanalangriffen und GPU-basiertem Cracking als Argon2i oder Argon2d allein
- Die kodierte Ausgabe speichert Algorithmus, Version, Speicher, Iterationen, Parallelität, Salt und Hash in einer portablen Zeichenfolge
- Ein eindeutiger zufälliger Salt verhindert, dass identische Passwörter identische gespeicherte Hashes erzeugen
- Speicher- und Iterationseinstellungen können erhöht werden, wenn Ihre Verifizierungsumgebung schneller wird

**So verwenden Sie dieses Tool:**

1. Geben Sie das Passwort ein, das Sie hashen möchten.
2. Behalten Sie den generierten Salt bei oder erstellen Sie einen neuen zufälligen Salt.
3. Wählen Sie die Argon2-Variante und stimmen Sie Speicher, Iterationen, Parallelität und Hash-Länge auf das System ab, das den Hash verifizieren wird.
4. Generieren Sie den kodierten Hash und speichern Sie diese vollständige Zeichenfolge in der Datenbank Ihrer Anwendung.

**Sicherheitshinweise:**

- Speichern oder protokollieren Sie das Klartextpasswort nicht.
- Verwenden Sie für jedes Passwort einen neuen zufälligen Salt.
- Verwenden Sie das optionale Secret nur, wenn Ihr Verifier ebenfalls genau dieses Secret besitzt; andernfalls kann der Hash später nicht verifiziert werden.
- Bevorzugen Sie die höchsten Speicher- und Iterationseinstellungen, bei denen die Anmeldelatenz für echte Nutzer akzeptabel bleibt.
