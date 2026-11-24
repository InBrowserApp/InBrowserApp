## So testest du deine Tastatur

Wähle **Test starten**. Drücke die Tasten deiner physischen Tastatur nacheinander und lass sie jeweils wieder los. Solange du eine Taste gedrückt hältst, leuchtet sie auf. Nach dem Loslassen bleibt ein kleiner Punkt sichtbar. Teste Strg, Shift und Alt jeweils links und rechts. Wenn deine Tastatur einen Nummernblock hat, prüfe ihn separat. Mit **Zurücksetzen** löschst du die Markierungen und kannst einen neuen Test durchführen.

## Tastenkombinationen, Rollover und Ghosting testen

Probiere eine Tastenkombination aus einem Spiel oder einer App aus. Halte zum Beispiel `W`, `A`, `Shift` und `Space` (Leertaste) gleichzeitig gedrückt. Unter **Aktuelle Tastenkombination** sollten alle vier Tasten erscheinen. **Max. gleichzeitig** zeigt die höchste Anzahl von Tasten, die der Browser in diesem Test gleichzeitig erkannt hat. Modifikatortasten zählen mit.

Rollover bezeichnet die Fähigkeit einer Tastatur, mehrere Tasten gleichzeitig zu registrieren. Wenn eine Taste einzeln funktioniert, aber in einer bestimmten Kombination fehlt, blockiert die Tastatur möglicherweise diese Eingabe. Erscheint eine Taste, die du gar nicht gedrückt hast, kann Ghosting die Ursache sein. Probiere gezielt die betroffene Kombination aus, da sich verschiedene Tastengruppen unterschiedlich verhalten können. [Microsofts Demo zum Tastatur-Ghosting](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Warum wird eine Taste nicht erkannt?

Wähle erneut **Test starten**, wenn du woanders geklickt oder den Testbereich mit Tab oder Esc verlassen hast. Manche Tasten, etwa Fn und bestimmte Medientasten, verarbeitet die Tastatur selbst oder das Betriebssystem. Auch der Browser kann ein Tastenkürzel abfangen, bevor es diese Seite erreicht. Falls eine gewöhnliche Buchstabentaste auch einzeln nie erkannt wird, prüfe sie in einer anderen App.

## Warum leuchtet eine andere Taste auf?

Die Abbildung zeigt die physischen Tastenpositionen einer ANSI-Tastatur in voller Größe. Wenn du auf einer französischen AZERTY-Tastatur `A` drückst, kann in der Abbildung `Q` aufleuchten. Unter **Letzte Taste** siehst du den Wert aus deiner Tastaturbelegung, `a`, neben dem Code der physischen Tastenposition, `KeyQ`. Konzentriere dich bei einer kompakten Tastatur auf die Tasten, die sie tatsächlich hat. [MDN-Dokumentation zu physischen Tastencodes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)

[Maustester](../mouse-tester/)
