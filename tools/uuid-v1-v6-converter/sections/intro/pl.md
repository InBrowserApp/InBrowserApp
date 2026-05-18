UUID v1 i UUID v6 zawierają te same podstawowe informacje: znacznik czasu, sekwencję zegara oraz identyfikator węzła. UUID v1 zapisuje znacznik czasu w historycznej kolejności pól UUID, a UUID v6 przestawia te bity znacznika czasu tak, aby proste sortowanie leksykograficzne bardziej naturalnie odpowiadało czasowi utworzenia.

Użyj tego narzędzia, gdy musisz przenosić identyfikatory między systemami oczekującymi różnych układów UUID opartych na czasie. Wklej UUID v1, aby otrzymać jego odpowiednik UUID v6, albo wklej UUID v6, aby odzyskać reprezentację UUID v1. Konwersja jest deterministyczna i pozostawia sekwencję zegara oraz bajty węzła bez zmian.

## Kiedy go używać

- Podczas migracji rekordów ze starszego magazynu UUID v1 do UUID v6 przy zachowaniu metadanych tożsamości.
- Podczas debugowania baz danych, logów lub kolejek, które mieszają wartości UUID v1 i UUID v6.
- Podczas sprawdzania, czy wartość UUID v6 mapuje się z powrotem na UUID v1 oczekiwany przez starszą integrację.

## Format danych wejściowych

Konwerter akceptuje kanoniczne ciągi UUID z myślnikami, kompaktowe 32-znakowe ciągi UUID, UUID zapisane wielkimi literami, wartości `urn:uuid:` oraz UUID w nawiasach klamrowych. Wyniki są zawsze normalizowane do kanonicznej postaci UUID z małymi literami.

## Uwagi o prywatności i zgodności

UUID v1 i UUID v6 mogą kodować czas utworzenia oraz informacje o węźle. Traktuj je jako identyfikatory operacyjne, a nie sekrety, i unikaj ich ujawniania, gdy metadane znacznika czasu lub węzła mogą być wrażliwe. To narzędzie działa lokalnie w przeglądarce i nie przesyła Twoich UUID.
