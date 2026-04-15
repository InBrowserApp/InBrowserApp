## IPv6 in MAC-Adresse konvertieren

Sie können eine IPv6-Adresse nur dann wieder in eine MAC-Adresse
zurückrechnen, wenn die IPv6-Schnittstellenkennung mit der EUI-64-Methode aus
dieser MAC-Adresse abgeleitet wurde. Das ist vor allem bei älteren
Link-Local-Adressen mit `fe80::` und einigen zustandslos automatisch
konfigurierten Adressen der Fall.

### Wann es funktioniert

Diese Rückumwandlung funktioniert, wenn die letzten 64 Bit der IPv6-Adresse
noch eine EUI-64-Schnittstellenkennung enthalten.

- Die Schnittstellenkennung wurde aus einer 48-Bit-MAC-Adresse aufgebaut.
- In der Mitte stehen weiterhin die Bytes `ff:fe`.
- Die Adresse wurde nicht durch Privacy Extensions oder ein anderes
  Zufallsschema erzeugt.

### So funktioniert die Umwandlung

Der Konverter rekonstruiert die MAC-Adresse in diesen Schritten:

1. Die letzten 64 Bit der IPv6-Adresse auslesen.
2. Die eingefügten Bytes `ff:fe` aus der Mitte der Schnittstellenkennung
   entfernen.
3. Das Universal/Local-Bit im ersten Byte umkehren.
4. Die verbleibenden 48 Bit als standardisierte MAC-Adresse formatieren.

### Warum keine MAC angezeigt wird

In mehreren Fällen erscheint kein Ergebnis:

- Die IPv6-Adresse ist syntaktisch ungültig.
- Die Adresse ist gültig, wurde aber nicht per EUI-64 aus einer MAC-Adresse
  erzeugt.
- Die Adresse verwendet Privacy-, Stable-Random-, DHCPv6- oder ein anderes
  nicht MAC-basiertes Zuweisungsverfahren.
