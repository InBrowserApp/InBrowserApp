## Was ist eine PRC-Resident-ID?

Die 18-stellige PRC-Resident-ID enthält einen Adresscode, ein Geburtsdatum, einen Sequenzcode und eine Prüfziffer. Dieser Validator prüft diese Teile offline und hilft dabei, die Struktur der Nummer nachzuvollziehen.

### So funktioniert die Validierung

- Entfernt Leerzeichen und Bindestriche und normalisiert das letzte Zeichen zu einem großgeschriebenen `X`
- Verlangt genau 18 Zeichen: 17 Ziffern plus eine letzte Ziffer oder `X`
- Gleicht die ersten 6 Ziffern mit dem Verwaltungsdatensatz 2023 ab und analysiert das 8-stellige Geburtsdatum
- Berechnet die Prüfziffer aus den ersten 17 Ziffern neu und vergleicht sie mit dem letzten Zeichen

### Was das Ergebnis zeigt

- Regionsaufschlüsselung: Provinz, Stadt, Bezirk/Landkreis und der rohe Regionscode
- Geburtsdatum, aktuelles Alter, Sequenzcode und das aus dem Sequenzcode abgeleitete Geschlecht
- Die normalisierte ID sowie erwartete und tatsächliche Prüfziffer zur Fehlersuche

### Beispiel

`110101199001010015` lässt sich so lesen:

- `110101` -> Dongcheng-Distrikt, Peking
- `19900101` -> Geburtsdatum `1990-01-01`
- `001` -> Sequenzcode
- `5` -> Prüfziffer

### Wichtiger Hinweis

Dieses Werkzeug führt nur eine strukturelle Offline-Validierung und Prüfsummenprüfung durch. Eine Nummer, die diese Prüfungen besteht, ist kein Nachweis für eine reale oder aktuell gültige Identität.

Die Regionsnamen basieren auf dem Datensatz der Verwaltungsdivisionen von 2023.
