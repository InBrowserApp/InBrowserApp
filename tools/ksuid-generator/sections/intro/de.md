## Was ist KSUID?

KSUID (K-Sortable Unique IDentifier) ist eine 27-stellige Base62-Kennung, die einen 32-Bit-Zeitstempel (Sekunden seit 2014-05-13) und 128 Bit Zufallsdaten enthält.

**Kernpunkte:**

- **Zeitlich sortierbar**: die lexikografische Reihenfolge folgt der Erstellzeit.
- **Hohe Eindeutigkeit**: 128 Bit Zufall pro ID.
- **Sekundenpräzision**: KSUID speichert Sekunden, Millisekunden werden abgerundet.
