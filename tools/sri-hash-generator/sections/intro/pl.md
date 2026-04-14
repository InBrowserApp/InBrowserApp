## Czym jest Integralność Podzasobów (SRI)?

Integralność Podzasobów (SRI) to funkcja bezpieczeństwa, która umożliwia przeglądarkom weryfikację, że pliki, które pobierają (np. z CDN), nie zostały nieoczekiwanie zmodyfikowane. Działa poprzez porównanie kryptograficznego skrótu zasobu ze skrótem podanym w HTML.

**Jak to działa:**

1. Wygeneruj kryptograficzny skrót pliku zasobu
2. Dołącz skrót do atrybutu integrity tagów script lub link
3. Przeglądarka pobiera zasób i oblicza jego skrót
4. Przeglądarka porównuje obliczony skrót z podanym skrótem
5. Jeśli skróty się zgadzają, zasób się ładuje; jeśli nie, ładowanie jest blokowane

**Korzyści:**

- **Bezpieczeństwo**: Chroni przed złośliwymi modyfikacjami zasobów stron trzecich
- **Ochrona CDN**: Zapewnia, że pliki serwowane przez CDN nie zostały naruszone
- **Bezpieczeństwo łańcucha dostaw**: Weryfikuje integralność zewnętrznych zależności
- **Wsparcie przeglądarek**: Szeroko wspierane w nowoczesnych przeglądarkach

**Obsługiwane algorytmy:**

- SHA-256 (zalecane minimum)
- SHA-384 (zalecane)
- SHA-512 (najwyższe bezpieczeństwo)
